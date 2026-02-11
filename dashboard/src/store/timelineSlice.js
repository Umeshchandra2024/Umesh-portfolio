import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getTimeline = createAsyncThunk('timeline/getAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_BASE}/api/v1/timeline`);
    return data.timeline;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch timeline');
  }
});

const timelineSlice = createSlice({
  name: 'timeline',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTimeline.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTimeline.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getTimeline.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default timelineSlice.reducer;

