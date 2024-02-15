import { AudioService } from './services/audio.service';
import { AudioUIService } from './services/audio.ui.service';
import { ServiceManager } from './services/service.manager';
import { StorageService } from './services/storage.service';

export class App {
  private static instance: App;
  private appElement: HTMLDivElement = document.getElementById('app') as HTMLDivElement;

  private constructor() {
    const audioUIService = ServiceManager.get(AudioUIService);
    const audioService = ServiceManager.get(AudioService);
    const storageService = ServiceManager.get(StorageService);

    audioUIService.addFileInput.onchange = (event) => {
      const files = audioUIService.addFileInput.files;
      if (files && files.length > 0) {
        storageService.readTextFile(files[0]);
      }
    }

    this.appElement.append(audioUIService.header, audioUIService.playlistContainer);
  }

  public static get Instance(): App {
    return this.instance || (this.instance = this.createInstance());
  }

  private static createInstance(): App {
    return new this();
  }
}