import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import AestheticDialog from './components/AestheticDialog'

const sceneIds = ['home', 'about', 'operations', 'films', 'contact']
const navItems = [
  { id: 'about', label: '关于我' },
  { id: 'operations', label: '账号运营' },
  { id: 'films', label: '影像作品' },
  { id: 'contact', label: '联系我' },
]

function getInitialRoute() {
  const hash = window.location.hash.replace('#', '')
  if (hash === 'about-inputs') return { index: 1, aesthetic: true }
  const index = sceneIds.indexOf(hash)
  return { index: index >= 0 ? index : 0, aesthetic: false }
}

const experienceGroups = [
  {
    title: '校园实践',
    entries: [
      {
        period: '2023.09 — 2026.07',
        role: '校团委融媒体中心 · 影音中心副主任',
        detail: '统筹 6 场大型活动直播，累计观看 22,053+；校园人物专访系列累计播放 10w+。',
      },
    ],
  },
  {
    title: '实习与项目',
    entries: [
      {
        period: '2025.06 — 2025.08',
        role: '福州掌易信息科技 · 运营实习',
        detail: '参与行业研究、数据复盘、内容策划与项目执行，支持从需求到交付的完整流程。',
      },
      {
        period: '2025.06 — 2025.08',
        role: '网易「声浪计划」· 用户增长',
        detail: '4 周发布 72 篇笔记，后续产出 45 篇；互动率提升约 15%，获网易官方认证。',
      },
      {
        period: '2026.02.13',
        role: '抖音 × 泉州文旅西街 · 直播活动运营',
        detail: '参与线下直播场景搭建、流程设计与物料对接，协调活动方、执行团队与达人三方需求。',
      },
    ],
  },
]

const operationCases = [
  {
    id: 'douyin',
    tab: '抖音账号',
    label: '个人账号运营',
    title: '用多方向内容测试，找到可持续的流量入口',
    description: '持续测试泛娱乐、美食、省钱、热点与口播等内容形式，根据完播、互动和真实反馈调整选题与表达。',
    metrics: [
      { value: '313.7万', label: '单条最高播放' },
      { value: '4.3万', label: '主案例点赞' },
      { value: '3.2万', label: '主案例分享' },
      { value: '5 类', label: '内容方向测试' },
    ],
    images: [
      {
        src: '/assets/douyin-313.jpg',
        title: '斜视焦虑点切入 · 313.7万播放',
        detail: '用极短时长保障完播率，以侧躺玩手机可能导致斜视的焦虑点触发讨论与转发。',
      },
      {
        src: '/assets/operations/douyin-hot-topic.jpg',
        title: '热点讨论 · 14.4万播放',
        detail: '及时跟进“蝴蝶酥”争议，梳理事件脉络并补充个人观点，降低路人理解门槛。',
      },
      {
        src: '/assets/operations/douyin-food.jpg',
        title: '闽南美食图文 · 8.3万播放',
        detail: '用地域化语言和生活化表达吸引精准兴趣流量。',
      },
      {
        src: '/assets/operations/douyin-film-review.jpg',
        title: '口播影评 · 6.6万播放',
        detail: '分享观影感受与影片结构理解，并在影片宣传窗口期承接热点流量。',
      },
      {
        src: '/assets/operations/douyin-saving.jpg',
        title: '省钱干货 · 5.9万播放',
        detail: '实用型外卖省钱内容获得大量真实反馈，受限流后仍凭干货价值持续跑量。',
      },
    ],
  },
  {
    id: 'overseas',
    tab: '海外社媒',
    label: 'X / Twitter 账号运营',
    title: '从冷启动切入，逐步建立垂直内容定位',
    description: '以泛流量内容完成冷启动，再转向男性健康垂直知识，并持续探索 AI 运用与个人成长方向。',
    metrics: [
      { value: '1,872', label: '关注者' },
      { value: '67万', label: '首篇长文浏览' },
      { value: '39万', label: '第二篇长文浏览' },
      { value: '53万', label: '泛流量单篇最高' },
    ],
    images: [
      {
        src: '/assets/operations/x-profile.png',
        title: '海外社媒账号主页',
        detail: '账号从泛流量引流逐步转向男性健康垂直内容，以专业知识建立关注理由。',
        objectPosition: 'center top',
        stageAlign: 'start',
      },
    ],
  },
  {
    id: 'campus',
    tab: '校园融媒体',
    label: '校团委融媒体中心',
    title: '把直播执行沉淀成可复用的协作流程',
    description: '统筹腾飞杯篮球赛、迎新晚会等 6 场大型活动直播，制定跨团队协作 SOP，统一需求对接与执行标准。',
    metrics: [
      { value: '22,053+', label: '累计观看' },
      { value: '33,011+', label: '累计播放' },
      { value: '16,192', label: '单场最高点赞' },
      { value: '80%+', label: '预约转化率' },
    ],
    images: [
      {
        src: '/assets/operations/campus-project.jpg',
        title: '校园内容制作与发布',
        detail: '参与闽南师范大学官方账号内容制作和发布，覆盖策划、拍摄与成片交付。',
        objectPosition: 'center bottom',
        stageAlign: 'end',
      },
      ...Array.from({ length: 6 }, (_, index) => ({
        src: `/assets/operations/campus-live-${String(index + 1).padStart(2, '0')}.png`,
        title: `大型活动直播数据 · 0${index + 1}`,
        detail: '直播后台原始数据截图，展示观看、互动、预约及传播表现。',
        stageLabel: '图为部分直播数据',
      })),
    ],
  },
]

