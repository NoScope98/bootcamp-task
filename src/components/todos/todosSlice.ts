import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { todosApi } from './todosApi';
import { FetchingStatuses } from '../../utils/constants';
import { ITodo } from '../../utils/types';

const sliceName = 'todos';

const adapter = createEntityAdapter<ITodo>();

export interface ITodosState {
  status: FetchingStatuses;
}

const initialState: ITodosState = {
  status: FetchingStatuses.Idle,
};

export const fetchAll = createAsyncThunk<ITodo[], undefined>(
  `${sliceName}/fetchAll`,
  async (args, thunkAPI) => {
    try {
      const response = await todosApi.getAll();
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const slice = createSlice({
  name: sliceName,
  initialState: adapter.getInitialState(initialState),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.status = FetchingStatuses.Fulfilled;
        adapter.setAll(state, action);
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.status = FetchingStatuses.Rejected;
      })
      .addCase(fetchAll.pending, (state, action) => {
        state.status = FetchingStatuses.Pending;
      });
  },
});

const adapterSelectors = adapter.getSelectors(
  (state: RootState) => state.todos
);

export const todoSelectors = {
  ...adapterSelectors,
  selectById: (id: ITodo['id']) => (state: RootState) =>
    adapterSelectors.selectById(state, id),
  selectStatus: (state: RootState) => state.todos.status,
};

export default slice.reducer;
