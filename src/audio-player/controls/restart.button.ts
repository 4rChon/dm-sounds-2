import { AudioEvent } from '../../services/events/event.enums';
import { RestartEventArgs } from '../../services/events/player-event.args';
import { PlayerEventHandler } from '../../services/events/player-event.handler';
import { HasVideoId } from '../../core/interfaces/has-video-id';
import { HasPlaylistId } from '../../core/interfaces/has-playlist-id';
import { Button } from "../../core/button";

export class RestartButton extends Button implements HasPlaylistId, HasVideoId {
  public constructor(private readonly playlistId: string, private readonly videoId: string) {
    super('restart_alt', () => {
      PlayerEventHandler.emit<RestartEventArgs>(AudioEvent.Restart, { playlistId: this.playlistId, videoId: this.videoId });
    });
  }

  public getVideoId(): string {
    return this.videoId;
  }

  public getPlaylistId(): string {
    return this.playlistId;
  }
}

