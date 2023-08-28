import FusePageSimple from '@fuse/core/FusePageSimple';
import withReducer from 'app/store/withReducer';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useDeepCompareEffect } from '@fuse/hooks';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import ContactsSidebarContent from './ContactsSidebarContent';
import ContactsHeader from './ContactsHeader';
import UsersList from './UsersList';
import reducer from './store';
import { getContacts, selectGroupedFilteredContacts } from './store/contactsSlice';
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
  },
}));

function UserApp(props) {
  const partner = useSelector(selectUser);


  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const routeParams = useParams();
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  useDeepCompareEffect(() => {
    dispatch(getContacts(partner._id));
   
  }, [dispatch]);

  useEffect(() => {
    setRightSidebarOpen(Boolean(routeParams.id));
  }, [routeParams]);
 
    return (
      <Root
        header={<ContactsHeader pageLayout={pageLayout} />}
        content={<UsersList />}
        ref={pageLayout}
        rightSidebarContent={<ContactsSidebarContent />}
        rightSidebarOpen={rightSidebarOpen}
        rightSidebarOnClose={() => setRightSidebarOpen(false)}
        rightSidebarWidth={640}
        scroll={isMobile ? 'normal' : 'content'}
      />
    );
  
}
export default withReducer('contactsApp', reducer)(UserApp);
