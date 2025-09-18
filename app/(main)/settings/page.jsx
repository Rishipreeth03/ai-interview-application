'use client'
import React from "react";
import { motion } from "framer-motion";
import SettingsHeader from "./_components/SettingsHeader";
import FeedbackAlert from "./_components/FeedbackAlert";
import useSettingsPage from "./_components/useSettingsPage";
import ProfileCard from "./_components/ProfileCard";

export default function SettingsPage() {
  const {
    name,
    email,
    loading,
    error,
    success,
  } = useSettingsPage();

  return (
    <motion.main
      className="max-w-xl mx-auto py-10 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <SettingsHeader />
      <FeedbackAlert error={error} success={success} />
      <ProfileCard name={name} email={email} loading={loading} />
    </motion.main>
  );
}