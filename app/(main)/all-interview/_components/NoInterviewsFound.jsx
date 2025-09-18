import { Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function NoInterviewsFound({ handleAddInterview }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className='flex flex-col justify-center items-center mt-5 gap-2'
        >
            <Video className='text-primary rounded-lg p-2 h-11 w-11' />
            <h1>No Interviews Found</h1>
            <Button className='bg-primary' onClick={handleAddInterview}>
                + Add Interview
            </Button>
        </motion.div>
    )
}
