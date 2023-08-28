import { lazy } from 'react';

const ReservationApp = lazy(() => import('./ReservationApp'));

const ReservationAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'apps/reservation',
      element: <ReservationApp />,
    },
  ],
};

export default ReservationAppConfig;
