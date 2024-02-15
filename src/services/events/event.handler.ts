import { AudioEvent } from "./event.enums";

export class EventHandler {
  private static events: Map<AudioEvent, ((value: any) => void)[]> = new Map();

  public static subscribe<T>(event: AudioEvent, callback: (value: T) => void): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }

    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.push(callback);
    }
  }

  public static unsubscribe<T>(event: AudioEvent, callback: (value: T) => void): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  public static emit<T>(event: AudioEvent, value: T): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(value));
    }
  }
}