export interface PlaylistEventArgs {
  playlistId: string;
}

export interface AddPlayerEventArgs extends PlaylistEventArgs {
  videoId: string;
}

export interface DeletePlayerEventArgs extends PlaylistEventArgs {
  videoId: string;
}

export interface MovePlayerEventArgs extends PlaylistEventArgs {
  videoId: string;
}

export interface RenamePlaylistEventArgs extends PlaylistEventArgs {
  name: string;
}

export interface MoveEventArgs extends PlaylistEventArgs {
  playersList: string[];
}