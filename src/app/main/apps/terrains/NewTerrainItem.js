import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';

function NewTerrainItem() {
  return (
    <Link to="new/edit" style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          borderColor: 'divider',
        }}
        className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer border-2 border-gray-300 border-dashed hover:bg-hover transition-colors duration-150 ease-in-out"
        role="button"
        tabIndex={0}
      >
        <FuseSvgIcon size={48} color="disabled">
          heroicons-outline:plus
        </FuseSvgIcon>
      </Box>
    </Link>
  );
}

export default NewTerrainItem;
