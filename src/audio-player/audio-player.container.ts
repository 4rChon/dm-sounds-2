import { AudioPlayerControls } from "./audio-player.controls";

export class AudioPlayerContainer {
  public readonly element: HTMLDivElement;
  public readonly controls: AudioPlayerControls;
  private readonly leftContent: HTMLDivElement;
  private readonly rightContent: HTMLDivElement;

  constructor(public readonly playlistId: string, public readonly videoId: string) {
    this.element = document.createElement('div');
    this.element.id = `${playlistId}-${videoId}-container`;
    this.element.className = 'player-container';

    this.controls = new AudioPlayerControls(playlistId, videoId);

    const playerElement = document.createElement('div');
    playerElement.id = `${playlistId}-${videoId}`;
    playerElement.style.display = 'none';

    this.rightContent = document.createElement('div');
    this.rightContent.className = 'right-content';

    this.leftContent = document.createElement('div');
    this.leftContent.className = 'left-content';

    this.element.append(this.leftContent, this.rightContent, playerElement);
  }

  public createPlayerCard(metadata: any) {
    const playButton = this.controls.playButton;
    playButton.element.style.backgroundImage = `url(${metadata.items[0].snippet.thumbnails.default.url})`;
    playButton.element.style.backgroundSize = 'cover';

    const videoTitle = document.createElement('p');
    videoTitle.innerText = metadata.items[0].snippet.title;
    videoTitle.className = 'player-title';

    this.leftContent.append(playButton.element, videoTitle);
  }

  public createControls(): void {
    this.leftContent.prepend(
      this.controls.moveUpButton?.element,
      this.controls.moveDownButton?.element
    );

    this.rightContent.append(
      this.controls.volumeSlider?.element,
      this.controls.restartButton?.element,
      this.controls.loopButton?.element,
      this.controls.fadeButton?.element,
      this.controls.deleteButton?.element
    );

    this.controls.disable();
  }

  public enableControls(): void {
    this.controls.enable();
  }

  public resetControls(): void {
    this.controls.reset();
  }
}