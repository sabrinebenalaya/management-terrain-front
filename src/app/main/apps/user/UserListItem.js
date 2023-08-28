import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';

function UserListItem(props) {
  const { contact } = props;
  const user = contact ?? {}; 
  return (
    <> 
      <ListItem
        className="px-32 py-16"
        sx={{ bgcolor: 'background.paper' }}
        button
        component={NavLinkAdapter}
        to={`/apps/user/${user._id}`}
      >
        <ListItemAvatar>
          <Avatar alt={user.firstName} src={user.photoURL} />
        </ListItemAvatar>
        <ListItemText
          classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
          primary={user.firstName}
          secondary={
           
              <Typography
                className="inline"
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {user.email}
              </Typography>
           
          }
        />
      </ListItem>
      <Divider />
    </>
  );
}

export default UserListItem;
