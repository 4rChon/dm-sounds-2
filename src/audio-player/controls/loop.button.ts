import { AudioEvent } from '../../services/events/event.enums';
import { LoopEventArgs } from '../../services/events/player-event.args';
import { HasPlaylistId } from '../../core/interfaces/has-playlist-id';
import { HasVideoId } from '../../core/interfaces/has-video-id';
import { PlayerEventHandler } from '../../services/events/player-event.handler';
import { Button } from "../../core/button";

export class LoopButton extends Button implements HasPlaylistId, HasVideoId {
  public constructor(private readonly playlistId: string, private readonly videoId: string) {
    super('loop', () => {
      const isLooping = this.element.getAttribute(AudioEvent.Loop) === '1';
      this.toggle(isLooping);
    });
  }

  public toggle(isLooping: boolean): void {
    isLooping ? this.loopOff() : this.loopOn();
  }

  public loopOn(): void {
    this.element.className = 'material-icons enabled';
    this.element.setAttribute(AudioEvent.Loop, '1');

    PlayerEventHandler.emit<LoopEventArgs>(AudioEvent.Loop, { playlistId: this.playlistId, videoId: this.videoId, isLooping: true });
  }

  public loopOff(): void {
    this.element.className = 'material-icons';
    this.element.setAttribute(AudioEvent.Loop, '0');

    PlayerEventHandler.emit<LoopEventArgs>(AudioEvent.Loop, { playlistId: this.playlistId, videoId: this.videoId, isLooping: false });
  }

  public getVideoId(): string {
    return this.videoId;
  }

  public getPlaylistId(): string {
    return this.playlistId;
  }
}