const works = [
  {
    title: '《空花阳焰》',
    type: '微电影',
    role: '摄影',
    poster: '/assets/visual/empty-flower-poster.png',
    posterPosition: '50% 36%',
    frames: [
      { label: '蓝紫夜色', image: '/assets/visual/empty-flower-01.jpg', position: 'center', size: 'cover' },
      { label: '镜面人物', image: '/assets/visual/empty-flower-02.jpg', position: 'center', size: 'cover' },
      { label: '卧室静帧', image: '/assets/visual/empty-flower-03.jpg', position: 'center', size: 'cover' },
      { label: '暗调人物', image: '/assets/visual/empty-flower-04.jpg', position: 'center', size: 'cover' },
    ],
  },
  {
    title: '《逃跑也没关系》',
    type: '剧情片',
    role: '摄影',
    poster: '/assets/visual/run-away-poster.webp',
    posterPosition: 'center',
    posterSize: 'cover',
    frames: [
      {
        label: '短片片段',
        image: '/assets/visual/run-away-01.webp',
        video: '/assets/visual/run-away-clip.mp4',
        position: 'center',
        size: 'cover',
      },
      { label: '剧情静帧 01', image: '/assets/visual/run-away-01.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 02', image: '/assets/visual/run-away-02.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 03', image: '/assets/visual/run-away-03.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 04', image: '/assets/visual/run-away-04.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 05', image: '/assets/visual/run-away-05.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 06', image: '/assets/visual/run-away-06.webp', position: 'center', size: 'cover' },
    ],
  },
  {
    title: '《凭谈》',
    type: '剧情片',
    role: '灯光',
    poster: '/assets/visual/pintan-poster.webp',
    posterPosition: 'center',
    posterSize: 'cover',
    frames: [
      { label: '剧情静帧 01', image: '/assets/visual/pintan-01.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 02', image: '/assets/visual/pintan-02.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 03', image: '/assets/visual/pintan-03.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 04', image: '/assets/visual/pintan-04.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 05', image: '/assets/visual/pintan-05.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 06', image: '/assets/visual/pintan-06.webp', position: 'center', size: 'cover' },
    ],
  },
  {
    title: '《绘涩》',
    type: '剧情片',
    role: '灯光',
    poster: '/assets/visual/shaded-canvas-poster.webp',
    posterPosition: 'center',
    posterSize: 'cover',
    frames: [
      { label: '剧情静帧 01', image: '/assets/visual/shaded-canvas-01.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 02', image: '/assets/visual/shaded-canvas-02.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 03', image: '/assets/visual/shaded-canvas-03.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 04', image: '/assets/visual/shaded-canvas-04.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 05', image: '/assets/visual/shaded-canvas-05.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 06', image: '/assets/visual/shaded-canvas-06.webp', position: 'center', size: 'cover' },
    ],
  },
  {
    title: '《等等》',
    type: '微电影',
    role: '灯光',
    poster: '/assets/visual/void-between-poster.jpg',
    posterPosition: 'center',
    frames: [
      { label: '剧院外景', image: '/assets/visual/void-between-01.jpg', position: 'center', size: 'cover' },
      { label: '门前人物', image: '/assets/visual/void-between-02.jpg', position: 'center', size: 'cover' },
      { label: '街巷同行', image: '/assets/visual/void-between-03.jpg', position: 'center', size: 'cover' },
      { label: '远去背影', image: '/assets/visual/void-between-04.jpg', position: 'center', size: 'cover' },
    ],
  },
  {
    title: '《芳死去的那天》',
    type: '剧情片',
    role: '副摄影 · 灯光',
    poster: '/assets/visual/fang-died-new-poster.webp',
    posterPosition: 'center',
    posterSize: 'cover',
    frames: [
      {
        label: '视频片段 01',
        image: '/assets/visual/fang-died-new-01.webp',
        video: '/assets/visual/fang-died-clip-01.mp4',
        position: 'center',
        size: 'cover',
      },
      {
        label: '视频片段 02',
        image: '/assets/visual/fang-died-new-02.webp',
        video: '/assets/visual/fang-died-clip-02.mp4',
        position: 'center',
        size: 'cover',
      },
      { label: '剧情静帧 01', image: '/assets/visual/fang-died-new-01.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 02', image: '/assets/visual/fang-died-new-02.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 03', image: '/assets/visual/fang-died-new-03.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 04', image: '/assets/visual/fang-died-new-04.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 05', image: '/assets/visual/fang-died-new-05.webp', position: 'center', size: 'cover' },
      { label: '剧情静帧 06', image: '/assets/visual/fang-died-new-06.webp', position: 'center', size: 'cover' },
    ],
  },
  {
    title: '《辅导员的一天》',
    type: '校园人物短片',
    role: '摄影 · 策划',
    poster: '/assets/visual/counselor-day-poster.webp',
    posterPosition: 'center',
    posterSize: 'cover',
    frames: [
      { label: '人物静帧 01', image: '/assets/visual/counselor-day-01.webp', position: 'center', size: 'cover' },
      { label: '人物静帧 02', image: '/assets/visual/counselor-day-02.webp', position: 'center', size: 'cover' },
      { label: '人物静帧 03', image: '/assets/visual/counselor-day-03.webp', position: 'center', size: 'cover' },
      { label: '人物静帧 04', image: '/assets/visual/counselor-day-04.webp', position: 'center', size: 'cover' },
      { label: '人物静帧 05', image: '/assets/visual/counselor-day-05.webp', position: 'center', size: 'cover' },
    ],
  },
  {
    title: '《乐享桑愉》',
    type: '纪录片',
    role: '导演',
    poster: '/assets/visual/joyful-sangyu-poster.webp',
    posterPosition: 'center',
    posterSize: 'cover',
    frames: [
      { label: '纪录片静帧 01', image: '/assets/visual/joyful-sangyu-01.webp', position: 'center', size: 'cover' },
      { label: '纪录片静帧 02', image: '/assets/visual/joyful-sangyu-02.webp', position: 'center', size: 'cover' },
      { label: '纪录片静帧 03', image: '/assets/visual/joyful-sangyu-03.webp', position: 'center', size: 'cover' },
      { label: '纪录片静帧 04', image: '/assets/visual/joyful-sangyu-04.webp', position: 'center', size: 'cover' },
      { label: '纪录片静帧 05', image: '/assets/visual/joyful-sangyu-05.webp', position: 'center', size: 'cover' },
      { label: '纪录片静帧 06', image: '/assets/visual/joyful-sangyu-06.webp', position: 'center', size: 'cover' },
    ],
  },
  {
    title: '《秋听古田》',
    type: '城市宣传片',
    role: '摄影 · “爱我古田”短视频大赛三等奖',
    poster: '/assets/visual/autumn-gutian-title.jpg',
    posterPosition: '50% 50%',
    frames: [
      { label: '片名字帧', image: '/assets/visual/autumn-gutian-title.jpg', position: 'center', size: 'cover' },
      { label: '官方发布数据', image: '/assets/visual/autumn-gutian-publish.jpg', position: 'center', size: 'contain' },
    ],
  },
  {
    title: '《青马学员说》',
    type: '系列专题视频',
    role: '导演 · 策划 · 采访 · 团队拍摄统筹',
    poster: '/assets/visual/campus-video-source.jpg',
    posterPosition: 'center top',
    posterSize: 'auto 200%',
    frames: [
      { label: '《青马学员说》项目页', image: '/assets/visual/campus-video-source.jpg', position: 'center top', size: 'auto 200%' },
    ],
  },
  {
    title: '《青年先锋说》',
    type: '人物专访系列',
    role: '导演 · 执行方案',
    poster: '/assets/visual/campus-video-source.jpg',
    posterPosition: 'center bottom',
    posterSize: 'auto 200%',
    frames: [
      { label: '《青年先锋说》项目页', image: '/assets/visual/campus-video-source.jpg', position: 'center bottom', size: 'auto 200%' },
    ],
  },
  {
    title: '《三百六十行 行行有关羽》',
    type: 'AIGC 短片',
    role: 'AIGC 角色与场景创作',
    poster: '/assets/visual/guanyu-01.png',
    posterPosition: 'center',
    dialogClass: 'long-title',
    frames: [
      { label: '夜色城市', image: '/assets/visual/guanyu-01.png', position: 'center', size: 'cover' },
      { label: '文化场景', image: '/assets/visual/guanyu-02.png', position: 'center', size: 'cover' },
      { label: '快递关羽', image: '/assets/visual/guanyu-03.png', position: 'center', size: 'cover' },
      { label: '角色三视图', image: '/assets/visual/guanyu-character-sheet.png', position: 'center', size: 'contain' },
    ],
  },
  {
    title: '《升级日志》',
    type: '大广赛 AIGC 短片',
    role: 'AIGC 视觉创作',
    poster: '/assets/visual/upgrade-log-04.png',
    posterPosition: 'center',
    frames: [
      { label: '系统启动', image: '/assets/visual/upgrade-log-01.png', position: 'center', size: 'cover' },
      { label: '模型升级', image: '/assets/visual/upgrade-log-02.png', position: 'center', size: 'cover' },
      { label: '职业上限', image: '/assets/visual/upgrade-log-03.png', position: 'center', size: 'cover' },
      { label: '安装界面', image: '/assets/visual/upgrade-log-04.png', position: 'center', size: 'cover' },
    ],
  },
  {
    title: '《千年笔魂》',
    type: '纪录片',
    role: '导演 · 摄影',
    poster: '/assets/visual/millennium-pen-poster.jpg',
    posterPosition: 'center',
    posterSize: 'contain',
    frames: [
      {
        label: '纪录片片段',
        image: '/assets/visual/millennium-pen-frame.png',
        video: '/assets/visual/millennium-pen-clip.mp4',
        position: 'center',
        size: 'cover',
      },
      { label: '匠心传承', image: '/assets/visual/millennium-pen-frame.png', position: 'center', size: 'cover' },
    ],
  },
]

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduced
}

