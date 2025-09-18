"use client"
import React from 'react'
import AllInterviewsHeader from './_components/AllInterviewsHeader'
import NoInterviewsFound from './_components/NoInterviewsFound'
import InterviewGrid from './_components/InterviewGrid'
import useAllInterviewsPage from './_components/useAllInterviewsPage'
import { motion, AnimatePresence } from "framer-motion"

export default function AllInterviews() {
    const {
        interviewList,
        router,
        handleAddInterview,
    } = useAllInterviewsPage()

    return (
        <motion.div
            className='my-5'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <AllInterviewsHeader />
                </motion.div>
            </AnimatePresence>
            {interviewList?.length === 0 ? (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.4 }}
                    >
                        <NoInterviewsFound handleAddInterview={handleAddInterview} />
                    </motion.div>
                </AnimatePresence>
            ) : (
                <InterviewGrid interviewList={interviewList} />
            )}
        </motion.div>
    )
}