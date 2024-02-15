import { AddPlaylistButton } from "../header/add-playlist.button";
import { ApiKeyInput } from "../header/api-key.input";
import { ClearButton } from "../header/clear.button";
import { DownloadFileButton } from "../header/download-file.button";
import { RegisterService } from "./service.manager";

@RegisterService()
export class AudioUIService {
  public playlistContainer: HTMLDivElement;
  public header: HTMLDivElement;
  public addFileInput: HTMLInputElement;
  public downloadFileButton: DownloadFileButton;
  public clearButton: ClearButton;
  public addPlaylistButton: AddPlaylistButton;
  public apiKeyInput: ApiKeyInput;

  constructor() {
    this.playlistContainer = document.createElement('div');
    this.header = document.createElement('div');
    this.addFileInput = document.createElement('input');
    this.downloadFileButton = new DownloadFileButton();
    this.clearButton = new ClearButton();
    this.addPlaylistButton = new AddPlaylistButton();
    this.apiKeyInput = new ApiKeyInput();

    this.addFileInput.id = 'file-input';
    this.addFileInput.type = 'file';
    this.addFileInput.accept = '.json';
    this.addFileInput.className = 'file-input';

    const label = document.createElement('label');
    label.htmlFor = 'file-input';
    label.className = 'file-input-label material-icons';
    label.innerText = 'upload';

    this.header.id = 'header';
    this.header.className = 'header';
    this.header.append(label, this.downloadFileButton.element, this.addFileInput, this.addPlaylistButton.element, this.clearButton.element, this.apiKeyInput.inputElement, this.apiKeyInput.buttonElement);

    this.playlistContainer.id = 'playlist-container';
    this.playlistContainer.className = 'playlist-container';
  }
}