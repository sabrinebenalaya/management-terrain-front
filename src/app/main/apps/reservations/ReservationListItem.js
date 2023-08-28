import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';

function ReservationListItem(props) {
  const { reservation } = props;
  const user = reservation ?? {}; 
  return (
    <> 
      <ListItem
        className="px-32 py-16"
        sx={{ bgcolor: 'background.paper' }}
        button
        component={NavLinkAdapter}
        to={`/apps/user/${user._id}`}
      >
       
        <ListItemText
          classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
          primary={user.phone}
          secondary={
           
              <Typography
                className="inline"
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {user.timeSlot}
              </Typography>
           
          }
        />
      </ListItem>
      <Divider />
    </>
  );
}

export default ReservationListItem;
