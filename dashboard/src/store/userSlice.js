import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../lib/api.js';

export const register = createAsyncThunk('user/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/v1/user/register', payload);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/api/v1/user/login', credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const getUser = createAsyncThunk('user/getUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/api/v1/user/me');
    return data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
  }
});

export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    await api.get('/api/v1/user/logout');
    localStorage.removeItem('token');
  } catch (error) {
    localStorage.removeItem('token');
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSession: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { clearError, clearSession } = userSlice.actions;
export default userSlice.reducer;
