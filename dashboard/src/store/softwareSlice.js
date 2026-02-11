import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getSoftwareApps = createAsyncThunk(
  'software/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE}/api/v1/software`);
      return data.apps;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch software apps');
    }
  },
);

const softwareSlice = createSlice({
  name: 'software',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSoftwareApps.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSoftwareApps.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getSoftwareApps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default softwareSlice.reducer;

