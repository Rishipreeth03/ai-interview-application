'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'

import useApplicationForm from './_components/useApplicationForm'
import ApplicationFormHeader from './_components/ApplicationFormHeader'
import JobDescriptionSection from './_components/JobDescriptionSection'
import NameField from './_components/NameField'
import EmailField from './_components/EmailField'
import ConsentSection from './_components/ConsentSection'
import FormSubmitButton from './_components/FormSubmitButton'
import ErrorState from './_components/ErrorState'
import LoadingState from './_components/LoadingState'

export default function ApplicationFormPage() {
  const {
    interviewData,
    position,
    isLoading,
    error,
    alreadyApplied,
    isSubmitting,
    name,
    setName,
    email,
    setEmail,
    consent,
    setConsent,
    errors,
    fieldTouched,
    handleBlur,
    handleSubmit,
  } = useApplicationForm()

  if (isLoading) return <LoadingState />
  if (error || alreadyApplied) return <ErrorState error={error} alreadyApplied={alreadyApplied} onViewStatus={() => window.location.href = '/application-success'} />

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-3xl bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <ApplicationFormHeader interviewData={interviewData} position={position} />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <JobDescriptionSection interviewData={interviewData} position={position} />
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Candidate Information</h3>
              <div className="space-y-4">
                <NameField name={name} setName={setName} error={errors.name} touched={fieldTouched.name} onBlur={() => handleBlur('name')} />
                <EmailField email={email} setEmail={setEmail} error={errors.email} touched={fieldTouched.email} onBlur={() => handleBlur('email')} />
              </div>
            </div>
            <ConsentSection consent={consent} setConsent={setConsent} error={errors.consent} />
          </div>
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
              <p className="text-sm text-red-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Please correct the errors above before submitting.
              </p>
            </div>
          )}
          <div className="pt-4 border-t">
            <FormSubmitButton isSubmitting={isSubmitting} hasErrors={Object.keys(errors).length > 0} />
            <p className="text-xs text-gray-500 text-center mt-3">
              By submitting this application, you confirm that all information provided is accurate.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}