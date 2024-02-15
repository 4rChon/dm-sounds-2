import { AudioEvent } from "./event.enums";
import { PlaylistEventArgs } from "./playlist-event.args";

export class PlaylistEventHandler {
  private static events: Map<AudioEvent, Map<string, ((value: any) => void)[]>> = new Map();

  public static subscribe<T extends PlaylistEventArgs>(playlistId: string, event: AudioEvent, callback: (value: T) => void): void {
    let eventVideoIds = this.events.get(event);
    if (!eventVideoIds) {
      eventVideoIds = new Map();
      this.events.set(event, eventVideoIds);
    }

    let callbacks = eventVideoIds.get(playlistId);
    if (!callbacks) {
      callbacks = [];
      eventVideoIds.set(playlistId, callbacks);
    }

    callbacks.push(callback);
  }

  public static unsubscribe<T extends PlaylistEventArgs>(playlistId: string, event: AudioEvent, callback: (value: T) => void): void {
    const eventVideoIds = this.events.get(event);
    if (!eventVideoIds) {
      return;
    }

    const callbacks = eventVideoIds.get(playlistId);
    if (!callbacks) {
      return;
    }

    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  public static emit<T extends PlaylistEventArgs>(event: AudioEvent, value: T): void {
    const eventVideoIds = this.events.get(event);
    if (!eventVideoIds) {
      return;
    }

    const callbacks = eventVideoIds.get(value.playlistId);
    if (!callbacks) {
      return;
    }

    callbacks.forEach((callback) => callback(value));
  }
}