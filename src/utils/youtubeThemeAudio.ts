// YouTube Theme Audio Manager
// Track: "Athena's Anthem: Epic Battle Songs of Wisdom and War"
// URL: https://www.youtube.com/watch?v=BD29wMAKiuI&list=OLAK5uy_naf3SE7V0iF_kn1Oix5JEx-twGVA2jq00&index=4
// Video ID: BD29wMAKiuI | Playlist: OLAK5uy_naf3SE7V0iF_kn1Oix5JEx-twGVA2jq00

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
  id: 'BD29wMAKiuI',
  playlistId: 'OLAK5uy_naf3SE7V0iF_kn1Oix5JEx-twGVA2jq00',
  title: "Athena's Anthem: Epic Battle Songs of Wisdom and War",
  shortTitle: "Athena's Anthem",
  artist: 'Tout En Vrac',
  url: 'https://www.youtube.com/watch?v=BD29wMAKiuI&list=OLAK5uy_naf3SE7V0iF_kn1Oix5JEx-twGVA2jq00&index=4'
};

type StateListener = (isPlaying: boolean) => void;

class YouTubeThemeAudioManager {
  private player: any = null;
  private isPlaying = false;
  private isApiReady = false;
  private isMuted = false;
  private listeners: StateListener[] = [];
  private volume = 75;
  private containerId = 'youtube-theme-player-container';
  private hasInitialized = false;

  public init() {
    if (this.hasInitialized) return;
    this.hasInitialized = true;

    // 1. Inject YouTube IFrame API script
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

    // 2. Setup user interaction unlocker for strict browser autoplay policies
    const unlockEvents = ['click', 'touchstart', 'keydown', 'mousedown', 'pointerdown'];
    const unlockAutoplay = () => {
      if (!this.isPlaying) {
        this.play();
      }
      unlockEvents.forEach(evt => window.removeEventListener(evt, unlockAutoplay));
    };

    unlockEvents.forEach(evt => {
      window.addEventListener(evt, unlockAutoplay, { once: true, passive: true });
    });
  }

  private onApiReady() {
    this.isApiReady = true;
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
      el.style.width = '1px';
      el.style.height = '1px';
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
              this.isPlaying = true;
              this.notifyListeners(true);
            } catch {
              // Browser may require user gesture
            }
          },
          onStateChange: (event: any) => {
            if (window.YT && window.YT.PlayerState) {
              if (event.data === window.YT.PlayerState.PLAYING) {
                this.isPlaying = true;
                this.notifyListeners(true);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                this.isPlaying = false;
                this.notifyListeners(false);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                // Loop song automatically
                event.target.playVideo();
                this.isPlaying = true;
                this.notifyListeners(true);
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
        this.isPlaying = true;
        this.notifyListeners(true);
      } catch (err) {
        console.warn('Playback gesture required:', err);
      }
    } else {
      // If player not initialized yet, re-attempt init
      this.init();
    }
  }

  public pause() {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      try {
        this.player.pauseVideo();
        this.isPlaying = false;
        this.notifyListeners(false);
      } catch (err) {
        console.warn('Pause error:', err);
      }
    }
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(100, vol));
    if (this.player && typeof this.player.setVolume === 'function') {
      this.player.setVolume(this.volume);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public subscribe(cb: StateListener) {
    this.listeners.push(cb);
    cb(this.isPlaying);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notifyListeners(state: boolean) {
    this.listeners.forEach(cb => cb(state));
  }
}

export const youtubeTheme = new YouTubeThemeAudioManager();
