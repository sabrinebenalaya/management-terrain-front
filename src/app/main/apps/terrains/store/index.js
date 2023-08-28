import { combineReducers } from '@reduxjs/toolkit';

import terrains from './terrainsSlice';
import terrain from './terrainSlice';

const reducer = combineReducers({
 
  terrains,
  terrain,
});

export default reducer;
