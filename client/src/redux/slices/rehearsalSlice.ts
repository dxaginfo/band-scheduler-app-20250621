import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RehearsalState, Rehearsal } from '../../types/rehearsal';
import { api } from '../../services/api';

const initialState: RehearsalState = {
  rehearsals: [],
  currentRehearsal: null,
  loading: false,
  error: null,
};

export const fetchRehearsals = createAsyncThunk(
  'rehearsals/fetchRehearsals',
  async (_, { rejectWithValue }) => {
    try {
      // This is a placeholder for the actual API call
      const response = await api.get('/rehearsals');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rehearsals');
    }
  }
);

export const createRehearsal = createAsyncThunk(
  'rehearsals/createRehearsal',
  async (rehearsalData: Partial<Rehearsal>, { rejectWithValue }) => {
    try {
      // This is a placeholder for the actual API call
      const response = await api.post('/rehearsals', rehearsalData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create rehearsal');
    }
  }
);

export const rehearsalSlice = createSlice({
  name: 'rehearsals',
  initialState,
  reducers: {
    setCurrentRehearsal: (state, action: PayloadAction<Rehearsal | null>) => {
      state.currentRehearsal = action.payload;
    },
    clearRehearsalError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch rehearsals
    builder.addCase(fetchRehearsals.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRehearsals.fulfilled, (state, action) => {
      state.loading = false;
      state.rehearsals = action.payload;
    });
    builder.addCase(fetchRehearsals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create rehearsal
    builder.addCase(createRehearsal.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRehearsal.fulfilled, (state, action) => {
      state.loading = false;
      state.rehearsals.push(action.payload);
    });
    builder.addCase(createRehearsal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setCurrentRehearsal, clearRehearsalError } = rehearsalSlice.actions;

export default rehearsalSlice.reducer;
