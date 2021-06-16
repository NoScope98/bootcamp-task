import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { todosApi } from './todosApi';
import { FetchingStatuses } from '../../utils/constants';
import {
  IError,
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

export const fetchAll = createAsyncThunk<
  ITodo[],
  void,
  {
    rejectValue: IError;
  }
>(`${sliceName}/fetchAll`, async (args, thunkAPI) => {
  try {
    const response = await todosApi.getAll();
    return response.data;
  } catch (err) {
    const {
      status,
      data: { message },
    } = err.response;
    return thunkAPI.rejectWithValue({ status, message });
  }
});

export const create = createAsyncThunk<
  ITodo,
  ITodoCreateRequest,
  {
    rejectValue: IError;
  }
>(`${sliceName}/create`, async (args, thunkAPI) => {
  try {
    const response = await todosApi.create(args);
    return response.data;
  } catch (err) {
    const {
      status,
      data: { message },
    } = err.response;
    return thunkAPI.rejectWithValue({ status, message });
  }
});

export const fetchById = createAsyncThunk<
  ITodo,
  ITodo['id'],
  {
    rejectValue: IError;
  }
>(`${sliceName}/fetchById`, async (args, thunkAPI) => {
  try {
    const response = await todosApi.getById(args);
    return response.data;
  } catch (err) {
    const {
      status,
      data: { message },
    } = err.response;
    return thunkAPI.rejectWithValue({ status, message });
  }
});

export const update = createAsyncThunk<
  void,
  { id: ITodo['id'] } & ITodoUpdateRequest,
  {
    rejectValue: IError;
  }
>(`${sliceName}/update`, async (args, thunkAPI) => {
  try {
    const { id, ...params } = args;
    const response = await todosApi.update(id, params);
    return response.data;
  } catch (err) {
    const {
      status,
      data: { message },
    } = err.response;
    return thunkAPI.rejectWithValue({ status, message });
  }
});

export const remove = createAsyncThunk<
  void,
  { id: ITodo['id'] },
  {
    rejectValue: IError;
  }
>(`${sliceName}/remove`, async (args, thunkAPI) => {
  try {
    const response = await todosApi.delete(args.id);
    return response.data;
  } catch (err) {
    const {
      status,
      data: { message },
    } = err.response;
    return thunkAPI.rejectWithValue({ status, message });
  }
});

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
        adapter.removeOne(state, action.meta.arg.id);
      })

      .addMatcher(
        isFulfilled(fetchAll, create, fetchById, update, remove),
        (state) => {
          state.status = FetchingStatuses.Fulfilled;
        }
      )
      .addMatcher(
        isPending(fetchAll, create, fetchById, update, remove),
        (state) => {
          state.status = FetchingStatuses.Pending;
        }
      )
      .addMatcher(
        isRejected(fetchAll, create, fetchById, update, remove),
        (state) => {
          state.status = FetchingStatuses.Rejected;
        }
      );
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
