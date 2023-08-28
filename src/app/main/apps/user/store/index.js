import { combineReducers } from '@reduxjs/toolkit';
import contacts from './contactsSlice';
import contact from './contactSlice';

const reducer = combineReducers({

  contacts,
  contact,
});

export default reducer;
