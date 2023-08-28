import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import { selectUser } from 'app/store/userSlice';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

import TerrainsList from './TerrainsList';
import reducer from './store';
import { getTerrains } from './store/terrainsSlice';
import TerrainForm from './terrain/TerrainForm';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function TerrainApp(props) {
  const dispatch = useDispatch();
  const partner = useSelector(selectUser);
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  useDeepCompareEffect(() => {
    dispatch(getTerrains(partner._id));
  }, [dispatch]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);

  return (
    <Root
      content={routeParams.id === undefined ? <TerrainsList /> : <TerrainForm />}
      ref={pageLayout}
      rightSidebarOpen={rightSidebarOpen}
      rightSidebarOnClose={() => setRightSidebarOpen(false)}
      rightSidebarWidth={640}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}
export default withReducer('terrainsApp', reducer)(TerrainApp);
