'use client'
import React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import useInterviewSetup from "./_components/useInterviewSetup";
import Step from "./_components/Step";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewSetup() {
  const router = useRouter();
  const { interview_id } = useParams();
  const {
    steps,
    threats,
    handleContinue,
    audioVerified,
    fullscreenVerified,
    thirdPartyVerified,
    videoScreeningRequired,
    videoVerified,
  } = useInterviewSetup(interview_id, router);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 px-4 py-8"
      initial={{ opacity: 0, scale: 0.97, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        className="max-w-xl w-full bg-white/95 rounded-3xl shadow-2xl p-10 flex flex-col gap-10 items-center border border-indigo-100"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-2 shadow-lg mb-2">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-1 tracking-tight">Interview Environment Check</h1>
          <p className="text-gray-500 text-center text-base max-w-md">
            For a secure and smooth interview experience, please verify each step below.
          </p>
        </motion.div>
        <div className="flex w-full">
          {/* Vertical Progress Bar */}
          <motion.div
            className="flex flex-col items-center mr-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.08 }
              }
            }}
          >
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Step {...step} />
                </motion.div>
                {idx < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: 0.8 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`w-1 h-10 ${step.verified ? "bg-green-400" : step.error ? "bg-red-400" : "bg-gray-300"} rounded-full`}
                  />
                )}
              </React.Fragment>
            ))}
          </motion.div>
          {/* Step Actions */}
          <motion.div
            className="flex flex-col gap-8 justify-between flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {steps.map((step, idx) => (
              <Button
                key={idx}
                size="sm"
                variant="outline"
                onClick={step.action}
                disabled={step.verified}
                className={`mb-8 ${step.verified ? "border-green-500 text-green-600" : step.error ? "border-red-500 text-red-600" : "border-blue-500 text-blue-600"}`}
              >
                {step.verified ? "Verified" : step.error ? "Error" : "Check"}
              </Button>
            ))}
            {threats.length > 0 && (
              <motion.div
                className="mb-8 flex items-center gap-2 text-red-500 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ShieldAlert className="w-6 h-6" />
                {threats.join(", ")}
              </motion.div>
            )}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Button
            className="w-full mt-8 font-bold text-lg py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition-all duration-200"
            onClick={handleContinue}
            disabled={
              !audioVerified ||
              !fullscreenVerified ||
              !thirdPartyVerified ||
              threats.length > 0 ||
              (videoScreeningRequired && !videoVerified)
            }
          >
            Continue to Interview
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-xs text-gray-400 text-center"
        >
          Powered by Smart Hire AI &mdash; Your privacy and security are our priority.
        </motion.div>
      </motion.div>
    </motion.div>
  );
}