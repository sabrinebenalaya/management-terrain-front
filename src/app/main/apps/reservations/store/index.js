import { combineReducers } from '@reduxjs/toolkit';
import reservations from './reservationsSlice';
import reservation from './reservationSlice';

const reducer = combineReducers({

  reservations,
  reservation,
});

export default reducer;
