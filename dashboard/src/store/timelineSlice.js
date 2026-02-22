import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../lib/api.js';

export const getTimeline = createAsyncThunk('timeline/getAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/v1/timeline');
    return data.timeline;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch timeline');
  }
});

export const createTimelineItem = createAsyncThunk(
  'timeline/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/v1/timeline', payload);
      return data.item;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add timeline item');
    }
  }
);

export const updateTimelineItem = createAsyncThunk(
  'timeline/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/v1/timeline/${id}`, payload);
      return data.item;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update timeline item');
    }
  }
);

export const deleteTimelineItem = createAsyncThunk(
  'timeline/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/timeline/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete timeline item');
    }
  }
);

const timelineSlice = createSlice({
  name: 'timeline',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTimelineError: (state) => {
      state.error = null;
    },
  },
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
      })
      .addCase(createTimelineItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTimelineItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.items.push(action.payload);
      })
      .addCase(createTimelineItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTimelineItem.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteTimelineItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      });
  },
});

export const { clearTimelineError } = timelineSlice.actions;
export default timelineSlice.reducer;
