import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { usersApi } from './usersApi';
import { FetchingStatuses } from '../../utils/constants';
import { IAuthData, IError } from '../../utils/types';

const sliceName = 'users';

const adapter = createEntityAdapter<IAuthData>({
  selectId: (user) => user.name,
});

export interface IUsersState {
  status: FetchingStatuses;
}

const initialState: IUsersState = {
  status: FetchingStatuses.Idle,
};

export const fetchAll = createAsyncThunk<
  IAuthData[],
  void,
  {
    rejectValue: IError;
  }
>(
  `${sliceName}/fetchAll`,
  async (args, thunkAPI) => {
    try {
      const response = await usersApi.getAll();
      return response.data;
    } catch (err) {
      const {
        status,
        data: { message },
      } = err.response;
      return thunkAPI.rejectWithValue({ status, message });
    }
  },
  {
    condition: (args, { getState, extra }) => {
      const { users } = getState() as RootState;
      if (users.status === FetchingStatuses.Pending) {
        return false;
      }
    },
  }
);

export const slice = createSlice({
  name: sliceName,
  initialState: adapter.getInitialState(initialState),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.fulfilled, adapter.setAll)

      .addMatcher(isFulfilled(fetchAll), (state) => {
        state.status = FetchingStatuses.Fulfilled;
      })
      .addMatcher(isPending(fetchAll), (state) => {
        state.status = FetchingStatuses.Pending;
      })
      .addMatcher(isRejected(fetchAll), (state) => {
        state.status = FetchingStatuses.Rejected;
      });
  },
});

const adapterSelectors = adapter.getSelectors(
  (state: RootState) => state.users
);

export const userSelectors = {
  ...adapterSelectors,
  selectStatus: (state: RootState) => state.users.status,
};

export default slice.reducer;
