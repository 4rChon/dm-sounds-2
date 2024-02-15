import { HasPlaylistId } from '../../core/interfaces/has-playlist-id';
import { HasVideoId } from "../../core/interfaces/has-video-id";
import { AudioEvent } from "./event.enums";
import { EventHandler } from "./event.handler";
import { PlayerEventHandler } from "./player-event.handler";
import { PlaylistEventHandler } from './playlist-event.handler';

export function SubscribeDelegates(): (constructor: { new(...args: any[]): {} }) => any {
  return function _SubscribeFunctions<T extends { new(...args: any[]): {} }>(constructor: T): any {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args);
        const playlist = (this as any & HasPlaylistId);
        if (playlist.subscribePlaylist) {
          playlist.subscribePlaylist.forEach((sub: { event: AudioEvent, propertyKey: string }) => {
            PlaylistEventHandler.subscribe(playlist.getPlaylistId(), sub.event, (args) => (this as any)[sub.propertyKey](args));
          });
        }

        const player = (this as any & HasVideoId & HasPlaylistId);
        if (player.subscribePlayer) {
          player.subscribePlayer.forEach((sub: { event: AudioEvent, propertyKey: string }) => {
            PlayerEventHandler.subscribe(player.getPlaylistId(), player.getVideoId(), sub.event, (args) => (this as any)[sub.propertyKey](args));
          });
        }

        if ((this as any).subscribeGlobal) {
          (this as any).subscribeGlobal.forEach((sub: { event: AudioEvent, propertyKey: string }) => {
            EventHandler.subscribe(sub.event, (args) => (this as any)[sub.propertyKey](args));
          });
        }
      }
    }
  }
}

export function RegisterPlaylistDelegate(event: AudioEvent): (target: HasPlaylistId, propertyKey: string, descriptor: TypedPropertyDescriptor<(args?: any) => void>) => void | TypedPropertyDescriptor<(args?: any) => void> {
  return (target: HasPlaylistId, propertyKey: string, descriptor: TypedPropertyDescriptor<(args?: any) => void>): void | TypedPropertyDescriptor<(args?: any) => void> => {
    (target as any).subscribePlaylist = (target as any).subscribePlaylist || [];
    (target as any).subscribePlaylist.push({ event, propertyKey });
  };
}

export function RegisterPlayerDelegate(event: AudioEvent): (target: HasVideoId & HasPlaylistId, propertyKey: string, descriptor: TypedPropertyDescriptor<(args?: any) => void>) => void | TypedPropertyDescriptor<(args?: any) => void> {
  return (target: HasVideoId & HasPlaylistId, propertyKey: string, descriptor: TypedPropertyDescriptor<(args?: any) => void>): void | TypedPropertyDescriptor<(args?: any) => void> => {
    (target as any).subscribePlayer = (target as any).subscribePlayer || [];
    (target as any).subscribePlayer.push({ event, propertyKey });
  };
}

export function RegisterDelegate(event: AudioEvent): (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(args?: any) => void>) => void | TypedPropertyDescriptor<(args?: any) => void> {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<(args?: any) => void>): void | TypedPropertyDescriptor<(args?: any) => void> => {
    (target as any).subscribeGlobal = (target as any).subscribeGlobal || [];
    (target as any).subscribeGlobal.push({ event, propertyKey });
  };
}
