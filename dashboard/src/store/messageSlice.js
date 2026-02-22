import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../lib/api.js';

export const getMessages = createAsyncThunk('messages/getAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/v1/message');
    return data.messages;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
  }
});

export const markMessageRead = createAsyncThunk(
  'messages/markRead',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/v1/message/${id}/read`);
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark message as read');
    }
  },
);

export const deleteMessage = createAsyncThunk(
  'messages/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/message/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete message');
    }
  },
);

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markMessageRead.fulfilled, (state, action) => {
        const idx = state.items.findIndex((m) => m._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => m._id !== action.payload);
      });
  },
});

export default messageSlice.reducer;

