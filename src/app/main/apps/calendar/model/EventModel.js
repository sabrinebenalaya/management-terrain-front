import _ from '@lodash';

const EventModel = (data) =>
  _.defaults(data || {}, {
    partner: '',
    terrain: '',
    start: new Date(),
    end: new Date(),
   phone: 0,
  });

export default EventModel;
