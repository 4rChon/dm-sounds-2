import { Disableable } from "./interfaces/disableable";
import { Enableable } from "./interfaces/enableable";
import { Resettable } from "./interfaces/resettable";
import { SliderConfig } from "./interfaces/slider.config";

export class Slider implements Resettable, Enableable, Disableable {
  public element: HTMLInputElement;

  public get value(): number {
    return Number(this.element.value);
  }

  public constructor(private readonly config: SliderConfig) {
    this.element = document.createElement('input');
    this.element.type = this.config.type ?? 'range';
    this.element.min = this.config.min ?? '0';
    this.element.max = this.config.max ?? '100';
    this.element.step = this.config.step ?? '1';
    this.element.value = this.config.value ?? '100';
    this.element.oninput = this.config.onInput;
  }

  public reset(): void {
    this.element.value = this.config.value ?? '100';
  }

  public enable(): void {
    this.element.disabled = false;
  }

  public disable(): void {
    this.element.disabled = true;
  }
}