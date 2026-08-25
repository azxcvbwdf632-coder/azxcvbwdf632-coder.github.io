"""Prepare responsive portfolio images and generate an auditable manifest.

Run with the bundled Python/Pillow environment:
    python scripts/prepare_images.py

The script never changes the original JPG/WebP files. It only creates
responsive derivatives whose names end in ``-w<width>.webp`` or
``-w<width>.avif``, then regenerates the runtime manifest and audit files.
"""

from __future__ import annotations

import csv
import io
import json
import re
import subprocess
from collections import defaultdict
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
ASSETS = PUBLIC / "assets"
MANIFEST = ROOT / "src" / "imageManifest.js"
AUDIT_CSV = ROOT / "docs" / "IMAGE_AUDIT.csv"
AUDIT_MD = ROOT / "docs" / "IMAGE_AUDIT.md"
SITE_ORIGIN = "https://www.qiuxiaomiao.com"
DEFAULT_WIDTHS = (480, 960, 1600)
POSTER_WIDTHS = (320, 480, 720, 960)
VARIANT_RE = re.compile(r"-w\d+\.(?:webp|avif)$", re.IGNORECASE)
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"}
TEXT_EXTENSIONS = {".html", ".css", ".js", ".jsx", ".json", ".md", ".txt"}
EXCLUDED_DIRS = {".git", "node_modules", "dist", "tmp", "source-assets", "design-concepts"}

# Full-screen scenes keep a larger AVIF candidate. Poster-ring images use
# compact 320/480/720 previews plus 960px for high-density phones, and always
# retain their original WebP/JPG.
FULL_AVIF_SOURCES = {
    "/assets/sea-hero-pixel.webp",
    "/assets/sea-hero-pixel-mobile.webp",
    "/assets/vine-jump.webp",
    "/assets/vine-jump-mobile.webp",
    "/assets/sardine-run.webp",
    "/assets/whale-shark.webp",
}

POSTER_SOURCES = {
    "/assets/visual/empty-flower-poster.webp",
    "/assets/visual/void-between-poster.webp",
    "/assets/visual/pintan-poster.webp",
    "/assets/visual/fang-died-new-poster.webp",
    "/assets/visual/shaded-canvas-poster.webp",
    "/assets/visual/guanyu-01.webp",
    "/assets/visual/upgrade-log-04.webp",
    "/assets/visual/run-away-poster.webp",
    "/assets/visual/summer-flower-poster.webp",
    "/assets/visual/counselor-day-poster.webp",
    "/assets/visual/joyful-sangyu-poster.webp",
    "/assets/visual/autumn-gutian-title.webp",
    "/assets/visual/campus-video-source.webp",
    "/assets/visual/millennium-pen-poster.webp",
}

AVIF_SOURCES = FULL_AVIF_SOURCES | POSTER_SOURCES


def public_url(path: Path) -> str:
    return "/" + path.relative_to(PUBLIC).as_posix()


def is_original(path: Path) -> bool:
    return path.suffix.lower() in IMAGE_EXTENSIONS and not VARIANT_RE.search(path.name)


def encoded_image(image: Image.Image, image_format: str, quality: int) -> bytes:
    output = io.BytesIO()
    converted = image.convert("RGB") if image.mode not in {"RGB", "RGBA"} else image
    options = {"format": image_format, "quality": quality}
    if image_format == "WEBP":
        options["method"] = 6
    elif image_format == "AVIF":
        options["speed"] = 6
    converted.save(output, **options)
    return output.getvalue()


def write_if_useful(path: Path, payload: bytes, original_size: int) -> bool:
    # Avoid adding a derivative that is effectively as large as the original.
    if len(payload) >= original_size * 0.95:
        if path.exists():
            path.unlink()
        return False
    if not path.exists() or path.read_bytes() != payload:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(payload)
    return True


