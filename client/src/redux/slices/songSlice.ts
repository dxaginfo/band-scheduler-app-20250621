import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { SongState, Song } from '../../types/song';
import { api } from '../../services/api';

const initialState: SongState = {
  songs: [],
  currentSong: null,
  loading: false,
  error: null,
};

export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async (_, { rejectWithValue }) => {
    try {
      // This is a placeholder for the actual API call
      const response = await api.get('/songs');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch songs');
    }
  }
);

export const createSong = createAsyncThunk(
  'songs/createSong',
  async (songData: Partial<Song>, { rejectWithValue }) => {
    try {
      // This is a placeholder for the actual API call
      const response = await api.post('/songs', songData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create song');
    }
  }
);

export const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    setCurrentSong: (state, action: PayloadAction<Song | null>) => {
      state.currentSong = action.payload;
    },
    clearSongError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch songs
    builder.addCase(fetchSongs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSongs.fulfilled, (state, action) => {
      state.loading = false;
      state.songs = action.payload;
    });
    builder.addCase(fetchSongs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create song
    builder.addCase(createSong.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createSong.fulfilled, (state, action) => {
      state.loading = false;
      state.songs.push(action.payload);
    });
    builder.addCase(createSong.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setCurrentSong, clearSongError } = songSlice.actions;

export default songSlice.reducer;
