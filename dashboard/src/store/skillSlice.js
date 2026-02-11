import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getAllSkills = createAsyncThunk('skills/getAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_BASE}/api/v1/skill`);
    return data.skills;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch skills');
  }
});

const skillSlice = createSlice({
  name: 'skills',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSkills.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAllSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default skillSlice.reducer;

