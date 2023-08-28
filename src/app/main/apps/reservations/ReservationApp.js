import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

import { selectUser } from 'app/store/userSlice';
import reducer from './store';
import { getReservations, selectGroupedFilteredContacts} from './store/reservationsSlice';

import ContactsHeader from './ContactsHeader';
import ContactsSidebarContent from './ContactsSidebarContent';
import ReservationsList from './ReservationsList';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function ReservationApp(props) {
  const user = useSelector(selectUser);


  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  useDeepCompareEffect(() => {
    dispatch(getReservations(user._id));
   
  }, [dispatch]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);
 
    return (
      <Root
        header={<ContactsHeader pageLayout={pageLayout} />}
        content={<ReservationsList />}
        ref={pageLayout}
        rightSidebarContent={<ContactsSidebarContent />}
        rightSidebarOpen={rightSidebarOpen}
        rightSidebarOnClose={() => setRightSidebarOpen(false)}
        rightSidebarWidth={640}
        scroll={isMobile ? 'normal' : 'content'}
      />
    );
  
}
export default withReducer('reservationsApp', reducer)(ReservationApp);
