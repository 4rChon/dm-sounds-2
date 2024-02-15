import { Disableable } from "./interfaces/disableable";
import { Enableable } from "./interfaces/enableable";
import { Resettable } from "./interfaces/resettable";

export class Input implements Resettable, Enableable, Disableable {
  public element: HTMLDivElement;
  public buttonElement: HTMLButtonElement;
  public inputElement: HTMLInputElement;

  public constructor(icon: string, onClick: (value: any) => void, buttonClass?: string, inputClass?: string) {
    this.buttonElement = document.createElement('button');
    this.buttonElement.innerText = icon;
    this.buttonElement.className = buttonClass ? `material-icons ${icon} ${buttonClass}` : `material-icons ${icon}`;
    this.buttonElement.onclick = () => {
      onClick(this.inputElement.value);
    };

    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.className = inputClass ? `input ${inputClass}` : 'input';
    this.inputElement.oninput = () => {
      this.buttonElement.disabled = !this.canSubmit();
    };

    this.element = document.createElement('div');
    this.element.className = 'input-form-container';
    this.element.append(this.inputElement, this.buttonElement);

    this.buttonElement.disabled = true;

    this.inputElement.addEventListener('keyup', (event) => {
      if (event.key === 'Enter' && this.canSubmit()) {
        this.buttonElement.click();
        this.inputElement.blur();
      }
    });
  }

  reset(): void {
    this.inputElement.value = '';
    this.buttonElement.disabled = true;
  }

  enable(): void {
    this.inputElement.disabled = false;
    this.buttonElement.disabled = false;
  }

  disable(): void {
    this.inputElement.disabled = true;
    this.buttonElement.disabled = true;
  }

  canSubmit(): boolean {
    return this.inputElement.value.length > 0;
  }

  setInput(value: string): void {
    this.inputElement.value = value;
    this.buttonElement.disabled = !this.canSubmit();
  }
}