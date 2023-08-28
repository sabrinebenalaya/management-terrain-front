import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import { Box } from '@mui/system';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';

function TerrainItem(props) {
  const { terrain } = props;
  const terrainItem = terrain ?? {};
  return (
    <>
      <Card
        component={NavLinkAdapter}
        to={`/apps/terrain/${terrainItem._id}`}
        role="button"
        className="flex flex-col items-start w-full h-full p-24 rounded-lg shadow rounded-lg hover:shadow-xl transition-shadow duration-150 ease-in-out"
      >
        <div className="flex flex-col flex-auto justify-start items-start w-full">
          <Box
            sx={{
              backgroundColor: 'secondary.light',
              color: 'secondary.dark',
            }}
            className="flex items-center justify-center"
            style={{ width: '100%' }}
          >
            {terrainItem.photo && terrainItem.photo[0] && (
              <img
                alt="member"
                src={`http://localhost:5000/terrains/${terrainItem.photo[0]}`}
                style={{ width: '100%' }}
              />
            )}
          </Box>

          <Typography
            className="mt-20 text-lg font-bold leading-5"
            color="textPrimary"
            sx={{ fontWeight: 'bold', color: 'black' }}
          >
            {terrainItem.name}
          </Typography>

          <Typography className="mt-2 line-clamp-2 text-secondary" color="text.secondary">
            {terrainItem.description}
          </Typography>

          <Divider className="w-48 mt-24 h-2" />
        </div>

        <div className="flex items-center mt-24 text-md font-md">
          <Typography color="text.secondary">Surface:</Typography>
          <Typography className="mx-4 text-lg font-normal	 leading-5 	">
            {terrainItem.surface}
          </Typography>
        </div>

        <div className="flex items-center mt-24 text-md font-md">
          <Typography color="text.secondary">Price:</Typography>
          <Typography className="mx-4 mx-4 text-lg font-normal	 leading-5 ">
            {terrainItem.price} DNT
          </Typography>
        </div>

        <div className="flex items-center mt-24 text-md font-md">
          <Typography color="text.secondary">Adress:</Typography>
          <Typography className="mx-4 truncate">
            {terrainItem.address?.city}, {terrainItem.address?.governorate},
            {terrainItem.address?.country}, {terrainItem.address?.postalCode}
          </Typography>
        </div>
      </Card>

      <Divider />
    </>
  );
}

export default TerrainItem;
