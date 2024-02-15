import { AudioEvent } from "./event.enums";
import { PlayerEventArgs } from "./player-event.args";

export class PlayerEventHandler {
  private static events: Map<AudioEvent, Map<string, Map<string, ((value: any) => void)[]>>> = new Map();

  public static subscribe<T extends PlayerEventArgs>(playlistId: string, videoId: string, event: AudioEvent, callback: (value: T) => void): void {
    let eventVideoIds = this.events.get(event);
    if (!eventVideoIds) {
      eventVideoIds = new Map();
      this.events.set(event, eventVideoIds);
    }

    let videoCallbacks = eventVideoIds.get(playlistId);
    if (!videoCallbacks) {
      videoCallbacks = new Map();
      eventVideoIds.set(playlistId, videoCallbacks);
    }

    let callbacks = videoCallbacks.get(videoId);
    if (!callbacks) {
      callbacks = [];
      videoCallbacks.set(videoId, callbacks);
    }

    callbacks.push(callback);
  }

  public static unsubscribe<T extends PlayerEventArgs>(playlistId: string, videoId: string, event: AudioEvent, callback: (value: T) => void): void {
    const eventVideoIds = this.events.get(event);
    if (!eventVideoIds) {
      return;
    }

    const videoCallbacks = eventVideoIds.get(playlistId);
    if (!videoCallbacks) {
      return;
    }

    const callbacks = videoCallbacks.get(videoId);
    if (!callbacks) {
      return;
    }

    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  public static emit<T extends PlayerEventArgs>(event: AudioEvent, value: T): void {
    const eventVideoIds = this.events.get(event);
    if (!eventVideoIds) {
      return;
    }

    const videoCallbacks = eventVideoIds.get(value.playlistId);
    if (!videoCallbacks) {
      return;
    }

    const callbacks = videoCallbacks.get(value.videoId);
    if (!callbacks) {
      return;
    }

    callbacks.forEach((callback) => callback(value));
  }
}