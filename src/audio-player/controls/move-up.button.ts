import { Button } from "../../core/button";
import { HasPlaylistId } from "../../core/interfaces/has-playlist-id";
import { HasVideoId } from "../../core/interfaces/has-video-id";
import { RegisterPlaylistDelegate, SubscribeDelegates } from "../../services/events/event.decorators";
import { AudioEvent } from "../../services/events/event.enums";
import { MoveEventArgs, MovePlayerEventArgs } from "../../services/events/playlist-event.args";
import { PlaylistEventHandler } from "../../services/events/playlist-event.handler";

@SubscribeDelegates()
export class MoveUpButton extends Button implements HasPlaylistId, HasVideoId {
  public constructor(private readonly playlistId: string, private readonly videoId: string) {
    super('arrow_upward', () => {
      if (this.isDisabled) return;
      PlaylistEventHandler.emit<MovePlayerEventArgs>(AudioEvent.MoveUp, { playlistId: this.playlistId, videoId: this.videoId });
    });
  }

  public getVideoId(): string {
    return this.videoId;
  }

  public getPlaylistId(): string {
    return this.playlistId;
  }

  @RegisterPlaylistDelegate(AudioEvent.Move)
  onMove(args: MoveEventArgs): void {
    if (args.playlistId !== this.playlistId) return;
    args.playersList.findIndex((videoId) => videoId === this.videoId) === 0 ? this.disable() : this.enable();
  }
}