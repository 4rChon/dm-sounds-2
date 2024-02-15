import { Button } from "../../core/button";
import { HasPlaylistId } from '../../core/interfaces/has-playlist-id';
import { HasVideoId } from "../../core/interfaces/has-video-id";
import { RegisterPlaylistDelegate, SubscribeDelegates } from "../../services/events/event.decorators";
import { AudioEvent } from "../../services/events/event.enums";
import { MoveEventArgs, MovePlayerEventArgs } from '../../services/events/playlist-event.args';
import { PlaylistEventHandler } from "../../services/events/playlist-event.handler";

@SubscribeDelegates()
export class MoveDownButton extends Button implements HasPlaylistId, HasVideoId {
  public constructor(private readonly playlistId: string, private readonly videoId: string) {
    super('arrow_downward', () => {
      if (this.isDisabled) return;
      PlaylistEventHandler.emit<MovePlayerEventArgs>(AudioEvent.MoveDown, { playlistId, videoId });
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
    args.playersList.findIndex((videoId) => videoId === this.videoId) === args.playersList.length - 1 ? this.disable() : this.enable();
  }
}