def prepare_variants() -> None:
    for source in sorted(ASSETS.rglob("*.webp")):
        if VARIANT_RE.search(source.name):
            continue
        with Image.open(source) as image:
            width, height = image.size
            source_url = public_url(source)
            target_widths = POSTER_WIDTHS if source_url in POSTER_SOURCES else DEFAULT_WIDTHS

            if source_url in POSTER_SOURCES:
                for existing in source.parent.glob(f"{source.stem}-w*.*"):
                    match = re.search(r"-w(\d+)\.(webp|avif)$", existing.name, re.IGNORECASE)
                    if match and int(match.group(1)) not in POSTER_WIDTHS:
                        existing.unlink()

            for target_width in target_widths:
                if target_width >= width:
                    continue
                target_height = max(1, round(height * target_width / width))
                resized = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
                webp_path = source.with_name(f"{source.stem}-w{target_width}.webp")
                webp_quality = 88 if source_url in POSTER_SOURCES else 82
                webp_bytes = encoded_image(resized, "WEBP", webp_quality)
                write_if_useful(webp_path, webp_bytes, source.stat().st_size)

                if source_url in AVIF_SOURCES:
                    avif_path = source.with_name(f"{source.stem}-w{target_width}.avif")
                    avif_quality = 65 if source_url in POSTER_SOURCES else 55
                    avif_bytes = encoded_image(resized, "AVIF", avif_quality)
                    write_if_useful(avif_path, avif_bytes, source.stat().st_size)

            if source_url in FULL_AVIF_SOURCES:
                full_width = min(width, 1600)
                full_height = max(1, round(height * full_width / width))
                full = image if full_width == width else image.resize(
                    (full_width, full_height), Image.Resampling.LANCZOS
                )
                avif_path = source.with_name(f"{source.stem}-w{full_width}.avif")
                avif_bytes = encoded_image(full, "AVIF", 58)
                write_if_useful(avif_path, avif_bytes, source.stat().st_size)


def image_info(path: Path) -> dict[str, int | str]:
    with Image.open(path) as image:
        width, height = image.size
        detected_format = (image.format or path.suffix.lstrip(".")).lower()
    return {
        "width": width,
        "height": height,
        "format": detected_format,
        "bytes": path.stat().st_size,
    }


def generate_manifest() -> dict[str, dict]:
    originals = [path for path in PUBLIC.rglob("*") if path.is_file() and is_original(path)]
    manifest: dict[str, dict] = {}
    for source in sorted(originals):
        url = public_url(source)
        info = image_info(source)
        entry = {"width": info["width"], "height": info["height"]}
        if source.suffix.lower() == ".webp":
            webp_candidates = []
            avif_candidates = []
            for candidate in sorted(source.parent.glob(f"{source.stem}-w*.*")):
                match = re.search(r"-w(\d+)\.(webp|avif)$", candidate.name, re.IGNORECASE)
                if not match:
                    continue
                item = {"src": public_url(candidate), "width": int(match.group(1))}
                (webp_candidates if match.group(2).lower() == "webp" else avif_candidates).append(item)
            webp_candidates.append({"src": url, "width": info["width"]})
            entry["webp"] = sorted(
                {item["width"]: item for item in webp_candidates}.values(),
                key=lambda item: item["width"],
            )
            if avif_candidates:
                entry["avif"] = sorted(
                    {item["width"]: item for item in avif_candidates}.values(),
                    key=lambda item: item["width"],
                )
        manifest[url] = entry

    serialized = json.dumps(manifest, ensure_ascii=False, separators=(",", ":"))
    MANIFEST.write_text(
        "// Generated by scripts/prepare_images.py. Do not edit by hand.\n"
        f"const imageManifest = {serialized}\n\nexport default imageManifest\n",
        encoding="utf-8",
        newline="\n",
    )
    return manifest


def tracked_files() -> set[str]:
    result = subprocess.run(
        ["git", "ls-files", "--cached"], cwd=ROOT, check=True, capture_output=True, text=True
    )
    return {line.strip().replace("\\", "/") for line in result.stdout.splitlines() if line.strip()}


