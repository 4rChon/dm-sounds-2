

export interface DeletePlaylistEventArgs {
  playlistId: string;
}

export interface AddPlaylistEventArgs {
  name?: string,
  playersList: string[]
}

export interface ApiKeyInputEventArgs {
  apiKey: string;
}