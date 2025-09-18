import { motion } from 'framer-motion'
import InterviewCard from '../../dashboard/_components/InterviewCard'

export default function InterviewGrid({ interviewList }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.08
                    }
                }
            }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5'
        >
            {interviewList.map((interview, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <InterviewCard interview={interview} />
                </motion.div>
            ))}
        </motion.div>
    )
}
