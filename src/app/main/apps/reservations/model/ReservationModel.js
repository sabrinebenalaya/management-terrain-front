import _ from '@lodash';

const ReservationModel = (data) =>
  _.defaults(data || {}, {
    terrain: '',
    partner: '',
    phone: ' ',
    date: '',
    timeSlot: '',
    confirmation: false,
  });

export default ReservationModel;


   