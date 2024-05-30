import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchProgramms = createAsyncThunk('programs/fetchProgramms', async () => {
  const { data } = await axios.get('/programms');
  return data;
});

export const fetchAddProgramm = createAsyncThunk('programs/fetchAddProgramm', async (params) => {
  let data;
  await axios
    .post('/programms', params)
    .then((res) => (data = res.payload))
    .catch((e) => (data = e.payload));
  return data;
});

const initialState = {
  prevActiveIndex: -1,
  activeIndex: -1,
  theme: 'hbtn',
  prevTheme: 'hbtn',
  test: [1, 2, 3],
  data: [
    'Шифр и наименование научной специальности',
    'Информация о программе',
    'Программы дисциплин',
    'Индекс дисциплины',
    'Информация о программе',
    'Общее кол-во часов',
    'Занятия',
    'Тема занятия',
    'Номер занятия',
    'Количество часов',
  ],
  items: [],
  isLoading: true,
};

export const progSlice = createSlice({
  name: 'programms',
  initialState,
  reducers: {
    setActiveIndex(state, action) {
      if (state.prevActiveIndex !== state.activeIndex) state.prevActiveIndex = state.activeIndex;
      else state.prevActiveIndex = -1;
      state.activeIndex = action.payload;
    },
    setTheme(state, action) {
      if (state.activeIndex !== action.payload || state.theme === 'hbtn')
        state.theme = 'hbtn hbtnr';
      else state.theme = 'hbtn';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProgramms.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchProgramms.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export const { setActiveIndex, setTheme } = progSlice.actions;

export default progSlice.reducer;
