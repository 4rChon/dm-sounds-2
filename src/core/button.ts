import { Disableable } from "./interfaces/disableable";
import { Enableable } from "./interfaces/enableable";
import { Resettable } from "./interfaces/resettable";

export abstract class Button implements Resettable, Enableable, Disableable {
  public element: HTMLButtonElement;

  protected isDisabled: boolean = false;

  private className: string;

  public constructor(private readonly icon: string, onClick: () => any, className?: string) {
    this.className = className ? `material-icons ${className}` : 'material-icons';
    this.element = document.createElement('button');
    this.element.className = this.className;
    this.element.innerText = this.icon;
    this.element.onclick = onClick;
  }

  public click(): void {
    this.element.click();
  }

  public reset(): void {
    this.element.className = this.className;
    this.element.innerText = this.icon;
  }

  public enable(): void {
    this.isDisabled = false;
    this.element.disabled = false;
  }

  public disable(): void {
    this.isDisabled = true;
    this.element.disabled = true;
  }
}