import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import { addReservation, removeReservation, updateReservation } from './reservationSlice';


export const getReservations = createAsyncThunk(
  'reservationsApp/reservations/getReservations',
  async (id, { getState }) => {
    const response = await axios.get(`http://localhost:5000/reservations/getPartnerReservation/${id}`);
    const data = await response.data;
    console.log("data", data)
    return { data };
  }
);

const reservationsAdapter = createEntityAdapter({
  selectId: (reservation) => reservation._id,
});

export const selectSearchText = ({ reservationsApp }) => reservationsApp.reservations.searchText;

export const { selectAll: selectReservations, selectById: selectReservationsById } =
reservationsAdapter.getSelectors((state) => state.reservationsApp.reservations);

export const selectFilteredContacts = createSelector(
  [selectReservations, selectSearchText],
  (reservations, searchText) => {
    if (searchText.length === 0) {
      return reservations;
    }
    return FuseUtils.filterArrayByString(reservations, searchText);
  }
);

export const selectGroupedFilteredContacts = createSelector(
  [selectFilteredContacts],
  (reservations) => {
    if (!reservations) {
      return {}; 
    }

    return reservations;
    
  }
);



const reservationsSlice = createSlice({
  name: 'reservationsApp/reservations',
  initialState: reservationsAdapter.getInitialState({
    searchText: '',
  }),
  reducers: {
    setReservationsSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: {
    [updateReservation.fulfilled]: reservationsAdapter.upsertOne,
    [addReservation.fulfilled]: reservationsAdapter.addOne,
    [removeReservation.fulfilled]: (state, action) => reservationsAdapter.removeOne(state, action.payload),
    [getReservations.fulfilled]: (state, action) => {
      const { data, routeParams } = action.payload;
      reservationsAdapter.setAll(state, data);
      state.searchText = '';
    },
  },
});

export const { setReservationsSearchText } = reservationsSlice.actions;

export default reservationsSlice.reducer;
