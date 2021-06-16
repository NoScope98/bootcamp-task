import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import {
  fetchAll,
  create,
  fetchById,
  update,
  remove,
} from '../components/todos/todosSlice';
import { FetchingStatuses, Roles } from '../utils/constants';
import { IAuthData, IError, ILoginRequest } from '../utils/types';
import { authApi } from './authApi';

const sliceName = 'auth';

export interface IAuthState extends IAuthData {
  status: FetchingStatuses;
  isAuthenticated: boolean;
}

const initialState: IAuthState = {
  name: '',
  role: Roles.User,
  status: FetchingStatuses.Idle,
  isAuthenticated: false,
};

export const signIn = createAsyncThunk<
  IAuthData,
  ILoginRequest,
  {
    rejectValue: IError;
  }
>(`${sliceName}/signIn`, async (args, thunkAPI) => {
  try {
    const response = await authApi.login(args);
    return response.data;
  } catch (err) {
    const {
      status,
      data: { message },
    } = err.response;
    return thunkAPI.rejectWithValue({ status, message });
  }
});

export const signOut = createAsyncThunk<
  void,
  void,
  {
    rejectValue: IError;
  }
>(`${sliceName}/signOut`, async (args, thunkAPI) => {
  try {
    const response = await authApi.logout();
    return response.data;
  } catch (err) {
    const {
      status,
      data: { message },
    } = err.response;
    return thunkAPI.rejectWithValue({ status, message });
  }
});

export const checkAuthorization = createAsyncThunk<
  IAuthData,
  void,
  {
    rejectValue: IError;
  }
>(`${sliceName}/checkAuthorization`, async (args, thunkAPI) => {
  try {
    const response = await authApi.me();
    return response.data;
  } catch (err) {
    const {
      status,
      data: { message },
    } = err.response;
    return thunkAPI.rejectWithValue({ status, message });
  }
});

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(signOut.fulfilled, (state, action) => {
        state.isAuthenticated = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        if (action.payload?.status === 400) {
          state.name = initialState.name;
          state.role = initialState.role;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuthorization.fulfilled, (state, action) => {
        state.name = action.payload.name;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthorization.rejected, (state, action) => {
        if (action.payload?.status === 401) {
          state.name = initialState.name;
          state.role = initialState.role;
          state.isAuthenticated = false;
        }
      })

      .addMatcher(isFulfilled(signIn, signOut, checkAuthorization), (state) => {
        state.status = FetchingStatuses.Fulfilled;
      })
      .addMatcher(isPending(signIn, signOut, checkAuthorization), (state) => {
        state.status = FetchingStatuses.Pending;
      })
      .addMatcher(isRejected(signIn, signOut, checkAuthorization), (state) => {
        state.status = FetchingStatuses.Rejected;
      })

      .addMatcher(
        isRejected(fetchAll, create, fetchById, update, remove),
        (state, action) => {
          if (action.payload?.status === 401) {
            state.name = initialState.name;
            state.role = initialState.role;
            state.isAuthenticated = false;
          }
        }
      );
  },
});

export default slice.reducer;
