import _ from '@lodash';

const ContactModel = (data) =>
  _.defaults(data || {}, {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    shortcuts: ["apps.calendar"],
    photoURL: null,
    status: true,
    gender: 'Male',
    birthday: null,

    role: '',
    partner: '',
  });

export default ContactModel;

