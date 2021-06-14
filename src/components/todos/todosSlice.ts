import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  isFulfilled,
  isPending,
  isRejectedWithValue,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { todosApi } from './todosApi';
import { FetchingStatuses } from '../../utils/constants';
import {
  ITodo,
  ITodoCreateRequest,
  ITodoUpdateRequest,
} from '../../utils/types';

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

export const create = createAsyncThunk<ITodo, ITodoCreateRequest>(
  `${sliceName}/create`,
  async (args, thunkAPI) => {
    try {
      const response = await todosApi.create(args);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const fetchById = createAsyncThunk<ITodo, ITodo['id']>(
  `${sliceName}/fetchById`,
  async (args, thunkAPI) => {
    try {
      const response = await todosApi.getById(args);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const update = createAsyncThunk<
  undefined,
  { id: ITodo['id'] } & ITodoUpdateRequest
>(`${sliceName}/update`, async (args, thunkAPI) => {
  try {
    const { id, ...params } = args;
    const response = await todosApi.update(id, params);
    return response.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const remove = createAsyncThunk<undefined, ITodo['id']>(
  `${sliceName}/remove`,
  async (args, thunkAPI) => {
    try {
      const response = await todosApi.delete(args);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const slice = createSlice({
  name: sliceName,
  initialState: adapter.getInitialState(initialState),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.fulfilled, adapter.setAll)
      .addCase(create.fulfilled, adapter.upsertOne)
      .addCase(fetchById.fulfilled, adapter.upsertOne)
      .addCase(update.fulfilled, (state, action) => {
        const { id, title, description } = action.meta.arg;
        adapter.updateOne(state, {
          id,
          changes: {
            title,
            description,
          },
        });
      })
      .addCase(remove.fulfilled, (state, action) => {
        adapter.removeOne(state, action.meta.arg);
      })

      .addMatcher(isFulfilled, (state) => {
        state.status = FetchingStatuses.Fulfilled;
      })
      .addMatcher(isPending, (state) => {
        state.status = FetchingStatuses.Pending;
      })
      .addMatcher(isRejectedWithValue, (state) => {
        state.status = FetchingStatuses.Rejected;
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
