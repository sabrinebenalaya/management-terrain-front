import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { addTerrain, removeTerrain, updateTerrain } from './terrainSlice';

export const getTerrains = createAsyncThunk(
  'terrainsApp/terrains/getTerrains',
  async (id, { getState }) => {
    const response = await axios.get(`http://localhost:5000/terrains/getTerrains/${id}`);
    const data = await response.data;
    return { data };
  }
);

const terrainsAdapter = createEntityAdapter({
  selectId: (terrain) => terrain._id,
});

export const { selectAll: selectTerrains, selectById: selectTerrainsById } =
  terrainsAdapter.getSelectors((state) => state.terrainsApp.terrains);

export const selectALLTerrains = createSelector([selectTerrains], (terrains) => {
  if (!terrains) {
    return {};
  }

  return terrains;
});

const terrainsSlice = createSlice({
  name: 'terrainsApp/terrains',
  initialState: terrainsAdapter.getInitialState({}),
  reducers: {},
  extraReducers: {
    [updateTerrain.fulfilled]: terrainsAdapter.upsertOne,
    [addTerrain.fulfilled]: terrainsAdapter.addOne,
    [removeTerrain.fulfilled]: (state, action) => terrainsAdapter.removeOne(state, action.payload),
    [getTerrains.fulfilled]: (state, action) => {
      const { data } = action.payload;
      terrainsAdapter.setAll(state, data);
    },
  },
});

export default terrainsSlice.reducer;
