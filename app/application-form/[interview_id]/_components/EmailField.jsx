'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function EmailField({ email, setEmail, error, touched, onBlur }) {
  return (
    <div>
      <Label htmlFor="email" className="text-gray-700">
        Email Address <span className="text-red-600">*</span>
      </Label>
      <div className="relative">
        <Input 
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={onBlur}
          className={`mt-1 pr-8 ${error ? 'border-red-500 focus:ring-red-500' : touched && !error ? 'border-green-500' : ''}`}
          placeholder="you@example.com"
          autoComplete="email"
          required
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? "email-error" : "email-help"}
          list="email-suggestions"
        />
        <datalist id="email-suggestions">
          {email.includes('@') ? null : (
            <>
              <option value={`${email.split('@')[0]}@gmail.com`} />
              <option value={`${email.split('@')[0]}@outlook.com`} />
              <option value={`${email.split('@')[0]}@yahoo.com`} />
              <option value={`${email.split('@')[0]}@hotmail.com`} />
            </>
          )}
        </datalist>
        {touched && !error && (
          <span className="absolute right-2 top-1/2 -translate-y-1/4 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>
      {error && (
        <p id="email-error" className="text-red-500 text-xs mt-1">{error}</p>
      )}
      <p id="email-help" className="text-xs text-gray-500 mt-1">
        We'll use this email to send you the interview link and updates about your application.
      </p>
    </div>
  )
}
