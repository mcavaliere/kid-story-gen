import { motion } from 'framer-motion';
import { Skeleton } from './ui/skeleton';

export function StoryImageLoader() {
  return (
    <motion.div
      className="flex justify-center items-center space-x-4 mx-auto w-full"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
    >
      <Skeleton className="h-12 w-12 rounded-full" />
    </motion.div>
  );
}
