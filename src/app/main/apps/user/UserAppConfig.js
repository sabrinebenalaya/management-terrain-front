import { lazy } from 'react';
import UserView from './contact/UserView';
import ContactForm from './contact/ContactForm';
import UserApp from './UserApp';


const UserAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'apps/user',
      element: <UserApp/>,
      children: [
        {
          path: ':id',
          element: <UserView />,
        },
        {
          path: ':id/edit',
          element: <ContactForm />,
        },
      ],
    },
  ],
  
};

export default UserAppConfig;
