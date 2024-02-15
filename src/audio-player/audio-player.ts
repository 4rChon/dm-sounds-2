import { HasPlaylistId } from "../core/interfaces/has-playlist-id";
import { HasVideoId } from '../core/interfaces/has-video-id';
import { RegisterPlayerDelegate, RegisterPlaylistDelegate, SubscribeDelegates } from "../services/events/event.decorators";
import { AudioEvent } from "../services/events/event.enums";
import { LoopEventArgs, VolumeEventArgs } from "../services/events/player-event.args";
import { ServiceManager } from "../services/service.manager";
import { StorageService } from "../services/storage.service";
import { AudioPlayerContainer } from "./audio-player.container";

@SubscribeDelegates()
export class AudioPlayer implements HasPlaylistId, HasVideoId {
  public container: AudioPlayerContainer;

  private player?: YT.Player;
  private isLoaded: boolean = false;
  private storageService: StorageService = ServiceManager.get<StorageService>(StorageService);

  constructor(public readonly playlistId: string, public readonly videoId: string) {
    this.container = new AudioPlayerContainer(playlistId, videoId);
    this.container.createControls();
  }

  public createPlayer(): YT.Player {
    this.player = new YT.Player(`${this.playlistId}-${this.videoId}`, {
      playerVars: {
        playlist: this.videoId,
      },
      events: {
        onReady: (event: any) => {
          this.storageService.loadMetadata(this.videoId).then((metadata) => {
            this.container.enableControls();
            if (!this.isLoaded) {
              this.container.createPlayerCard(metadata);
            }
            this.isLoaded = true;
          })
        },
        onStateChange: (event: any) => {
          if (event.data === YT.PlayerState.ENDED) {
            event.target.stopVideo() && this.container.controls.playButton?.pause();
          } else if (event.data === YT.PlayerState.PAUSED) {
            this.container.controls.playButton?.pause();
          } else if (event.data === YT.PlayerState.PLAYING) {
            this.container.controls.playButton?.play();
          }
        }
      }
    });

    return this.player;
  }

  public isPlaying(): boolean {
    return this.player?.getPlayerState() === YT.PlayerState.PLAYING;
  }

  public getVideoId(): string {
    return this.videoId;
  }

  public getPlaylistId(): string {
    return this.playlistId;
  }

  @RegisterPlayerDelegate(AudioEvent.Play)
  public onPlay(): void {
    this.player?.playVideo();
  }

  @RegisterPlayerDelegate(AudioEvent.Pause)
  public onPause(): void {
    this.player?.pauseVideo();
  }

  @RegisterPlayerDelegate(AudioEvent.VolumeChange)
  public onVolumeChange(args: VolumeEventArgs): void {
    this.player?.setVolume(args.volume);
  }

  @RegisterPlayerDelegate(AudioEvent.Loop)
  public onLoop(args: LoopEventArgs): void {
    this.player?.setLoop(args.isLooping);
  }

  @RegisterPlayerDelegate(AudioEvent.FadeInStart)
  public onFadeInStart(): void {
    this.player?.setVolume(0);
    this.player?.playVideo();
  }

  @RegisterPlayerDelegate(AudioEvent.FadeOutEnd)
  public onFadeOutEnd(): void {
    this.player?.pauseVideo();
  }

  @RegisterPlayerDelegate(AudioEvent.Restart)
  public onRestart(): void {
    this.player?.seekTo(0, true);
  }

  @RegisterPlaylistDelegate(AudioEvent.MoveDown)
  public onMoveDown(): void {
    this.container.resetControls();
  }

  @RegisterPlaylistDelegate(AudioEvent.MoveUp)
  public onMoveUp(): void {
    this.container.resetControls();
  }
}