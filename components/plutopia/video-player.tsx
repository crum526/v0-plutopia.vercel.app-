'use client'

interface VideoPlayerProps {
  videoId: string
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const getParentDomain = () => {
    if (typeof window === 'undefined') return 'localhost'
    const host = window.location.hostname
    return host === 'localhost' ? 'localhost' : host
  }

  const iframeSrc = `https://player.twitch.tv/?video=${videoId}&parent=${getParentDomain()}`

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="md:hidden">
        <div
          className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl"
          style={{ paddingBottom: '150%' }}
        >
          <iframe
            src={iframeSrc}
            frameBorder="0"
            allowFullScreen={true}
            scrolling="no"
            className="absolute top-0 left-0 w-full h-full"
            title="Plutopia VOD player"
          />
        </div>
      </div>

      <div className="hidden md:block">
        <div
          className="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl"
          style={{ paddingBottom: '56.25%' }}
        >
          <iframe
            src={iframeSrc}
            frameBorder="0"
            allowFullScreen={true}
            scrolling="no"
            className="absolute top-0 left-0 w-full h-full"
            title="Plutopia VOD player"
          />
        </div>
      </div>
    </div>
  )
}
