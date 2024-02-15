import { Button } from "../../core/button";
import { HasPlaylistId } from "../../core/interfaces/has-playlist-id";
import { AudioEvent } from "../../services/events/event.enums";
import { PlaylistEventHandler } from "../../services/events/playlist-event.handler";

export class FadeOutPlaylistButton extends Button implements HasPlaylistId {
  public constructor(private readonly playlistId: string) {
    super('pause_circle', () => {
      if (this.isDisabled) return;
      PlaylistEventHandler.emit(AudioEvent.FadeOutPlaylist, { playlistId: this.playlistId });
    });
  }

  public getPlaylistId(): string {
    return this.playlistId;
  }
}