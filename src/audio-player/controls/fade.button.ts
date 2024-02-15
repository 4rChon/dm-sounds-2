import { Button } from '../../core/button';
import { HasPlaylistId } from '../../core/interfaces/has-playlist-id';
import { HasVideoId } from '../../core/interfaces/has-video-id';
import { RegisterPlayerDelegate, SubscribeDelegates } from '../../services/events/event.decorators';
import { AudioEvent } from '../../services/events/event.enums';
import { FadeInEndEventArgs, FadeInEventArgs, FadeInStartEventArgs, FadeOutEndEventArgs, FadeOutEventArgs, FadeOutStartEventArgs, PlayEventArgs, VolumeEventArgs } from '../../services/events/player-event.args';
import { PlayerEventHandler } from '../../services/events/player-event.handler';

@SubscribeDelegates()
export class FadeButton extends Button implements HasVideoId, HasPlaylistId {
  private isFadingIn: boolean = false;
  private isFadingOut: boolean = false;
  private volumeSliderVolume: number = 100;

  public constructor(private readonly playlistId: string, private readonly videoId: string) {
    super('play_circle', () => {
      if (this.element.innerText === 'play_circle') {
        this.fadeInStart();
        this.fadeIn(0);
      } else {
        this.fadeOutStart();
        this.fadeOut(this.volumeSliderVolume);
      }
    });
  }

  public getVideoId(): string {
    return this.videoId;
  }

  public getPlaylistId(): string {
    return this.playlistId;
  }

  @RegisterPlayerDelegate(AudioEvent.Play)
  onPlay(): void {
    this.element.innerText = 'pause_circle';
  }

  @RegisterPlayerDelegate(AudioEvent.Pause)
  onPause(): void {
    this.element.innerText = 'play_circle';
  }

  @RegisterPlayerDelegate(AudioEvent.PlayToggle)
  onPlayToggle(args: PlayEventArgs): void {
    this.element.innerText = args.isPlaying ? 'pause_circle' : 'play_circle';
    this.isFadingIn = false;
    this.isFadingOut = false;
  }

  @RegisterPlayerDelegate(AudioEvent.VolumeChange)
  onVolumeChange(args: VolumeEventArgs): void {
    this.volumeSliderVolume = args.volume;
  }

  private fadeOutStart(): void {
    this.element.innerText = 'pause_circle';
    this.isFadingIn = false;
    this.isFadingOut = true;
    PlayerEventHandler.emit<FadeOutStartEventArgs>(AudioEvent.FadeOutStart, { playlistId: this.playlistId, videoId: this.videoId });
  }

  private fadeInStart(): void {
    this.element.innerText = 'play_circle';
    this.isFadingOut = false;
    this.isFadingIn = true;
    PlayerEventHandler.emit<FadeInStartEventArgs>(AudioEvent.FadeInStart, { playlistId: this.playlistId, videoId: this.videoId });
  }

  private fadeOut(volume: number): void {
    if (!this.isFadingOut || volume === 0) {
      PlayerEventHandler.emit<FadeOutEndEventArgs>(AudioEvent.FadeOutEnd, { playlistId: this.playlistId, videoId: this.videoId });

      return;
    }

    this.isFadingIn = false;
    volume -= 1;
    PlayerEventHandler.emit<FadeOutEventArgs>(AudioEvent.FadeOut, { playlistId: this.playlistId, videoId: this.videoId, volume });
    setTimeout(() => this.fadeOut(volume), 50);
  }

  private fadeIn(volume: number): void {
    if (!this.isFadingIn || volume === 100) {
      PlayerEventHandler.emit<FadeInEndEventArgs>(AudioEvent.FadeInEnd, { playlistId: this.playlistId, videoId: this.videoId });

      return;
    }

    this.isFadingOut = false;
    volume += 1;
    PlayerEventHandler.emit<FadeInEventArgs>(AudioEvent.FadeIn, { playlistId: this.playlistId, videoId: this.videoId, volume });
    setTimeout(() => this.fadeIn(volume), 50);
  }
}

