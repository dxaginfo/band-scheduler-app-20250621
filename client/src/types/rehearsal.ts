export interface Rehearsal {
  id: string;
  bandId: string;
  title: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attendees?: Attendee[];
  songs?: RehearsalSong[];
}

export interface Attendee {
  userId: string;
  rehearsalId: string;
  status: 'confirmed' | 'declined' | 'maybe' | 'no_response';
  actualAttendance?: 'present' | 'absent' | 'late';
}

export interface RehearsalSong {
  rehearsalId: string;
  songId: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RehearsalState {
  rehearsals: Rehearsal[];
  currentRehearsal: Rehearsal | null;
  loading: boolean;
  error: string | null;
}
