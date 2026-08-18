import { useEffect, useState } from 'react'
import { aestheticAlbums, aestheticArtists, aestheticFilms } from '../data/aestheticInputs'

const tabs = [
  { id: 'music', label: '音乐' },
  { id: 'films', label: '电影' },
  { id: 'training', label: '训练' },
]

export default function AestheticDialog({ open, onClose }) {
  const [activeTab, setActiveTab] = useState('music')

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
                <div className="artist-shelves">
                  {aestheticArtists.map((artist, artistIndex) => (
                    <section className="artist-shelf" key={artist.name}>
                      <header className="artist-identity">
                        <span>{String(artistIndex + 1).padStart(2, '0')}</span>
                        <strong>{artist.name}</strong>
                        <small>{artist.romanized}</small>
                      </header>
                      <div className="artist-albums" aria-label={`${artist.name}的专辑`}>
                        {artist.albums.map((album, albumIndex) => (
                          <article className="album-card album-card-compact" key={album.title}>
                            <div className="album-cover">
                              <img src={album.cover} alt={`${artist.name}《${album.title}》专辑封面`} loading="lazy" />
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
                        <img src={album.cover} alt={`${album.artist}《${album.title}》专辑封面`} loading="lazy" />
                        <span>{album.index}</span>
                      </div>
                      <p>{album.title}</p>
                      <small>{album.artist}</small>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'films' && (
            <section className="film-input-panel" role="tabpanel" aria-label="电影">
              <div className="section-marker">C / MOVING IMAGES</div>
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
                      <img src={film.poster} alt={`《${film.title}》电影海报`} loading="lazy" />
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
              <div className="section-marker">D / BODY & RHYTHM</div>
              <div className="training-copy">
                <p className="training-number">03</p>
                <div>
                  <h3>身体也在参与创作。</h3>
                  <p>这里会放我的训练记录、喜欢的运动和几张真实照片。</p>
                  <small>照片素材待补 · 只使用本人素材</small>
                </div>
              </div>
              <div className="training-placeholders" aria-label="健身照片预留位">
                {[1, 2, 3].map((item) => <div key={item}><span>0{item}</span></div>)}
              </div>
            </section>
          )}
        </div>
        <footer className="aesthetic-footer">SCROLL WITHIN / ESC TO CLOSE</footer>
      </section>
    </div>
  )
}
