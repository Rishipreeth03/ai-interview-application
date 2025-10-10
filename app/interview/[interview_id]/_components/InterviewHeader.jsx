import Image from 'next/image'
import { motion } from 'framer-motion'

function InterviewHeader() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image 
          src={'/logo.png'} 
          alt='logo' 
          width={200} 
          height={100}
          className="w-[160px] mb-2 drop-shadow-xl" 
        />
      </motion.div>
      
      <motion.h2 
        className="mt-2 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        AI-Powered Interview Platform
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0, 0.71, 0.2, 1.01] }}
      >
        <Image 
          src={'/interview.png'} 
          alt='interview'
          width={500}
          height={500}
          className="w-[240px] md:w-[300px] my-8 rounded-3xl shadow-xl border border-indigo-100/50 hover:shadow-indigo-100/30 transition-all duration-300" 
        />
      </motion.div>
    </>
  )
}

export default InterviewHeader
