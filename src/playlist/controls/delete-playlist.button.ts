import { AudioEvent } from "../../services/events/event.enums";
import { EventHandler } from "../../services/events/event.handler";
import { Button } from "../../core/button";

export class DeletePlaylistButton extends Button {
  public constructor(private readonly playlistId: string) {
    super('delete', () => {
      EventHandler.emit(AudioEvent.DeletePlaylist, { playlistId: this.playlistId });
    }, 'danger');
  }
}