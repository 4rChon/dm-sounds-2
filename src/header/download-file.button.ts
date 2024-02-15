import { Button } from "../core/button";
import { AudioEvent } from "../services/events/event.enums";
import { EventHandler } from "../services/events/event.handler";

export class DownloadFileButton extends Button {
  public constructor() {
    super('download', () => {
      EventHandler.emit(AudioEvent.DownloadFile, {});
    });
  }
}