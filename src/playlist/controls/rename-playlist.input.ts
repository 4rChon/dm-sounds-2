import { AudioEvent } from "../../services/events/event.enums";
import { PlaylistEventHandler } from "../../services/events/playlist-event.handler";
import { HasPlaylistId } from "../../core/interfaces/has-playlist-id";
import { Input } from "../../core/input";

export class RenamePlaylistInput extends Input implements HasPlaylistId {
  public constructor(private readonly playlistId: string) {
    super('edit', () => {
      PlaylistEventHandler.emit(AudioEvent.RenamePlaylist, { playlistId: this.playlistId, name: this.inputElement.value });
    }, 'hide', 'playlist-title');

    // hide edit button when not editing
    this.inputElement.addEventListener('blur', () => {
      this.buttonElement.classList.add('hide');
    });

    // show edit button when editing
    this.inputElement.addEventListener('focus', () => {
      this.buttonElement.classList.remove('hide');
    });
  }

  public getPlaylistId(): string {
    return this.playlistId;
  }
}