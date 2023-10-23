import { useState } from 'react';
import { orange } from '@mui/material/colors';
import { lighten, styled } from '@mui/material/styles';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { Controller, useForm } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectTerrain, updateTerrainPhoto } from '../store/terrainSlice';

const Root = styled('div')(({ theme }) => ({
  '& .productImageFeaturedStar': {
    position: 'absolute',
    top: 0,
    right: 0,
    color: orange[400],
    opacity: 0,
  },

  '& .productImageUpload': {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },

  '& .productImageItem': {
    transitionProperty: 'box-shadow',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    '&:hover': {
      '& .productImageFeaturedStar': {
        opacity: 0.8,
      },
    },
    '&.featured': {
      pointerEvents: 'none',
      boxShadow: theme.shadows[3],
      '& .productImageFeaturedStar': {
        opacity: 1,
      },
      '&:hover .productImageFeaturedStar': {
        opacity: 1,
      },
    },
  },
}));

function PhotoTab(props) {
  const { control, watch, reset, handleSubmit, formState, getValues } = useForm();
  const dispatch = useDispatch();
  const terrain = useSelector(selectTerrain);
  const navigate = useNavigate();
  const images = terrain.photo || [];
  const [urlPhoto, setUrlPhot] = useState([]);
  
  const handelChangePhotos = (newImages) => {
    setUrlPhot((prevPhotos) => [...prevPhotos, ...newImages.map((image) => image.url)]);
  };

  
  if (urlPhoto.length > 0) {
    dispatch(updateTerrainPhoto({ urlPhoto, id: terrain._id })).then(() => {
      navigate('/apps/terrain');
    });
  }


  return (
    <Root>
      <div className="flex justify-center sm:justify-start flex-wrap -mx-16">
        <Controller
          name="images"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Box
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              component="label"
              htmlFor="button-file"
              className="productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
            >
              <input
                accept="image/*"
                className="hidden"
                id="button-file"
                type="file"
                onChange={async (e) => {
                  function readFileAsync(file) {
                    return new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = () => {
                        resolve({
                          id: FuseUtils.generateGUID(),
                          url: `data:${file.type};base64,${btoa(reader.result)}`,
                          type: 'image',
                        });
                      };
                      reader.onerror = reject;
                      reader.readAsBinaryString(file);
                    }); 
                  }

                  const selectedFiles = e.target.files;
                  const newImages = [];

                  // eslint-disable-next-line no-restricted-syntax
                  for (const file of selectedFiles) {
                    // eslint-disable-next-line no-await-in-loop
                    const newImage = await readFileAsync(file);
                    newImages.push(newImage);
                  }

                  handelChangePhotos(newImages);
                }}
                multiple // Permet la sélection de plusieurs fichiers
              />
              <FuseSvgIcon size={32} color="action">
                heroicons-outline:upload
              </FuseSvgIcon>
            </Box>
          )}
        />
        <Controller
        name="featuredImageId"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) =>
          Array.isArray(terrain.photo) ? (
            terrain.photo.map((imageURL, index) => (
              <div
                onClick={() => onChange(index)}
                onKeyDown={() => onChange(index)}
                role="button"
                tabIndex={0}
                className={clsx(
                  'productImageItem flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer outline-none shadow hover:shadow-lg',
                  index === value && 'featured'
                )}
                key={index}
              >
                <FuseSvgIcon className="productImageFeaturedStar">heroicons-solid:star</FuseSvgIcon>
                <img
                  className="max-w-none w-auto h-full"
                  src={`http://localhost:5000/terrains/${imageURL}`}
                  alt={`product-${index}`}
                />
              </div>
            ))
          ) : null
        }
      />
      
      
      </div>
    </Root>
  );
}

export default PhotoTab;
