import { AudioPlayer } from "../audio-player/audio-player";
import { PlaylistControls } from "./playlist.controls";

export class PlaylistContainer {
  public readonly element: HTMLDivElement;
  public readonly controls: PlaylistControls;

  private readonly headerElement: HTMLDivElement;
  private readonly titleElement: HTMLHeadingElement;
  private readonly leftContent: HTMLDivElement;
  private readonly rightContent: HTMLDivElement;
  private readonly playlistContent: HTMLDivElement;

  constructor(public readonly playlistId: string, public name: string) {
    this.name = name;
    this.element = document.createElement('div');
    this.element.id = `playlist-${this.playlistId}`;
    this.element.className = 'playlist';

    this.controls = new PlaylistControls(this.playlistId);

    this.titleElement = document.createElement('h2');
    this.titleElement.textContent = this.name;

    this.leftContent = document.createElement('div');
    this.leftContent.className = 'left-content';

    this.controls.renamePlaylist.setInput(this.name);
    this.leftContent.append(this.controls.renamePlaylist.element);

    this.rightContent = document.createElement('div');
    this.rightContent.className = 'right-content';

    this.rightContent.append(this.controls.addPlayer.element);
    this.rightContent.append(this.controls.fadeInPlaylist.element);
    this.rightContent.append(this.controls.fadeOutPlaylist.element);
    this.rightContent.append(this.controls.deletePlaylist.element);

    this.headerElement = document.createElement('div');
    this.headerElement.className = 'playlist-header';
    this.headerElement.append(this.leftContent, this.rightContent);

    this.playlistContent = document.createElement('div');
    this.playlistContent.className = 'playlist-content';

    this.element.append(this.headerElement);
    this.element.appendChild(this.playlistContent);
  }

  public setName(name: string): void {
    this.name = name;
    this.titleElement.textContent = this.name;
  }

  public addPlayer(player: AudioPlayer): void {
    this.playlistContent.appendChild(player.container.element);
  }

  public removePlayer(player: AudioPlayer): void {
    this.playlistContent.removeChild(player.container.element);
  }

  public moveUpPlayer(player: AudioPlayer, currentIndex: number): void {
    this.playlistContent.insertBefore(player.container.element, this.playlistContent.children[currentIndex - 1]);
  }

  public moveDownPlayer(player: AudioPlayer, currentIndex: number): void {
    this.playlistContent.insertBefore(player.container.element, this.playlistContent.children[currentIndex + 1].nextSibling);
  }
}