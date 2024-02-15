import { AudioEvent } from "../services/events/event.enums";
import { EventHandler } from "../services/events/event.handler";
import { Button } from "../core/button";

export class ClearButton extends Button {
  public constructor() {
    super('delete', () => {
      EventHandler.emit(AudioEvent.Clear, {});
    }, 'danger');
  }
}