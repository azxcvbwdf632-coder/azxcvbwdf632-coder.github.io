import { useEffect, useState } from 'react'
import { aestheticAlbums, aestheticArtists, aestheticFilms } from '../data/aestheticInputs'

const tabs = [
  { id: 'music', label: '音乐' },
  { id: 'films', label: '电影' },
  { id: 'training', label: '训练' },
]

export default function AestheticDialog({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('music')
  const [activeArtist, setActiveArtist] = useState(0)

  useEffect(() => {
    if (!open) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="dialog-backdrop aesthetic-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="aesthetic-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aesthetic-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="dialog-close" type="button" onClick={onClose} aria-label="关闭我的输入源">×</button>
        <header className="aesthetic-heading">
          <div>
            <small>PERSONAL INPUTS / 01</small>
            <h2 id="aesthetic-title">我的输入源</h2>
          </div>
          <p>审美不是标签，是我持续靠近世界的方式。</p>
        </header>

        <div className="aesthetic-tabs" role="tablist" aria-label="我的输入源分类">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span aria-hidden="true">↘</span>
            </button>
          ))}
        </div>

        <div className="aesthetic-content">
          {activeTab === 'music' && (
            <div className="music-layout" role="tabpanel" aria-label="音乐">
              <section className="input-section artist-section">
                <div className="section-marker">A / ARTISTS</div>
                <h3>喜欢的歌手与专辑</h3>
                <div className="artist-selector mobile-only" aria-label="选择歌手">
                  {aestheticArtists.map((artist, index) => (
                    <button
                      type="button"
                      className={activeArtist === index ? 'active' : ''}
                      key={artist.name}
                      onClick={() => setActiveArtist(index)}
                    >
                      {artist.name}
                    </button>
                  ))}
                </div>
                <div className="artist-shelves">
                  {aestheticArtists.map((artist, artistIndex) => (
                    <section className={`artist-shelf ${activeArtist === artistIndex ? 'mobile-active' : ''}`} key={artist.name}>
                      <header className="artist-identity">
                        <span>{String(artistIndex + 1).padStart(2, '0')}</span>
                        <strong>{artist.name}</strong>
                        <small>{artist.romanized}</small>
                      </header>
                      <div className="artist-albums" aria-label={`${artist.name}的专辑`}>
                        {artist.albums.map((album, albumIndex) => (
                          <article className="album-card album-card-compact" key={album.title}>
                            <div className="album-cover">
                              <img src={album.cover} alt={`${artist.name}《${album.title}》专辑封面`} loading="lazy" decoding="async" />
                              <span>{String(albumIndex + 1).padStart(2, '0')}</span>
                            </div>
                            <p>{album.title}</p>
                          </article>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </section>

              <section className="input-section album-section">
                <div className="section-marker">B / RECORDS</div>
                <h3>反复听的专辑</h3>
                <div className="album-rail" aria-label="收藏专辑，可左右滑动">
                  {aestheticAlbums.map((album) => (
                    <article className="album-card" key={album.title}>
                      <div className="album-cover">
                        <img src={album.cover} alt={`${album.artist}《${album.title}》专辑封面`} loading="lazy" decoding="async" />
                        <span>{album.index}</span>
                      </div>
                      <p>{album.title}</p>
                      <small>{album.artist}</small>
                    </article>
                  ))}
                </div>
              </section>

              <section className="input-section live-section">
                <div className="section-marker">C / LIVE MOMENTS</div>
                <div className="live-input-intro">
                  <div>
                    <h3>耳机之外，我也喜欢去现场。</h3>
                    <p>张震岳全国演唱会与陈绮贞在广州草莓音乐节的现场，是我喜欢音乐最直接的样子。</p>
                  </div>
                  <span>04 MOMENTS</span>
                </div>
                <div className="live-event-groups" aria-label="演唱会与音乐节现场照片">
                  <section className="live-event-group">
                    <header><strong>张震岳全国演唱会</strong><span>01—02</span></header>
                    <div className="live-event-pair live-event-pair-portrait">
                      <figure className="live-input-photo">
                        <img src="/assets/inputs/live-zhang-zhenyue-01.webp" alt="张震岳全国演唱会现场留影" loading="lazy" decoding="async" />
                        <figcaption><span>01</span> 张震岳全国演唱会</figcaption>
                      </figure>
                      <figure className="live-input-photo">
                        <img src="/assets/inputs/live-zhang-zhenyue-quanzhou.webp" alt="张震岳全国演唱会蓝色舞台现场" loading="lazy" decoding="async" />
                        <figcaption><span>02</span> 张震岳全国演唱会</figcaption>
                      </figure>
                    </div>
                  </section>
                  <section className="live-event-group">
                    <header><strong>陈绮贞 · 广州草莓音乐节</strong><span>03—04</span></header>
                    <div className="live-event-pair live-event-pair-landscape">
                      <figure className="live-input-photo">
                        <img src="/assets/inputs/live-simple-life-01.webp" alt="陈绮贞在广州草莓音乐节的舞台现场" loading="lazy" decoding="async" />
                        <figcaption><span>03</span> 陈绮贞 · 广州草莓音乐节</figcaption>
                      </figure>
                      <figure className="live-input-photo">
                        <img src="/assets/inputs/live-simple-life-02.webp" alt="陈绮贞在广州草莓音乐节的夜间舞台现场" loading="lazy" decoding="async" />
                        <figcaption><span>04</span> 陈绮贞 · 广州草莓音乐节</figcaption>
                      </figure>
                    </div>
                  </section>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'films' && (
            <section className="film-input-panel" role="tabpanel" aria-label="电影">
              <div className="section-marker">D / MOVING IMAGES</div>
              <div className="film-input-intro">
                <div>
                  <h3>看过，也留下自己的镜头。</h3>
                  <p>电影是另一种学习构图、节奏和人物的方法。</p>
                </div>
                <span>07 FILMS</span>
              </div>
              <div className="film-input-rail" aria-label="电影清单，可左右滑动">
                {aestheticFilms.map((film, index) => (
                  <article className="film-input-card" key={`${film.title}-${index}`}>
                    <div className="film-poster">
                      <img src={film.poster} alt={`《${film.title}》电影海报`} loading="lazy" decoding="async" />
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <div className="film-poster-title">
                        <strong>{film.title}</strong>
                        <small>{film.original}</small>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'training' && (
            <section className="training-panel" role="tabpanel" aria-label="训练">
              <div className="section-marker">E / BODY & RHYTHM</div>
              <div className="training-copy">
                <p className="training-number">02</p>
                <div>
                  <h3>拍片之外，我也会认真举铁。</h3>
                  <p>训练没有什么大道理，只是想让自己更有力气，也更有状态。</p>
                  <small>KEEP MOVING / KEEP MAKING</small>
                </div>
              </div>
              <div className="training-gallery" aria-label="我的训练记录">
                <figure className="training-photo training-photo-tall">
                  <img src="/assets/inputs/training-back.webp" alt="健身房里的背部训练记录" loading="lazy" decoding="async" />
                  <figcaption><span>01</span> TRAINING DAY</figcaption>
                </figure>
                <figure className="training-photo training-photo-wide">
                  <img src="/assets/inputs/training-arms.webp" alt="训练后的身体状态记录" loading="lazy" decoding="async" />
                  <figcaption><span>02</span> AFTER TRAINING</figcaption>
                </figure>
              </div>
            </section>
          )}
        </div>
        <footer className="aesthetic-footer">SCROLL WITHIN / ESC TO CLOSE</footer>
      </section>
    </div>
  )
}
