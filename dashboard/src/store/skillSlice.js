import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../lib/api.js';

export const getAllSkills = createAsyncThunk('skills/getAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/v1/skill');
    return data.skills;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch skills');
  }
});

export const addSkill = createAsyncThunk(
  'skills/add',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/v1/skill', formData);
      return data.skill;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.error || 'Failed to add skill'
      );
    }
  }
);

export const updateSkill = createAsyncThunk(
  'skills/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/v1/skill/${id}`, formData);
      return data.skill;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.error || 'Failed to update skill'
      );
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'skills/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/skill/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.error || 'Failed to delete skill'
      );
    }
  }
);

const skillSlice = createSlice({
  name: 'skills',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSkillError: (state) => {
      state.error = null;
    },
  },
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
      })
      .addCase(addSkill.pending, (state) => {
        state.error = null;
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
      })
      .addCase(addSkill.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default skillSlice.reducer;

