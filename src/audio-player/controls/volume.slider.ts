import { HasPlaylistId } from "../../core/interfaces/has-playlist-id";
import { HasVideoId } from "../../core/interfaces/has-video-id";
import { Slider } from "../../core/slider";
import { RegisterPlayerDelegate, SubscribeDelegates } from "../../services/events/event.decorators";
import { AudioEvent } from "../../services/events/event.enums";
import { FadeInEventArgs, VolumeEventArgs } from "../../services/events/player-event.args";
import { PlayerEventHandler } from "../../services/events/player-event.handler";

@SubscribeDelegates()
export class VolumeSlider extends Slider implements HasPlaylistId, HasVideoId {
  public set value(volume: number) {
    this.element.value = volume.toString();
    PlayerEventHandler.emit<VolumeEventArgs>(AudioEvent.VolumeChange, { playlistId: this.playlistId, videoId: this.videoId, volume });
  }

  public constructor(private readonly playlistId: string, private readonly videoId: string) {
    super({
      onInput: () => {
        this.value = Number(this.element.value);
      }
    });

    PlayerEventHandler.emit<VolumeEventArgs>(AudioEvent.VolumeChange, { playlistId: this.playlistId, videoId: this.videoId, volume: Number(this.element.value) });
  }

  public getVideoId(): string {
    return this.videoId;
  }

  public getPlaylistId(): string {
    return this.playlistId;
  }

  @RegisterPlayerDelegate(AudioEvent.FadeIn)
  onFadeIn(args: FadeInEventArgs): void {
    this.value = args.volume;
  }

  @RegisterPlayerDelegate(AudioEvent.FadeOut)
  onFadeOut(args: FadeInEventArgs): void {
    this.value = args.volume;
  }
}