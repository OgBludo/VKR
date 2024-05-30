import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (params) => {
  const { data } = await axios.post('/login', params);
  return data;
});
export const fetchTeacherData = createAsyncThunk('auth/fetchTeacherData', async (params) => {
  const { data } = await axios.post('/login/teacher', params);
  return data;
});

export const fetchCheckUserAuthData = createAsyncThunk('auth/fetchCheckUserAuthData', async () => {
  const { data } = await axios.get('/me');
  return data;
});
export const fetchCheckTeacherAuthData = createAsyncThunk(
  'auth/fetchCheckTeacherAuthData',
  async () => {
    const { data } = await axios.get('/teacherMe');
    return data;
  },
);

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
  const { data } = await axios.post('/register', params);
  return data;
});

const initialState = {
  data: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.data = action.payload;
    });
    builder.addCase(fetchUserData.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchCheckUserAuthData.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.data = action.payload;
    });
    builder.addCase(fetchCheckUserAuthData.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchCheckTeacherAuthData.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.data = action.payload;
    });
    builder.addCase(fetchCheckTeacherAuthData.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchRegister.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.data = action.payload;
    });
    builder.addCase(fetchRegister.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchTeacherData.fulfilled, (state, action) => {
      state.status = 'loaded';
      state.data = action.payload;
    });
    builder.addCase(fetchTeacherData.pending, (state) => {
      state.status = 'loading';
    });
  },
});

export const { logout } = authSlice.actions;
export const selectIsAuth = (state) => {
  // console.log('userData: ', window.localStorage.getItem('token'));

  return Boolean(window.localStorage.getItem('token'));
};

export const authReducer = authSlice.reducer;