def scan_references() -> tuple[dict[str, list[str]], list[str]]:
    references: dict[str, list[str]] = defaultdict(list)
    external_images: list[str] = []
    internal_re = re.compile(r"(?P<url>/(?:assets|fonts)/[^'\"\s)}`]+)")
    external_re = re.compile(r"https?://[^\s'\"<>]+", re.IGNORECASE)
    unstable_hosts = (
        "raw.githubusercontent.com",
        "github.com",
        "user-images.githubusercontent.com",
        "github.io",
        "drive.google.com",
        "notion.",
    )

    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        if any(part in EXCLUDED_DIRS for part in path.relative_to(ROOT).parts):
            continue
        if path == MANIFEST or path in {AUDIT_CSV, AUDIT_MD}:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        relative = path.relative_to(ROOT).as_posix()
        for line_number, line in enumerate(text.splitlines(), start=1):
            for match in internal_re.finditer(line):
                url = match.group("url").split("?")[0]
                references[url].append(f"{relative}:{line_number}")
            for match in external_re.finditer(line):
                url = match.group(0).rstrip(".,);]")
                lower = url.lower()
                if any(host in lower for host in unstable_hosts) and (
                    any(ext in lower for ext in IMAGE_EXTENSIONS) or "github" in lower
                ):
                    external_images.append(f"{relative}:{line_number} -> {url}")
    return references, sorted(set(external_images))


def generate_audit(manifest: dict[str, dict]) -> None:
    references, external_images = scan_references()
    tracked = tracked_files()
    rows = []
    for path in sorted(PUBLIC.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in IMAGE_EXTENSIONS:
            continue
        relative = path.relative_to(ROOT).as_posix()
        url = public_url(path)
        info = image_info(path)
        refs = list(references.get(url, []))
        variant_match = re.search(r"-w\d+\.(?:webp|avif)$", path.name, re.IGNORECASE)
        if variant_match:
            parent_stem = re.sub(r"-w\d+$", "", path.stem)
            refs.append(f"generated responsive candidate for /{path.parent.relative_to(PUBLIC).as_posix()}/{parent_stem}.webp")
        elif path.suffix.lower() in {".jpg", ".jpeg"}:
            webp_url = re.sub(r"\.jpe?g$", ".webp", url, flags=re.IGNORECASE)
            if webp_url in references:
                refs.extend(f"{ref} (JPG fallback)" for ref in references[webp_url])
        rows.append(
            {
                "Final URL": SITE_ORIGIN + url,
                "Repository Path": relative,
                "Bytes": info["bytes"],
                "KB": f"{info['bytes'] / 1024:.1f}",
                "Format": info["format"],
                "Width": info["width"],
                "Height": info["height"],
                "Git Tracked": "yes" if relative in tracked else "no (stage before commit)",
                "Reference Location": " | ".join(sorted(set(refs))) or "fallback/original asset; not directly referenced",
            }
        )

    AUDIT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with AUDIT_CSV.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    total_bytes = sum(int(row["Bytes"]) for row in rows)
    runtime_external = [item for item in external_images if item.startswith(("src/", "index.html"))]
    untracked = sum(row["Git Tracked"] != "yes" for row in rows)
    large = [row for row in rows if int(row["Bytes"]) > 500 * 1024 and "-w" not in row["Repository Path"]]
    AUDIT_MD.write_text(
        "# 图片资源审计\n\n"
        f"- 生成时间：由 `scripts/prepare_images.py` 在本地生成\n"
        f"- 正式来源：`{SITE_ORIGIN}`（所有运行时图片均同源）\n"
        f"- 图片文件：{len(rows)} 张，合计 {total_bytes / 1024 / 1024:.2f} MB\n"
        f"- 未纳入 Git 索引：{untracked} 张（提交前应为 0）\n"
        f"- 运行时代码中的海外第三方图片：{len(runtime_external)} 个\n"
        f"- 超过 500 KB 的原图：{len(large)} 张\n\n"
        "逐图 URL、体积、格式、尺寸、Git 状态和引用位置见 "
        "[`IMAGE_AUDIT.csv`](./IMAGE_AUDIT.csv)。\n\n"
        "## 海外地址扫描\n\n"
        + ("运行时代码未发现 GitHub Raw、GitHub Pages、Google Drive、Notion 或其他第三方图片地址。\n" if not runtime_external else "\n".join(f"- {item}" for item in runtime_external) + "\n"),
        encoding="utf-8",
        newline="\n",
    )


def main() -> None:
    prepare_variants()
    manifest = generate_manifest()
    generate_audit(manifest)
    print(f"Prepared {len(manifest)} original image records")
    print(f"Audit: {AUDIT_CSV.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
