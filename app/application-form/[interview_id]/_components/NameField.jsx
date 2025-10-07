'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NameField({ name, setName, error, touched, onBlur }) {
  return (
    <div>
      <Label htmlFor="name" className="text-gray-700">
        Full Name <span className="text-red-600">*</span>
      </Label>
      <div className="relative">
        <Input 
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={onBlur}
          className={`mt-1 pr-8 ${error ? 'border-red-500 focus:ring-red-500' : touched && !error ? 'border-green-500' : ''}`}
          placeholder="Enter your full name"
          autoComplete="name"
          required
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? "name-error" : undefined}
        />
        {touched && !error && (
          <span className="absolute right-2 top-1/2 -translate-y-1/4 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </div>
      {error && (
        <p id="name-error" className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
}
