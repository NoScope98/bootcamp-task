import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import { FetchingStatuses } from '../utils/constants';
import { IAuthData, ILoginRequest } from '../utils/types';
import { authApi } from './authApi';

const sliceName = 'auth';

export interface IAuthState extends IAuthData {
  status: FetchingStatuses;
  isAuthenticated: boolean;
}

const initialState: IAuthState = {
  name: '',
  role: '',
  status: FetchingStatuses.Idle,
  isAuthenticated: false,
};

export const signIn = createAsyncThunk<IAuthData, ILoginRequest>(
  `${sliceName}/signIn`,
  async (args, thunkAPI) => {
    try {
      const response = await authApi.login(args);
      return response.data;
    } catch (err) {
      console.log('err', err);
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const signOut = createAsyncThunk(
  `${sliceName}/signOut`,
  async (args, thunkAPI) => {
    try {
      const response = await authApi.logout();
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const checkAuthorization = createAsyncThunk<IAuthData, undefined>(
  `${sliceName}/checkAuthorization`,
  async (args, thunkAPI) => {
    try {
      const response = await authApi.me();
      return response.data;
    } catch (err) {
      const { data, status } = err.response;
      return thunkAPI.rejectWithValue({ data, status });
    }
  }
);

const slice = createSlice({
  name: sliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = FetchingStatuses.Fulfilled;
        state.name = action.payload.name;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = FetchingStatuses.Rejected;
      })
      .addCase(signIn.pending, (state, action) => {
        state.status = FetchingStatuses.Pending;
      })

      .addCase(signOut.fulfilled, (state, action) => {
        state.status = FetchingStatuses.Fulfilled;
        state.isAuthenticated = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.status = FetchingStatuses.Rejected;
      })
      .addCase(signOut.pending, (state, action) => {
        state.status = FetchingStatuses.Pending;
      })

      .addCase(checkAuthorization.fulfilled, (state, action) => {
        state.status = FetchingStatuses.Fulfilled;
        state.name = action.payload.name;
        state.role = action.payload.role;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthorization.rejected, (state, action: any) => {
        state.status = FetchingStatuses.Rejected;

        if (action.payload.status === 401) {
          state.name = initialState.name;
          state.role = initialState.role;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuthorization.pending, (state, action) => {
        state.status = FetchingStatuses.Pending;
      });
  },
});

export default slice.reducer;
