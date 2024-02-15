import { AudioEvent } from "../services/events/event.enums";
import { EventHandler } from "../services/events/event.handler";
import { Button } from "../core/button";

export class AddPlaylistButton extends Button {
  public constructor() {
    super('playlist_add', () => {
      EventHandler.emit(AudioEvent.AddPlaylist, {});
    });
  }
}