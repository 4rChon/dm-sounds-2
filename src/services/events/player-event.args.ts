export interface PlayerEventArgs {
  playlistId: string;
  videoId: string;
}

export interface PlayEventArgs extends PlayerEventArgs {
  isPlaying: boolean;
}

export interface VolumeEventArgs extends PlayerEventArgs {
  volume: number;
}

export interface FadeInStartEventArgs extends PlayerEventArgs { }

export interface FadeInEventArgs extends PlayerEventArgs {
  volume: number;
}

export interface FadeInEndEventArgs extends PlayerEventArgs { }

export interface FadeOutStartEventArgs extends PlayerEventArgs { }

export interface FadeOutEventArgs extends PlayerEventArgs {
  volume: number;
}

export interface FadeOutEndEventArgs extends PlayerEventArgs { }

export interface LoopEventArgs extends PlayerEventArgs {
  isLooping: boolean;
}

export interface RestartEventArgs extends PlayerEventArgs { }

export interface DeleteEventArgs extends PlayerEventArgs { }