const WaterTransition = forwardRef(function WaterTransition(_, ref) {
  const canvasRef = useRef(null)
  const frameRef = useRef(0)

  useImperativeHandle(ref, () => ({
    play(direction, onCover, onDone) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const scale = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(window.innerWidth * scale)
      canvas.height = Math.round(window.innerHeight * scale)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(scale, 0, 0, scale, 0, 0)

      const width = window.innerWidth
      const height = window.innerHeight
      const cell = width < 640 ? 14 : 22
      const palette = ['#000000', '#031b2e', '#07517a', '#0f6f9d', '#158fd2', '#46d7e8']
      const started = performance.now()
      const duration = width < 640 ? 780 : 940
      const travelDirection = direction >= 0 ? 1 : -1
      let swapped = false

      const draw = (now) => {
        const progress = Math.min((now - started) / duration, 1)
        const phase = progress < 0.5 ? progress * 2 : (progress - 0.5) * 2
        const easedPhase = phase < 0.5
          ? 4 * phase * phase * phase
          : 1 - ((-2 * phase + 2) ** 3) / 2
        const cover = progress < 0.5 ? easedPhase : 1
        const reveal = progress > 0.5 ? easedPhase : 0
        ctx.clearRect(0, 0, width, height)

        for (let x = 0; x < width + cell; x += cell) {
          const wave = Math.sin(x * 0.018 + progress * 8) * cell * 1.65
          const coverLine = travelDirection > 0
            ? height * (1 - cover) + wave
            : height * cover + wave
          const revealLine = travelDirection > 0
            ? height * reveal + wave
            : height * (1 - reveal) + wave
          for (let y = 0; y < height + cell; y += cell) {
            const noise = (((x / cell) * 17 + (y / cell) * 31) % 7) * 2
            const visible = travelDirection > 0
              ? (progress <= 0.5 ? y >= coverLine + noise : y >= revealLine + noise)
              : (progress <= 0.5 ? y <= coverLine + noise : y <= revealLine + noise)
            if (!visible) continue
            const depth = Math.max(0, Math.min(1, y / height))
            const colorIndex = Math.min(
              palette.length - 1,
              Math.floor(depth * palette.length + ((x + y) / cell) % 2),
            )
            ctx.fillStyle = palette[colorIndex]
            ctx.fillRect(x, y, cell + 1, cell + 1)
          }
        }

        if (!swapped && progress >= 0.5) {
          swapped = true
          onCover()
        }

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(draw)
        } else {
          ctx.clearRect(0, 0, width, height)
          onDone()
        }
      }

      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(draw)
    },
  }))

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])
  return <canvas ref={canvasRef} className="water-transition" aria-hidden="true" />
})

