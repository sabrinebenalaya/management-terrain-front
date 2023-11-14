import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import InputAdornment from '@mui/material/InputAdornment';

import { selectUser } from 'app/store/userSlice';
import { TextField } from '@mui/material';
import {
  addTerrain,
  getTerrain,
  newTerrain,
  removeTerrain,
  selectTerrain,
  updateTerrain,
} from '../store/terrainSlice';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  name: yup.string().required('You must enter the name of terrain'),
  description: yup.string().required('You must enter the description of the terrain'),
  price: yup.number().positive('Price must be a positive number').required('Price is required'),
  surface: yup.number().positive('Surface must be a positive number').required('Price is required'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  postalCode: yup
    .string()
    .required('Postal code is required')
    .matches(/^\d+$/, 'Postal code must contain only digits')
    .min(4, 'Postal code must be at least 4 digits'),
  governorate: yup.string().required('Governorate is required'),
});

function FormTab(props) {
  const terrain = useSelector(selectTerrain);

  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { control, watch, reset, handleSubmit, formState, getValues } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  useEffect(() => {
    if (routeParams.id === 'new') {
      dispatch(newTerrain());
    } else {
      dispatch(getTerrain(routeParams.id));
    }
  }, [dispatch, routeParams]);
  const partner = useSelector(selectUser);

  useEffect(() => {
    reset({ ...terrain });
  }, [terrain, reset]);
  async function add(data) {
    if (routeParams.id === 'new') {
      try {
        data.partner = partner._id;
        const address = {
          city: data.city,
          governorate: data.governorate,
          country: data.country,
          postalCode: data.postalCode,
        };

        data.address = address;
        const terrainAdded = await dispatch(addTerrain(data));
        navigate(`/apps/terrain/${terrainAdded._id}`);
      } catch (error) {
        console.error("Une erreur s'est produite lors de l'ajout du contact:", error);
      }
    } else {
      dispatch(updateTerrain(data)).then(() => {
        navigate('/apps/terrain');
      });
    }
  }

  function handleRemoveContact() {
    dispatch(removeTerrain(terrain._id)).then(() => {
      navigate('/apps/terrain');
    });
  }

  if (_.isEmpty(form) || !terrain) {
    return <FuseLoading />;
  }
  return (
    <div>
      <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Name"
              placeholder={terrain.name || ''}
              id="name"
              error={!!errors.name}
              helperText={errors?.name?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:bookmark</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextField
              className="mt-32"
              {...field}
              label="Description"
              placeholder={terrain.description || ''}
              id="description"
              error={!!errors.description}
              helperText={errors?.description?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:information-circle</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <TextField
              {...field}
              label="Price"
              placeholder={terrain.price !== undefined ? terrain.price.toString() : ''}
              variant="outlined"
              className="mt-32"
              fullWidth
              error={!!errors.price}
              helperText={errors?.price?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:currency-dollar</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="surface"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-32"
              placeholder={terrain.surface !== undefined ? terrain.surface.toString() : ''}
              label="Surface"
              type="Surface"
              error={!!errors.surface}
              helperText={errors?.surface?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:library</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-32"
              label="city"
              placeholder={terrain.address?.city || ''}
              error={!!errors.city}
              helperText={errors?.city?.message}
              variant="outlined"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:location-marker</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="governorate"
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-32"
              label="Governorate"
              placeholder={terrain.address?.governorate || ''}
              variant="outlined"
              fullWidth
              error={!!errors.governorate}
              helperText={errors?.governorate?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:location-marker</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="country"
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-32"
              label="Country"
              variant="outlined"
              placeholder={terrain.address?.country || ''}
              fullWidth
              error={!!errors.country}
              helperText={errors?.country?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:location-marker</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="postalCode"
          render={({ field }) => (
            <TextField
              {...field}
              className="mt-32"
              label="PostalCode"
              placeholder={
                terrain.address?.postalCode !== undefined
                  ? terrain.address?.postalCode.toString()
                  : ''
              }
              variant="outlined"
              fullWidth
              error={!!errors.postalCode}
              helperText={errors?.postalCode?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FuseSvgIcon size={20}>heroicons-solid:location-marker</FuseSvgIcon>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      </div>
      <Box
        className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
        sx={{ backgroundColor: 'background.default' }}
      >
        {routeParams.id !== 'new' && (
          <Button color="error" onClick={handleRemoveContact}>
            Delete
          </Button> 
        )}
        <Button className="ml-auto" component={NavLinkAdapter} to={-1}>
          Cancel
        </Button>
        <Button className="ml-8" variant="contained" color="secondary" onClick={handleSubmit(add)}>
          Save
        </Button>
      </Box>
    </div>
  );
}

export default FormTab;
