import { AudioPlayer } from "../audio-player/audio-player";
import { HasPlaylistId } from "../core/interfaces/has-playlist-id";
import { RegisterPlaylistDelegate, SubscribeDelegates } from "../services/events/event.decorators";
import { AudioEvent } from "../services/events/event.enums";
import { EventHandler } from "../services/events/event.handler";
import { AddPlayerEventArgs, DeletePlayerEventArgs, MoveEventArgs } from "../services/events/playlist-event.args";
import { PlaylistEventHandler } from "../services/events/playlist-event.handler";
import { MovePlayerEventArgs } from './../services/events/playlist-event.args';
import { PlaylistContainer } from "./playlist.container";

@SubscribeDelegates()
export class Playlist implements HasPlaylistId {
  public readonly container: PlaylistContainer;
  public readonly id: string

  private players: Map<string, AudioPlayer> = new Map();
  private playersList: string[] = [];
  private static playlistCount: number = 0;

  get name(): string {
    return this.container.name;
  }

  constructor(name?: string) {
    this.id = `playlist-${Playlist.playlistCount++}`;
    this.container = new PlaylistContainer(this.id, name || 'New Playlist');
  }

  @RegisterPlaylistDelegate(AudioEvent.AddPlayer)
  onAddPlayer(args: AddPlayerEventArgs): void {
    const videoId = args.videoId;
    if (this.players.has(videoId)) {
      return;
    }

    const audioPlayer = new AudioPlayer(this.id, videoId);
    this.container.addPlayer(audioPlayer);
    audioPlayer.createPlayer();

    this.players.set(videoId, audioPlayer);
    this.playersList.push(videoId);

    PlaylistEventHandler.emit<MoveEventArgs>(AudioEvent.Move, { playlistId: this.id, playersList: this.playersList });
  }

  @RegisterPlaylistDelegate(AudioEvent.DeletePlayer)
  onDeletePlayer(args: DeletePlayerEventArgs): void {
    const videoId = args.videoId;
    if (!this.players.has(videoId)) {
      return;
    }

    const audioPlayer = this.players.get(videoId);
    if (audioPlayer) {
      this.container.removePlayer(audioPlayer);
    }

    this.players.delete(videoId);
    this.playersList.splice(this.playersList.indexOf(videoId), 1);

    PlaylistEventHandler.emit<MoveEventArgs>(AudioEvent.Move, { playlistId: this.id, playersList: this.playersList });
  }

  @RegisterPlaylistDelegate(AudioEvent.MoveUp)
  onMoveUp(args: MovePlayerEventArgs): void {
    const index = this.playersList.indexOf(args.videoId);
    if (index === 0) {
      return;
    }

    const player = this.players.get(args.videoId);
    if (player) {
      this.container.moveUpPlayer(player, index);
    }

    this.playersList.splice(index - 1, 0, this.playersList.splice(index, 1)[0]);
    PlaylistEventHandler.emit<MoveEventArgs>(AudioEvent.Move, { playlistId: this.id, playersList: this.playersList });
  }

  @RegisterPlaylistDelegate(AudioEvent.MoveDown)
  onMoveDown(args: MovePlayerEventArgs): void {
    const index = this.playersList.indexOf(args.videoId);
    if (index === this.playersList.length - 1) {
      return;
    }

    const player = this.players.get(args.videoId);
    if (player) {
      this.container.moveDownPlayer(player, index);
    }

    this.playersList.splice(index + 1, 0, this.playersList.splice(index, 1)[0]);
    PlaylistEventHandler.emit<MoveEventArgs>(AudioEvent.Move, { playlistId: this.id, playersList: this.playersList });
  }

  @RegisterPlaylistDelegate(AudioEvent.FadeInPlaylist)
  onFadeIn(): void {
    this.players.forEach((audioPlayer) => {
      if (!audioPlayer.isPlaying()) {
        audioPlayer.container.controls.fadeButton?.click();
      }
    });
  }

  @RegisterPlaylistDelegate(AudioEvent.FadeOutPlaylist)
  onFadeOut(): void {
    this.players.forEach((audioPlayer) => {
      if (audioPlayer.isPlaying()) {
        audioPlayer.container.controls.fadeButton?.click();
      }
    });
  }

  @RegisterPlaylistDelegate(AudioEvent.RenamePlaylist)
  onRename(args: { name: string }): void {
    this.container.setName(args.name);
    EventHandler.emit(AudioEvent.Save, {});
  }

  @RegisterPlaylistDelegate(AudioEvent.Move)
  onMove(): void {
    EventHandler.emit(AudioEvent.Save, {});
  }

  public getPlaylistId(): string {
    return this.id;
  }

  public setName(name: string): void {
    this.container.setName(name);
  }

  public clearPlayers(): void {
    this.players.forEach((audioPlayer) => {
      this.container.removePlayer(audioPlayer);
    });

    this.players.clear();
    this.playersList = [];

    PlaylistEventHandler.emit<MoveEventArgs>(AudioEvent.Move, { playlistId: this.id, playersList: this.playersList });
  }

  public getPlayers(): string[] {
    return this.playersList;
  }
}