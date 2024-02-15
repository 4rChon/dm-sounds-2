import { Controls } from '../core/controls';
import { DeletePlayerButton } from './controls/delete-player.button';
import { FadeButton } from "./controls/fade.button";
import { LoopButton } from "./controls/loop.button";
import { MoveDownButton } from './controls/move-down.button';
import { MoveUpButton } from './controls/move-up.button';
import { PlayButton } from "./controls/play.button";
import { RestartButton } from './controls/restart.button';
import { VolumeSlider } from "./controls/volume.slider";

export class AudioPlayerControls extends Controls {
  public volumeSlider: VolumeSlider;
  public playButton: PlayButton;
  public restartButton: RestartButton;
  public loopButton: LoopButton;
  public fadeButton: FadeButton;
  public moveDownButton: MoveDownButton;
  public moveUpButton: MoveUpButton;
  public deleteButton: DeletePlayerButton;

  constructor(public readonly playlistId: string, public readonly videoId: string) {
    super();
    this.playButton = new PlayButton(this.playlistId, this.videoId);
    this.volumeSlider = new VolumeSlider(this.playlistId, this.videoId);
    this.fadeButton = new FadeButton(this.playlistId, this.videoId);
    this.loopButton = new LoopButton(this.playlistId, this.videoId);
    this.restartButton = new RestartButton(this.playlistId, this.videoId);
    this.moveDownButton = new MoveDownButton(this.playlistId, this.videoId);
    this.moveUpButton = new MoveUpButton(this.playlistId, this.videoId);
    this.deleteButton = new DeletePlayerButton(this.playlistId, this.videoId);

    this.register(this.playButton, true, true, true);
    this.register(this.volumeSlider, true, true, true);
    this.register(this.fadeButton, true, true, true);
    this.register(this.loopButton, true, true, true);
    this.register(this.restartButton, true, true, false);
    this.register(this.moveDownButton, false, false, true);
    this.register(this.moveUpButton, false, false, true);
    this.register(this.deleteButton, true, true, false);
  }
}