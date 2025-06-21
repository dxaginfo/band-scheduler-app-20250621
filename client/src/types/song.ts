export interface Song {
  id: string;
  bandId: string;
  title: string;
  artist?: string;
  status: 'new' | 'in_progress' | 'performance_ready';
  notes?: string;
  addedBy: string;
  addedAt: string;
  resources?: SongResource[];
}

export interface SongResource {
  id: string;
  songId: string;
  resourceType: 'chord_chart' | 'lyrics' | 'recording' | 'other';
  fileUrl: string;
  description?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface SongState {
  songs: Song[];
  currentSong: Song | null;
  loading: boolean;
  error: string | null;
}
