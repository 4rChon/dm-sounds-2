import { AudioEvent } from "../../services/events/event.enums";
import { PlaylistEventHandler } from "../../services/events/playlist-event.handler";
import { HasPlaylistId } from "../../core/interfaces/has-playlist-id";
import { Input } from "../../core/input";

export class AddPlayerInput extends Input implements HasPlaylistId {
  public constructor(private readonly playlistId: string) {
    super('add', () => {
      PlaylistEventHandler.emit(AudioEvent.AddPlayer, { playlistId: this.playlistId, videoId: this.inputElement.value });
      this.reset();
    });
  }

  public getPlaylistId(): string {
    return this.playlistId;
  }
}