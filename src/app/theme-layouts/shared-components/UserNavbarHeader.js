import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';

const Root = styled('div')(({ theme }) => ({
  '& .username, & .email': {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },

  '& .avatar': {
    background: theme.palette.background.default,
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    bottom: 0,
    '& > img': {
      borderRadius: '50%',
    },
  },
}));

function UserNavbarHeader(props) {
  const user = useSelector(selectUser);
  return (
    <Root className="user relative flex flex-col items-center justify-center p-16 pb-14 shadow-0">
      <div className="flex items-center justify-center mb-24">

      {user.photoURL && user.role[0] === 'admin' ? (
        <Avatar className="avatar text-32 font-bold w-96 h-96" alt="user photo" src={`http://localhost:5000/partners/${user.photoURL}`} />
      ) : user.photoURL && user.role[0] === 'staff' ? (
        <Avatar className="avatar text-32 font-bold w-96 h-96" alt="user photo" src={`http://localhost:5000/users/${user.photoURL}`} />
      ) : (
        <Avatar  sx={{
          backgroundColor: 'background.paper',
          color: 'text.secondary',
        }} className="avatar text-32 font-bold w-96 h-96">{user.firstName.charAt(0)}</Avatar>
      )}


       
      </div>
      <Typography className="username text-14 whitespace-nowrap font-medium">
        {user.firstName}
      </Typography>
        <Typography className="phone text-14 whitespace-nowrap font-medium">
        {user.phone}
      </Typography>
      <Typography className="email text-13 whitespace-nowrap font-medium" color="text.secondary">
        {user.email}
      </Typography>
    </Root>
  );
}

export default UserNavbarHeader;
