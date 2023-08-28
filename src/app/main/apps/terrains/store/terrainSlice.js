import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import { toast } from 'react-toastify';
import TerrainModel from '../model/TerrainModel';

export const getTerrain = createAsyncThunk(
  'terrainsApp/terrains/getTerrain',
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.get(`http://localhost:5000/terrains/getTerrain/${id}`);

      const data = await response.data;

      return data;
    } catch (error) {
      history.push({ pathname: `apps/terrain` });

      return null;
    }
  }
);

export const addTerrain = createAsyncThunk(
  'terrainsApp/terrains/addTerrain',
  async (terrain, { dispatch, getState }) => {
    try {
      const response = await axios.post('http://localhost:5000/terrains/add', terrain);

      if (response && response.status === 200) {
        toast('Terrain added successfully ✅');
      }
      const data = await response.data.terrain;
      return data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Terrain already exists, you should add another one 😜');
      } else {
        toast.error('An error occurred while adding the terrain');
      }

      throw error;
    }
  }
);

export const updateTerrain = createAsyncThunk(
  'terrainsApp/terrains/updateTerrain',
  async (terrain, { dispatch, getState }) => {
    const response = await axios.put(
      `http://localhost:5000/terrains/update/${terrain._id}`,
      terrain
    );
    const data = await response.data;

    return data;
  }
);

export const updateTerrainPhoto = createAsyncThunk(
  'terrainsApp/terrains/updateTerrainPhoto',
  async ({ urlPhoto, id }, { dispatch, getState }) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.put(`http://localhost:5000/terrains/updatePhoto/${id}`, {
        image: urlPhoto,
      });
      const { data } = response;
      return data;
    } catch (error) {
      throw error;
    }
  }
);

export const removeTerrain = createAsyncThunk(
  'terrainsApp/terrains/removeTerrain',
  async (id, { dispatch, getState }) => {
    const response = await axios.delete(`http://localhost:5000/terrains/delete/${id}`);

    await response.data;

    return id;
  }
);

export const selectTerrain = ({ terrainsApp }) => terrainsApp.terrain;

const terrainSlice = createSlice({
  name: 'terrainsApp/terrain',
  initialState: null,
  reducers: {
    newTerrain: (state, action) => TerrainModel(),
    resetTerrain: () => null,
  },
  extraReducers: {
    [getTerrain.pending]: (state, action) => null,
    [getTerrain.fulfilled]: (state, action) => action.payload,
    [updateTerrain.fulfilled]: (state, action) => action.payload,
    [removeTerrain.fulfilled]: (state, action) => null,
  },
});

export const { resetTerrain, newTerrain } = terrainSlice.actions;

export default terrainSlice.reducer;
