import TerrainForm from './terrain/TerrainForm';
import TerrainApp from './TerrainApp';
import TerrainView from './terrain/TerrainView';

const TerrainAppConfig = {
  settings: {
    layout: {},
  },

  routes: [
    {
      path: 'apps/terrain',
      element: <TerrainApp />,
      children: [
        {
          path: ':id',
          element: <TerrainView />,
        },
        {
          path: ':id/edit',
          element: <TerrainForm />,
        },
      ],
    },
  ],
};

export default TerrainAppConfig;