function PixelEdge() {
  return <div className="pixel-edge" aria-hidden="true" />
}

function Header({ active, navigate, mobileOpen, setMobileOpen }) {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate(0)} aria-label="返回首页">
        邱孝淼 <span>/ 淼淼</span>
      </button>
      <nav className="desktop-nav" aria-label="主导航">
        {navItems.map((item) => {
          const index = sceneIds.indexOf(item.id)
          return (
            <button
              key={item.id}
              className={active === index ? 'active' : ''}
              onClick={() => navigate(index)}
            >
              {item.label}
            </button>
          )
        })}
      </nav>
      <button
        className={`menu-button ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen((value) => !value)}
        aria-expanded={mobileOpen}
        aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
      >
        <span />
        <span />
      </button>
      <nav className={`mobile-nav ${mobileOpen ? 'open' : ''}`} aria-label="移动端导航">
        {navItems.map((item) => {
          const index = sceneIds.indexOf(item.id)
          return (
            <button
              key={item.id}
              className={active === index ? 'active' : ''}
              onClick={() => {
                navigate(index)
                setMobileOpen(false)
              }}
            >
              {item.label}
              <span aria-hidden="true">↘</span>
            </button>
          )
        })}
      </nav>
    </header>
  )
}

function ScrollCue({ label = '向下潜入', onClick }) {
  return (
    <button className="scroll-cue" onClick={onClick}>
      <span className="cue-arrow" aria-hidden="true">⌄</span>
      <span>{label}</span>
    </button>
  )
}

function HeroScene({ active, next, intro }) {
  return (
    <section id="home" className={`scene hero-scene ${active ? 'active' : ''} ${intro ? 'intro' : ''}`} aria-hidden={!active}>
      <picture>
        <source media="(max-width: 760px)" srcSet="/assets/sea-hero-pixel-mobile.png" />
        <img className="scene-image hero-image" src="/assets/sea-hero-pixel.png" alt="像素海面中漂浮的人物" />
      </picture>
      <div className="hero-vignette" aria-hidden="true" />
      <PixelEdge />
      <div className="hero-copy">
        <h1>邱孝淼</h1>
        <p>有影像审美的内容运营者</p>
      </div>
      <ScrollCue onClick={next} />
    </section>
  )
}

function AboutScene({ active, next, openAesthetic }) {
  return (
    <section id="about" className={`scene about-scene ${active ? 'active' : ''}`} aria-hidden={!active}>
      <div className="about-grid">
        <div className="about-copy">
          <h2>关于我</h2>
          <span className="descent-mark" aria-hidden="true">⋮<br />⌄</span>
          <p>我用影像理解内容，<br />也用数据验证表达。</p>
          <ul className="skill-list" aria-label="能力标签">
            <li>摄影</li>
            <li>内容运营</li>
            <li>AI 工具</li>
          </ul>
          <a
            className="aesthetic-entry"
            href="#about-inputs"
            onClick={openAesthetic}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchEnd={(event) => {
              event.stopPropagation()
              openAesthetic()
            }}
          >
            进入我的输入源
            <span aria-hidden="true">↘</span>
          </a>
          <small>闽南师范大学 · 广播电视编导专业 · 2027届</small>
        </div>
        <figure className="about-media">
          <img src="/assets/vine-jump.jpg" alt="在菲律宾体验树藤跳水" />
          <PixelEdge />
        </figure>
        <div className="experience-stack" aria-label="个人经历">
          {experienceGroups.map((group) => (
            <article className="experience-card" key={group.title}>
              <h3>{group.title}</h3>
              {group.entries.map((entry) => (
                <div className="experience-entry" key={`${entry.period}-${entry.role}`}>
                  <time>{entry.period}</time>
                  <strong>{entry.role}</strong>
                  <p>{entry.detail}</p>
                </div>
              ))}
            </article>
          ))}
        </div>
      </div>
      <ScrollCue label="继续下潜" onClick={next} />
    </section>
  )
}

function OperationsScene({ active, next, openEvidence }) {
  return (
    <section id="operations" className={`scene operations-scene ${active ? 'active' : ''}`} aria-hidden={!active}>
      <div className="operations-cover">
        <h2>账号运营</h2>
        <p className="mobile-operation-copy">让内容被看见，<br />也让结果可以被验证。</p>
        <div className="mobile-operation-metrics" aria-label="账号运营代表数据，可左右滑动">
          <article>
            <strong>313.7万</strong>
            <span>单条最高播放</span>
          </article>
          <article>
            <strong>67万</strong>
            <span>海外长文浏览</span>
          </article>
          <article>
            <strong>22,053+</strong>
            <span>校园直播累计观看</span>
          </article>
        </div>
        <button className="case-entry" onClick={openEvidence}>
          查看案例
          <span aria-hidden="true">↘</span>
        </button>
      </div>
      <div className="operations-water" aria-hidden="true" />
      <PixelEdge />
      <ScrollCue label="查看影像" onClick={next} />
    </section>
  )
}

function FilmsScene({ active, next, openWork }) {
  const [orbitOffset, setOrbitOffset] = useState(() => Math.floor(works.length / 2))
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef({ pointerId: null, startX: 0, lastX: 0, moved: false, captured: false })
  const suppressClickRef = useRef(false)

  const rotateOrbit = useCallback((direction) => {
    setOrbitOffset((value) => (value + direction + works.length) % works.length)
  }, [])

  const handlePointerDown = (event) => {
    if (event.pointerType === 'touch') return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      moved: false,
      captured: false,
    }
    setDragging(true)
  }

  const handlePointerMove = (event) => {
    if (dragRef.current.pointerId !== event.pointerId) return
    const movement = event.clientX - dragRef.current.startX
    if (!dragRef.current.moved && Math.abs(movement) >= 8) {
      dragRef.current.moved = true
      dragRef.current.captured = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (!dragRef.current.moved) return
    const delta = event.clientX - dragRef.current.lastX
    if (Math.abs(delta) < 36) return
    rotateOrbit(delta > 0 ? -1 : 1)
    dragRef.current.lastX = event.clientX
  }

  const handlePointerUp = (event) => {
    if (dragRef.current.pointerId !== event.pointerId) return
    suppressClickRef.current = dragRef.current.moved
    if (dragRef.current.captured && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragRef.current.pointerId = null
    setDragging(false)
    window.setTimeout(() => {
      suppressClickRef.current = false
    }, 0)
  }

  const getOrbitSlot = (index) => {
    const half = Math.floor(works.length / 2)
    let slot = index - orbitOffset
    while (slot > half) slot -= works.length
    while (slot < -half) slot += works.length
    return slot
  }

  return (
    <section id="films" className={`scene films-scene ${active ? 'active' : ''}`} aria-hidden={!active}>
      <img className="scene-image sardine-image" src="/assets/sardine-run.jpg" alt="水下沙丁鱼风暴" />
      <div className="film-vignette" aria-hidden="true" />
      <PixelEdge />
      <h2>影像作品</h2>
      <div
        className={`film-orbit ${dragging ? 'is-dragging' : ''}`}
        data-count={works.length}
        aria-label="影像作品海报轨道，可左右拖动"
        tabIndex="0"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') rotateOrbit(-1)
          if (event.key === 'ArrowRight') rotateOrbit(1)
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {works.map((item, index) => {
          const slot = getOrbitSlot(index)
          const distance = Math.abs(slot)
          const visibleRadius = Math.min(4, Math.floor(works.length / 2))
          const visibleSlot = Math.max(-visibleRadius, Math.min(visibleRadius, slot))
          const hiddenBehindOrbit = distance > visibleRadius
          const left = 50 + visibleSlot * (46 / visibleRadius)
          const orbitDepth = Math.min(distance, visibleRadius) / visibleRadius
          // Lower the center poster and lift the outer posters into an inverted U.
          const top = -3 + (1 - Math.pow(orbitDepth, 1.45)) * 40
          const depthScale = 1 - Math.min(distance, visibleRadius) * 0.045
          return (
            <button
              className="film-frame"
              style={{
                '--index': index,
                top: `${top}%`,
                left: `${left}%`,
                zIndex: 20 - distance,
                opacity: hiddenBehindOrbit ? 0 : 1,
                pointerEvents: hiddenBehindOrbit ? 'none' : 'auto',
                transform: `translateX(-50%) scale(${depthScale})`,
                backgroundImage: `url(${item.poster})`,
                backgroundPosition: item.posterPosition,
                backgroundSize: item.posterSize || 'cover',
              }}
              key={item.title}
              onFocus={() => {
                if (hiddenBehindOrbit) setOrbitOffset(index)
              }}
              onClick={(event) => {
                if (suppressClickRef.current) {
                  event.preventDefault()
                  return
                }
                openWork(index)
              }}
              aria-label={`打开${item.title}`}
            >
              <span>{item.type}</span>
              <strong>{item.title}</strong>
            </button>
          )
        })}
      </div>
      <button className="orbit-control orbit-control-prev" onClick={() => rotateOrbit(-1)} aria-label="向左转动海报环">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7" /></svg>
      </button>
      <button className="orbit-control orbit-control-next" onClick={() => rotateOrbit(1)} aria-label="向右转动海报环">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>
      </button>
      <div className="film-selected" aria-live="polite">
        <p>
          <span className="desktop-only">拖动海报环浏览，点击进入每一部作品</span>
          <span className="mobile-only">左右滑动选择作品 · 点击查看静帧</span>
        </p>
      </div>
      <ScrollCue label="继续下潜" onClick={next} />
    </section>
  )
}

function ContactScene({ active, onWechat }) {
  return (
    <section id="contact" className={`scene contact-scene ${active ? 'active' : ''}`} aria-hidden={!active}>
      <img
        className="scene-image contact-video"
        src="/assets/whale-shark.jpg"
        alt="鲸鲨在深海中游动"
      />
      <div className="contact-vignette" aria-hidden="true" />
      <PixelEdge />
      <div className="contact-copy">
        <h2>一起做有审美、<br />也有效果的内容。</h2>
        <div className="contact-actions">
          <a className="primary-action" href="mailto:1182179009@qq.com">发送邮件</a>
          <button className="secondary-action" type="button" onClick={onWechat}>添加微信</button>
        </div>
        <a className="email-link" href="mailto:1182179009@qq.com">1182179009@qq.com</a>
      </div>
      <footer>邱孝淼 / 淼淼 · 2026</footer>
    </section>
  )
}

function WechatDialog({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="wechat-dialog" role="dialog" aria-modal="true" aria-label="添加微信" onMouseDown={(event) => event.stopPropagation()}>
        <button className="dialog-close" type="button" onClick={onClose} aria-label="关闭微信二维码">×</button>
        <small>联系我</small>
        <h2>添加微信</h2>
        <img src="/assets/wechat-qr.jpg" alt="微信二维码" />
        <p>请使用微信扫码添加我</p>
      </div>
    </div>
  )
}

function EvidenceDialog({ open, onClose }) {
  const [caseIndex, setCaseIndex] = useState(0)
  const [imageIndex, setImageIndex] = useState(0)

  const activeCase = operationCases[caseIndex]
  const activeImage = activeCase.images[imageIndex]

  useEffect(() => {
    if (!open) return
    setCaseIndex(0)
    setImageIndex(0)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="evidence-dialog case-dialog" role="dialog" aria-modal="true" aria-label="账号运营案例" onMouseDown={(event) => event.stopPropagation()}>
        <button className="dialog-close" onClick={onClose} aria-label="关闭">×</button>
        <header>
          <h2>运营案例</h2>
          <p>原始截图、内容判断与可验证的结果。</p>
        </header>
        <div className="case-tabs" role="tablist" aria-label="运营案例分类">
          {operationCases.map((item, index) => (
            <button
              className={caseIndex === index ? 'active' : ''}
              key={item.id}
              onClick={() => {
                setCaseIndex(index)
                setImageIndex(0)
              }}
              role="tab"
              aria-selected={caseIndex === index}
            >
              {item.tab}
            </button>
          ))}
        </div>
        <div className="case-layout">
          <div className="case-visual">
            <div className="case-image-stage">
              <img
                src={activeImage.src}
                alt={activeImage.title}
                style={{
                  objectPosition: activeImage.objectPosition || 'center',
                  alignSelf: activeImage.stageAlign || 'center',
                }}
              />
              {activeImage.stageLabel && <span className="case-image-label">{activeImage.stageLabel}</span>}
            </div>
            <div className="case-gallery" aria-label={`${activeCase.tab}原始截图`}>
              {activeCase.images.map((item, index) => (
                <button
                  className={imageIndex === index ? 'active' : ''}
                  key={item.src}
                  onClick={() => setImageIndex(index)}
                  aria-label={`查看${item.title}`}
                >
                  <img src={item.src} alt="" />
                </button>
              ))}
            </div>
          </div>
          <div className="case-details">
            <small>{activeCase.label}</small>
            <h3>{activeCase.title}</h3>
            <p>{activeCase.description}</p>
            <div className="case-metrics" aria-label={`${activeCase.tab}运营成果`}>
              {activeCase.metrics.map((metric) => (
                <article key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </article>
              ))}
            </div>
            <div className="case-caption" aria-live="polite">
              <strong>{activeImage.title}</strong>
              <p>{activeImage.detail}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkVideo({ frame }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const playVideo = () => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => setPlaying(false))
  }

  return (
    <div className="selected-frame video-frame-shell">
      <video
        ref={videoRef}
        className="selected-video"
        src={frame.video}
        poster={frame.image}
        controls
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        aria-label={frame.label}
      />
      {!playing ? (
        <button className="video-play-button" type="button" onClick={playVideo} aria-label={`播放${frame.label}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z" /></svg>
        </button>
      ) : null}
    </div>
  )
}

