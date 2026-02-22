import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../lib/api.js';

export const getResume = createAsyncThunk(
  'resume/get',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/v1/resume');
      return data.resume;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch resume');
    }
  }
);

export const updateResume = createAsyncThunk(
  'resume/update',
  async (url, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/api/v1/resume', { url });
      return data.resume;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update resume');
    }
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState: {
    resume: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(getResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resume = action.payload;
      })
      .addCase(getResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resume = action.payload;
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resumeSlice.reducer;
