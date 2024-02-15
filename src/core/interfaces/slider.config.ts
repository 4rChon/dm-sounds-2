export interface SliderConfig {
  type?: string;
  min?: string;
  max?: string;
  step?: string;
  value?: string;
  onInput: () => any;
}