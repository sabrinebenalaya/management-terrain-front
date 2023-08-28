import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import { selectALLTerrains } from './store/terrainsSlice';

import TerrainItem from './TerrainItem';
import NewTerrainItem from './NewTerrainItem';

const containerVariants = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function TerrainsList(props) {
  const groupedFilteredContacts = useSelector(selectALLTerrains);
  if (!groupedFilteredContacts) {
    return null;
  }

  return (
    <div className="flex grow shrink-0 flex-col items-center container p-24 sm:p-40">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }}>
        <Typography className="mt-16 md:mt-96 text-3xl md:text-6xl font-extrabold tracking-tight leading-7 sm:leading-10 text-center">
          My Terrains
        </Typography>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mt-32 md:mt-64"
      >
        {groupedFilteredContacts.length === 0 ? (
          <motion.div variants={itemVariants} className="min-w-full sm:min-w-224 min-h-360">
            <NewTerrainItem />
          </motion.div>
        ) : (
          <>
            {groupedFilteredContacts.map((board) => (
              <motion.div
                variants={itemVariants}
                className="min-w-full sm:min-w-224 min-h-360"
                key={board._id}
              >
                <TerrainItem key={board._id} terrain={board} />
              </motion.div>
            ))}
            <NewTerrainItem />
          </>
        )}
      </motion.div>
    </div>
  );
}

export default TerrainsList;