function WorkDialog({ workIndex, onClose }) {
  const [frameIndex, setFrameIndex] = useState(0)
  const work = workIndex === null ? null : works[workIndex]

  useEffect(() => setFrameIndex(0), [workIndex])
  useEffect(() => {
    if (!work) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [work, onClose])

  if (!work) return null
  const selectedFrame = work.frames[frameIndex]

  return (
    <div className="dialog-backdrop work-backdrop" role="presentation" onMouseDown={onClose}>
      <section className={`work-dialog ${work.dialogClass || ''}`} role="dialog" aria-modal="true" aria-label={`${work.title}作品静帧`} onMouseDown={(event) => event.stopPropagation()}>
        <button className="dialog-close" onClick={onClose} aria-label="返回作品海报环">×</button>
        <header className="work-heading">
          <small>{work.type}</small>
          <h2>{work.title}</h2>
          <p>{work.role}</p>
        </header>
        <div className="inner-orbit" data-frame-count={work.frames.length} aria-label={`${work.title}静帧环`}>
          {selectedFrame.video ? (
            <WorkVideo frame={selectedFrame} />
          ) : (
            <div
              className="selected-frame"
              style={{
                backgroundImage: `url(${selectedFrame.image})`,
                backgroundPosition: selectedFrame.position,
                backgroundSize: selectedFrame.size || '200% 200%',
              }}
              role="img"
              aria-label={selectedFrame.label}
            />
          )}
          {work.frames.map((frame, index) => (
            <button
              className={`inner-frame ${frameIndex === index ? 'selected' : ''}`}
              style={{
                '--frame-index': index,
                '--frame-count': work.frames.length,
                backgroundImage: `url(${frame.image})`,
                backgroundPosition: frame.position,
                backgroundSize: frame.size || '200% 200%',
              }}
              key={frame.label}
              onClick={() => setFrameIndex(index)}
              aria-label={`查看${frame.label}`}
            />
          ))}
        </div>
        <p className="frame-caption">{selectedFrame.label} · {String(frameIndex + 1).padStart(2, '0')} / {String(work.frames.length).padStart(2, '0')}</p>
      </section>
    </div>
  )
}

export default function App() {
  const reducedMotion = useReducedMotion()
  const appShellRef = useRef(null)
  const transitionRef = useRef(null)
  const initialRoute = getInitialRoute()
  const [active, setActive] = useState(initialRoute.index)
  const [introActive, setIntroActive] = useState(initialRoute.index === 0)
  const [transitioning, setTransitioning] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [workOpen, setWorkOpen] = useState(null)
  const [wechatOpen, setWechatOpen] = useState(false)
  const [aestheticOpen, setAestheticOpen] = useState(initialRoute.aesthetic)
  const touchStart = useRef({
    x: 0,
    y: 0,
    lastY: 0,
    lastAt: 0,
    velocityY: 0,
    inHorizontalScroller: false,
    interactiveTarget: false,
    dragging: false,
    active: false,
  })

  const navigate = useCallback((target) => {
    const next = Math.max(0, Math.min(sceneIds.length - 1, target))
    if (next === active || transitioning) return

    const commit = () => {
      setActive(next)
      window.history.replaceState(null, '', `#${sceneIds[next]}`)
    }

    if (reducedMotion) {
      commit()
      return
    }

    setTransitioning(true)
    transitionRef.current.play(next > active ? 1 : -1, commit, () => setTransitioning(false))
  }, [active, reducedMotion, transitioning])

  useEffect(() => {
    if (!introActive) return undefined
    const timer = window.setTimeout(() => setIntroActive(false), 1800)
    return () => window.clearTimeout(timer)
  }, [introActive])

  const openWechat = useCallback(() => {
    if (window.matchMedia('(max-width: 760px)').matches) {
      window.location.href = 'weixin://'
      window.setTimeout(() => setWechatOpen(true), 900)
      return
    }
    setWechatOpen(true)
  }, [])

  const openAesthetic = useCallback(() => {
    setAestheticOpen(true)
    window.history.replaceState(null, '', '#about-inputs')
  }, [])

  const closeAesthetic = useCallback(() => {
    setAestheticOpen(false)
    if (window.location.hash === '#about-inputs') window.history.replaceState(null, '', '#about')
  }, [])

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === '#about-inputs') {
        setActive(1)
        setAestheticOpen(true)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    const onWheel = (event) => {
      if (evidenceOpen || workOpen !== null || aestheticOpen || mobileOpen || transitioning || Math.abs(event.deltaY) < 24) return
      if (event.target instanceof Element
        && event.target.closest('button, a, input, textarea, select, [role="button"], .site-header, .dialog-backdrop')) return
      event.preventDefault()
      navigate(active + (event.deltaY > 0 ? 1 : -1))
    }
    const onKey = (event) => {
      if (evidenceOpen || workOpen !== null || aestheticOpen || mobileOpen) return
      if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault()
        navigate(active + 1)
      }
      if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        navigate(active - 1)
      }
      if (event.key === 'Home') navigate(0)
      if (event.key === 'End') navigate(sceneIds.length - 1)
    }
    const onTouchStart = (event) => {
      const touch = event.changedTouches[0]
      const now = performance.now()
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        lastY: touch.clientY,
        lastAt: now,
        velocityY: 0,
        inHorizontalScroller: event.target instanceof Element
          && Boolean(event.target.closest('.film-orbit, .metrics, .album-rail, .film-input-rail, .experience-stack, .mobile-operation-metrics, .artist-selector, .artist-albums')),
        interactiveTarget: event.target instanceof Element
          && Boolean(event.target.closest('button, a, input, textarea, select, [role="button"]')),
        dragging: false,
        active: true,
      }
    }
    const clearTouchPreview = () => {
      const shell = appShellRef.current
      if (!shell) return
      shell.classList.remove('touch-dragging')
      shell.style.removeProperty('--scene-drag-y')
      shell.style.removeProperty('--scene-drag-opacity')
    }
    const onTouchMove = (event) => {
      if (!touchStart.current.active || transitioning) return
      if (touchStart.current.inHorizontalScroller || touchStart.current.interactiveTarget) return
      if (event.target instanceof Element && event.target.closest('.dialog-backdrop, .site-header')) return

      const touch = event.changedTouches[0]
      const deltaX = touchStart.current.x - touch.clientX
      const deltaY = touchStart.current.y - touch.clientY
      if (Math.abs(deltaY) < 9 || Math.abs(deltaY) <= Math.abs(deltaX) * 1.08) return

      event.preventDefault()
      const now = performance.now()
      const elapsed = Math.max(1, now - touchStart.current.lastAt)
      touchStart.current.velocityY = (touchStart.current.lastY - touch.clientY) / elapsed
      touchStart.current.lastY = touch.clientY
      touchStart.current.lastAt = now
      touchStart.current.dragging = true

      const progress = Math.min(Math.abs(deltaY) / 150, 1)
      const dragY = Math.max(-54, Math.min(54, -deltaY * 0.28))
      const shell = appShellRef.current
      if (shell) {
        shell.classList.add('touch-dragging')
        shell.style.setProperty('--scene-drag-y', `${dragY}px`)
        shell.style.setProperty('--scene-drag-opacity', String(1 - progress * 0.12))
      }
    }
    const onTouchEnd = (event) => {
      if (!touchStart.current.active) return
      touchStart.current.active = false
      clearTouchPreview()
      if (evidenceOpen || workOpen !== null || aestheticOpen || mobileOpen || transitioning) return
      if (touchStart.current.interactiveTarget || event.target instanceof Element && event.target.closest('button, a, input, textarea, select, [role="button"]')) return
      if (event.target instanceof Element && event.target.closest('.dialog-backdrop, .site-header')) return
      if (touchStart.current.inHorizontalScroller) return
      const touch = event.changedTouches[0]
      const deltaX = touchStart.current.x - touch.clientX
      const deltaY = touchStart.current.y - touch.clientY
      const distanceIntent = Math.abs(deltaY) > 38
      const velocityIntent = Math.abs(touchStart.current.velocityY) > 0.32 && Math.abs(deltaY) > 20
      const isIntentionalVerticalSwipe = (distanceIntent || velocityIntent)
        && Math.abs(deltaY) > Math.abs(deltaX) * 1.08
      if (isIntentionalVerticalSwipe) navigate(active + (deltaY > 0 ? 1 : -1))
    }
    const onTouchCancel = () => {
      touchStart.current.active = false
      clearTouchPreview()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchCancel, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchCancel)
    }
  }, [active, aestheticOpen, evidenceOpen, mobileOpen, navigate, transitioning, workOpen])

  return (
    <main className="app-shell" ref={appShellRef}>
      <Header
        active={active}
        navigate={navigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <HeroScene active={active === 0} next={() => navigate(1)} intro={introActive} />
      <AboutScene active={active === 1} next={() => navigate(2)} openAesthetic={openAesthetic} />
      <OperationsScene active={active === 2} next={() => navigate(3)} openEvidence={() => setEvidenceOpen(true)} />
      <FilmsScene active={active === 3} next={() => navigate(4)} openWork={setWorkOpen} />
      <ContactScene active={active === 4} onWechat={openWechat} />
      <div className="scene-counter" aria-live="polite">
        <span>{String(active).padStart(2, '0')}</span>
        <i />
        <span>{String(sceneIds.length - 1).padStart(2, '0')}</span>
      </div>
      <WaterTransition ref={transitionRef} />
      <EvidenceDialog open={evidenceOpen} onClose={() => setEvidenceOpen(false)} />
      <WorkDialog workIndex={workOpen} onClose={() => setWorkOpen(null)} />
      <WechatDialog open={wechatOpen} onClose={() => setWechatOpen(false)} />
      <AestheticDialog open={aestheticOpen} onClose={closeAesthetic} />
    </main>
  )
}
