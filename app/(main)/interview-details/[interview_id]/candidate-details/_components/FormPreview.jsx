import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function FormPreview({ 
  interviewData,
  interviewId,
  onSubmit,
  isSubmitting = false 
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [resume, setResume] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState({})
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Form validation
    const newErrors = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!phone.trim()) newErrors.phone = 'Phone number is required'
    if (!consent) newErrors.consent = 'You must provide consent to proceed'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // If validation passes
    await onSubmit({
      name,
      email,
      phone,
      resume,
      consent,
    })
  }
  
  return (
    <div className="mx-auto max-w-3xl bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center border-b border-gray-200 pb-4 mb-8">
        <div className="bg-blue-600 text-white p-2 rounded-lg mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {interviewData?.jobPosition || 'Interview'} Application
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Complete this form to apply for the position
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-700">
              Full Name <span className="text-red-600">*</span>
            </Label>
            <Input 
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`mt-1 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email" className="text-gray-700">
              Email Address <span className="text-red-600">*</span>
            </Label>
            <Input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-gray-700">
              Phone Number <span className="text-red-600">*</span>
            </Label>
            <Input 
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`mt-1 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="resume" className="text-gray-700">
              Resume/CV Link (Optional)
            </Label>
            <Input 
              id="resume"
              type="text"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              className="mt-1"
              placeholder="https://drive.google.com/your-resume"
            />
            <p className="text-xs text-gray-500 mt-1">
              Paste a link to your resume/CV (Google Drive, Dropbox, etc.)
            </p>
          </div>
          
          <div className="pt-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="consent" 
                checked={consent} 
                onCheckedChange={setConsent}
              />
              <Label 
                htmlFor="consent" 
                className={`text-sm ${errors.consent ? 'text-red-500' : 'text-gray-700'}`}
              >
                I consent to participate in this interview and allow my information to be processed
              </Label>
            </div>
            {errors.consent && (
              <p className="text-red-500 text-xs mt-1">{errors.consent}</p>
            )}
          </div>
        </div>
        
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 rounded-md transition-colors duration-300 shadow-md"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}