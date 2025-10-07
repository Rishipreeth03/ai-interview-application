'use client'
import React from "react";
import { motion } from "framer-motion";
import SettingsHeader from "./_components/SettingsHeader";
import FeedbackAlert from "./_components/FeedbackAlert";
import useSettingsPage from "./_components/useSettingsPage";
import ProfileCard from "./_components/ProfileCard";

export default function SettingsPage() {
  const {
    userData,
    loading,
    error,
    success,
    saving,
    updateProfile
  } = useSettingsPage();

  return (
    <motion.main
      className="max-w-3xl mx-auto py-10 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <SettingsHeader />
      <FeedbackAlert error={error} success={success} />
      <ProfileCard 
        userData={userData}
        loading={loading}
        saving={saving}
        onUpdateProfile={updateProfile}
      />
    </motion.main>
  );
}