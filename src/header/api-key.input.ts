import { Input } from "../core/input";
import { AudioEvent } from "../services/events/event.enums";
import { EventHandler } from "../services/events/event.handler";

export class ApiKeyInput extends Input {
  public constructor() {
    super('key', () => {
      EventHandler.emit(AudioEvent.ApiKeyInput, { apiKey: this.inputElement.value });
    });
  }
}