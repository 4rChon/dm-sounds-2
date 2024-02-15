import { HasPlaylistId } from '../../core/interfaces/has-playlist-id';
import { AudioEvent } from "../../services/events/event.enums";
import { PlayerEventArgs, PlayEventArgs } from "../../services/events/player-event.args";
import { PlayerEventHandler } from "../../services/events/player-event.handler";
import { HasVideoId } from "../../core/interfaces/has-video-id";
import { Button } from "../../core/button";

export class PlayButton extends Button implements HasPlaylistId, HasVideoId {
  public constructor(private readonly playlistId: string, private readonly videoId: string, className?: string) {
    super('play_arrow', () => { this.toggle(); }, className);
  }

  public toggle(): void {
    this.element.innerText === 'play_arrow' ? this.play() : this.pause();
    PlayerEventHandler.emit<PlayerEventArgs>(AudioEvent.PlayToggle, { playlistId: this.playlistId, videoId: this.videoId });
  }

  public play(): void {
    this.element.innerText = 'pause';
    PlayerEventHandler.emit<PlayEventArgs>(AudioEvent.Play, { playlistId: this.playlistId, videoId: this.videoId, isPlaying: true });
  }

  public pause(): void {
    this.element.innerText = 'play_arrow';
    PlayerEventHandler.emit<PlayEventArgs>(AudioEvent.Pause, { playlistId: this.playlistId, videoId: this.videoId, isPlaying: false });
  }

  public getVideoId(): string {
    return this.videoId;
  }

  public getPlaylistId(): string {
    return this.playlistId;
  }
}
