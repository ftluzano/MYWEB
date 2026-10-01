// YouTube Theme Audio Manager
// Track URL: https://www.youtube.com/watch?v=pDddlvCfTiw&list=RDpDddlvCfTiw&start_radio=1

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: Record<string, (event: any) => void>;
        }
      ) => any;
      PlayerState?: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const THEME_SONG_INFO = {
  id: 'pDddlvCfTiw',
  url: 'https://www.youtube.com/watch?v=pDddlvCfTiw&list=RDpDddlvCfTiw&start_radio=1'
};

class YouTubeThemeAudioManager {
  private player: any = null;
  private isPlaying = false;
  private volume = 75;
  private containerId = 'youtube-theme-player-container';
  private hasInitialized = false;
  private gestureListenersInstalled = false;

  private readonly unlockPlayback = () => {
    if (!this.isPlaying) this.play();
  };

  public init() {
    if (this.hasInitialized) return;
    this.hasInitialized = true;
    this.installGestureListeners();

    if (!window.YT) {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        this.onApiReady();
      };

      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    } else {
      this.onApiReady();
    }

  }

  private installGestureListeners() {
    if (this.gestureListenersInstalled) return;
    this.gestureListenersInstalled = true;
    window.addEventListener('click', this.unlockPlayback, { passive: true });
    window.addEventListener('touchstart', this.unlockPlayback, { passive: true });
    window.addEventListener('keydown', this.unlockPlayback, { passive: true });
  }

  private removeGestureListeners() {
    if (!this.gestureListenersInstalled) return;
    this.gestureListenersInstalled = false;
    window.removeEventListener('click', this.unlockPlayback);
    window.removeEventListener('touchstart', this.unlockPlayback);
    window.removeEventListener('keydown', this.unlockPlayback);
  }

  private onApiReady() {
    this.createPlayer();
  }

  private createPlayer() {
    if (!window.YT || !window.YT.Player) return;

    let el = document.getElementById(this.containerId);
    if (!el) {
      el = document.createElement('div');
      el.id = this.containerId;
      el.style.position = 'fixed';
      el.style.top = '-9999px';
      el.style.left = '-9999px';
      el.style.width = '200px';
      el.style.height = '200px';
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
      document.body.appendChild(el);
    }

    try {
      this.player = new window.YT.Player(this.containerId, {
        videoId: THEME_SONG_INFO.id,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: THEME_SONG_INFO.id,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            try {
              event.target.setVolume(this.volume);
              event.target.playVideo();
            } catch {
              // Keep gesture retries active if autoplay is blocked.
            }
          },
          onAutoplayBlocked: () => {
            this.isPlaying = false;
          },
          onStateChange: (event: any) => {
            if (window.YT && window.YT.PlayerState) {
              if (event.data === window.YT.PlayerState.PLAYING) {
                this.isPlaying = true;
                this.removeGestureListeners();
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                this.isPlaying = false;
              } else if (event.data === window.YT.PlayerState.ENDED) {
                event.target.playVideo();
              }
            }
          }
        }
      });
    } catch (e) {
      console.warn('YouTube Player initialization fallback:', e);
    }
  }

  public play() {
    if (this.player && typeof this.player.playVideo === 'function') {
      try {
        if (typeof this.player.unMute === 'function') {
          this.player.unMute();
        }
        this.player.setVolume(this.volume);
        this.player.playVideo();
      } catch (err) {
        console.warn('Playback gesture required:', err);
      }
    } else {
      // If player not initialized yet, re-attempt init
      this.init();
    }
  }

}

export const youtubeTheme = new YouTubeThemeAudioManager();
