import _ from '@lodash';

const TerrainModel = (data) =>
  _.defaults(data || {}, {
    name: '',
    description: '',
    surface: '',
    price: '',
    photo: '',
    address: {
      city: '',
      governorate: '',
      country: '',
      postalCode: '',
    },
    partner: [''],
  });

export default TerrainModel;
