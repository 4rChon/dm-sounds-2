import { Playlist } from "../playlist/playlist";
import { AddPlaylistEventArgs, ApiKeyInputEventArgs } from "./events/event.args";
import { RegisterDelegate, SubscribeDelegates } from "./events/event.decorators";
import { AudioEvent } from "./events/event.enums";
import { EventHandler } from "./events/event.handler";
import { RegisterService } from "./service.manager";

@RegisterService()
@SubscribeDelegates()
export class StorageService {
  private youtubeApiKey: string = '';

  @RegisterDelegate(AudioEvent.ApiKeyInput)
  onApiKeyInput(args: ApiKeyInputEventArgs): void {
    this.youtubeApiKey = args.apiKey;
    this.verifyApiKey(this.youtubeApiKey).then((valid) => {
      if (valid) {
        EventHandler.emit(AudioEvent.LoadPlayers, {});
      }
    });
  }

  public readTextFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const playlists = JSON.parse(event.target!.result as string);

        this.youtubeApiKey = playlists['apiKey'];

        this.verifyApiKey(this.youtubeApiKey).then((valid) => {
          if (valid) {
            EventHandler.emit(AudioEvent.Clear, {});
            playlists['playlists'].forEach((playlist: any) => {
              EventHandler.emit<AddPlaylistEventArgs>(AudioEvent.AddPlaylist, { name: playlist.name, playersList: playlist.players });
            });
          }
        });
      } catch (error) {
        console.error("Error parsing the configuration file", error);
      }
    }

    reader.onerror = (event) => {
      console.error("Error reading the file", reader.error);
    }

    reader.readAsText(file);
  }

  public saveTextFile(playlistsToSave: Map<string, Playlist>): void {
    const saveFile: any = { apiKey: this.youtubeApiKey, playlists: [] };
    playlistsToSave.forEach((playlist) => {
      saveFile['playlists'].push({
        name: playlist.name,
        players: playlist.getPlayers()
      });
    });


    const data = JSON.stringify(saveFile, null, 2);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'playlists.json';
    a.click();
  }

  public saveToPersistentStorage(playlistsToSave: Map<string, Playlist>): void {
    const playlists: any = [];
    playlistsToSave.forEach((playlist) => {
      playlists.push({
        name: playlist.name,
        players: playlist.getPlayers()
      });
    });

    localStorage.setItem('playlists', JSON.stringify(playlists));
    localStorage.setItem('apiKey', this.youtubeApiKey);
  }

  public loadFromPersistentStorage(): void {
    const playlists = JSON.parse(localStorage.getItem('playlists') || '[]');
    EventHandler.emit(AudioEvent.Clear, {});
    playlists.forEach((playlist: any) => {
      EventHandler.emit<AddPlaylistEventArgs>(AudioEvent.AddPlaylist, { name: playlist.name, playersList: playlist.players });
    });
  }

  private async verifyApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=YouTube+Data+API&type=video&key=${apiKey}`);
      return response.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async loadMetadata(videoId: string): Promise<void> {
    try {
      return (await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${this.youtubeApiKey}&part=snippet`)).json();
    } catch (error) {
      return console.log(error);
    }
  }

  public async loadApiKey(): Promise<void> {
    this.youtubeApiKey = localStorage.getItem('apiKey') || '';

    const valid = await this.verifyApiKey(this.youtubeApiKey);
    if (valid) {
      return Promise.resolve();
    }

    return Promise.reject('Invalid API key');
  }
}