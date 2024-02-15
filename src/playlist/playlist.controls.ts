import { Controls } from "../core/controls";
import { AddPlayerInput } from "./controls/add-player.input";
import { DeletePlaylistButton } from "./controls/delete-playlist.button";
import { FadeInPlaylistButton } from "./controls/fade-in-playlist.button";
import { FadeOutPlaylistButton } from "./controls/fade-out-playlist.button";
import { RenamePlaylistInput } from "./controls/rename-playlist.input";

export class PlaylistControls extends Controls {
  public renamePlaylist: RenamePlaylistInput;
  public addPlayer: AddPlayerInput;
  public deletePlaylist: DeletePlaylistButton;
  public fadeInPlaylist: FadeInPlaylistButton;
  public fadeOutPlaylist: FadeOutPlaylistButton;

  constructor(private playlistId: string) {
    super();
    this.renamePlaylist = new RenamePlaylistInput(this.playlistId);
    this.addPlayer = new AddPlayerInput(this.playlistId);
    this.fadeInPlaylist = new FadeInPlaylistButton(this.playlistId);
    this.fadeOutPlaylist = new FadeOutPlaylistButton(this.playlistId);
    this.deletePlaylist = new DeletePlaylistButton(this.playlistId);

    this.register(this.renamePlaylist, true, true, false);
    this.register(this.addPlayer, true, true, false);
    this.register(this.fadeInPlaylist, true, true, false);
    this.register(this.fadeOutPlaylist, true, true, false);
    this.register(this.deletePlaylist, true, true, false);
  }
}