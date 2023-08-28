import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { selectUser } from 'app/store/userSlice';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

import FormTab from '../tab/FormTab';
import PhotoTab from '../tab/PhotoTab';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
    '& > .container': {
      maxWidth: '100%',
    },
  },
}));

function TerrainForm(props) {
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  const partner = useSelector(selectUser);

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  return (
    <Root
      header={
        <div className="flex flex-col">
          <div className="flex flex-col flex-auto">
            <IconButton
              className="absolute top-0 right-0 my-16 mx-32 z-10"
              sx={{ color: 'white' }}
              component={NavLinkAdapter}
              to="/apps/terrain"
              size="large"
            >
              <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
            </IconButton>

            <Box
              className="relative w-64 sm:w-full h-10 sm:h-192 px-32 sm:px-48 flex items-center justify-center"
              sx={{ backgroundColor: 'background.default' }}
            >
              <h2 style={{ fontSize: '32px' }}>
                {routeParams.id === 'new' ? 'Add a new terrain' : 'Edit your terrain'}
              </h2>
            </Box>
          </div>

          <div className="flex flex-col flex-0 lg:flex-row items-center max-w-5xl w-full mx-auto px-32 lg:h-72">
            <div className="flex flex-1 justify-end my-16 lg:my-0">
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="inherit"
                variant="scrollable"
                scrollButtons={false}
                className="-mx-4 min-h-40"
                classes={{
                  indicator: 'flex justify-center bg-transparent w-full h-full',
                }}
                TabIndicatorProps={{
                  children: (
                    <Box
                      sx={{ bgcolor: 'text.disabled' }}
                      className="w-full h-full rounded-full opacity-20"
                    />
                  ),
                }}
              >
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="Terrain"
                />
                <Tab
                  className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
                  disableRipple
                  label="Photo"
                />
              </Tabs>
            </div>
          </div>
        </div>
      }
      content={
        <div className="flex flex-auto justify-center w-full max-w-5xl mx-auto p-24 sm:p-32">
          {selectedTab === 0 && <FormTab />}
          {selectedTab === 1 && <PhotoTab />}
        </div>
      }
      scroll={isMobile ? 'normal' : 'page'}
    />
  );
}

export default TerrainForm;
