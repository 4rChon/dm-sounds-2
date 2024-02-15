import { Playlist } from '../playlist/playlist';
import { AudioUIService } from './audio.ui.service';
import { AddPlaylistEventArgs, DeletePlaylistEventArgs } from './events/event.args';
import { RegisterDelegate, SubscribeDelegates } from './events/event.decorators';
import { AudioEvent } from './events/event.enums';
import { EventHandler } from './events/event.handler';
import { AddPlayerEventArgs } from './events/playlist-event.args';
import { PlaylistEventHandler } from './events/playlist-event.handler';
import { RegisterService, ServiceManager } from './service.manager';
import { StorageService } from './storage.service';

@RegisterService()
@SubscribeDelegates()
export class AudioService {
  private playlists: Map<string, Playlist> = new Map();

  private audioUIService: AudioUIService = ServiceManager.get(AudioUIService);
  private storageService: StorageService = ServiceManager.get(StorageService);

  constructor() {
    // wait for the YouTube API to load then initialize from local storage
    (window as any).onYouTubeIframeAPIReady = () => {
      this.storageService.loadApiKey().then(() => {
        this.storageService.loadFromPersistentStorage();
      }).catch((error) => {
        console.error("Error loading the YouTube API", error);
      });
    }
  }

  @RegisterDelegate(AudioEvent.LoadPlayers)
  onLoadPlayers(): void {
    this.storageService.loadFromPersistentStorage();
  }

  @RegisterDelegate(AudioEvent.DeletePlaylist)
  onDeletePlaylist(args: DeletePlaylistEventArgs): void {
    const playlistId = args.playlistId;
    const playlist = this.playlists.get(playlistId);
    if (!playlist) {
      return;
    }

    this.playlists.delete(playlistId);
    playlist?.container.element.remove();

    this.storageService.saveToPersistentStorage(this.playlists);
  }

  @RegisterDelegate(AudioEvent.Save)
  onSave(): void {
    this.storageService.saveToPersistentStorage(this.playlists);
  }

  @RegisterDelegate(AudioEvent.AddPlaylist)
  onAddPlaylist(args: AddPlaylistEventArgs): void {
    const playlist = new Playlist(args.name);
    this.audioUIService.playlistContainer.appendChild(playlist.container.element);
    this.playlists.set(playlist.id, playlist);

    args.playersList?.forEach((player: string) => {
      PlaylistEventHandler.emit<AddPlayerEventArgs>(AudioEvent.AddPlayer, { playlistId: playlist.id, videoId: player });
    });
  }

  @RegisterDelegate(AudioEvent.Clear)
  onClear(): void {
    this.playlists.forEach((playlist) => {
      EventHandler.emit<DeletePlaylistEventArgs>(AudioEvent.DeletePlaylist, { playlistId: playlist.id });
    });
  }

  @RegisterDelegate(AudioEvent.DownloadFile)
  onDownload(): void {
    this.storageService.saveTextFile(this.playlists);
  }

  public renamePlaylist(playlistId: string, playlistName: string): void {
    this.playlists.get(playlistId)?.setName(playlistName);
  }
}