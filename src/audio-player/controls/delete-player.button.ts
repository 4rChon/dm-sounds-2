import { AudioEvent } from "../../services/events/event.enums";
import { PlaylistEventHandler } from "../../services/events/playlist-event.handler";
import { HasPlaylistId } from "../../core/interfaces/has-playlist-id";
import { HasVideoId } from "../../core/interfaces/has-video-id";
import { Button } from "../../core/button";

export class DeletePlayerButton extends Button implements HasPlaylistId, HasVideoId {
  public constructor(private readonly playlistId: string, private readonly videoId: string) {
    super('delete', () => {
      PlaylistEventHandler.emit(AudioEvent.DeletePlayer, { playlistId: this.playlistId, videoId: this.videoId });
    }, 'danger');
  }

  public getVideoId(): string {
    return this.videoId;
  }

  public getPlaylistId(): string {
    return this.playlistId;
  }
}