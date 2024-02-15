import { Button } from "./button";
import { Input } from "./input";
import { Disableable } from "./interfaces/disableable";
import { Enableable } from "./interfaces/enableable";
import { Resettable } from "./interfaces/resettable";
import { Slider } from "./slider";

export class Controls {
  private controls: (Input | Slider | Button)[] = [];
  private onEnable: Enableable[] = [];
  private onDisable: Disableable[] = [];
  private onReset: Resettable[] = [];

  public disable(): void {
    this.onDisable.forEach((disableable) => disableable.disable());
  }

  public enable(): void {
    this.onEnable.forEach((enableable) => enableable.enable());
  }

  public reset(): void {
    this.onReset.forEach((resettable) => resettable.reset());
  }

  public register(control: Input | Slider | Button, isDisableable: boolean, isEnableable: boolean, isResettable: boolean) {
    this.controls.push(control);

    if (isDisableable) {
      this.onDisable.push(control);
    }

    if (isEnableable) {
      this.onEnable.push(control);
    }

    if (isResettable) {
      this.onReset.push(control);
    }
  }
}