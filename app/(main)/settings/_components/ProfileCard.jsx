import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { 
  User, Mail, Calendar, Clock, CheckCircle, XCircle,
  CreditCard, Award, AlertCircle, Save, Loader2
} from "lucide-react"
import moment from "moment"

export default function ProfileCard({ userData = {}, loading, saving, onUpdateProfile }) {
  const [firstName, setFirstName] = useState(userData?.firstName || "")
  const [lastName, setLastName] = useState(userData?.lastName || "")
  const [isEditing, setIsEditing] = useState(false)
  
  // Update local state when userData changes
  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "")
      setLastName(userData.lastName || "")
    }
  }, [userData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdateProfile({ firstName, lastName })
    setIsEditing(false)
  }

  const getAccountStatusColor = (status = 'unknown') => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600';
      case 'suspended': return 'text-amber-600';
      case 'deactivated': return 'text-red-600';
      case 'locked': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  }

  const getRoleColor = (role = 'user') => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  if (loading) {
    return (
      <section className="bg-white rounded-2xl shadow-lg p-8 mb-6 flex flex-col items-center">
        <div className="flex items-center justify-center w-full h-40">
          <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
          <span className="ml-3 text-lg text-gray-500">Loading profile data...</span>
        </div>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-white rounded-2xl shadow-lg p-8 mb-2">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            {userData?.picture ? (
              <Image 
                src={userData.picture} 
                alt="Profile" 
                width={80} 
                height={80}
                className="rounded-full border-2 border-indigo-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            
            <span className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white ${
              userData?.accountStatus === 'active' ? 'bg-green-500' : 'bg-gray-500'
            }`}></span>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {(userData?.firstName || userData?.lastName) ? 
                `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() : 
                "Your Profile"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-md ${getRoleColor(userData?.userRole)}`}>
                {userData?.userRole ? (userData.userRole.charAt(0).toUpperCase() + userData.userRole.slice(1)) : 'User'}
              </span>
              
              <span className="text-sm text-gray-500">•</span>
              
              <span className={`flex items-center text-sm ${getAccountStatusColor(userData?.accountStatus)}`}>
                {userData?.accountStatus === 'active' ? (
                  <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                ) : (
                  <><AlertCircle className="w-3 h-3 mr-1" /> {userData?.accountStatus ? 
                    (userData.accountStatus.charAt(0).toUpperCase() + userData.accountStatus.slice(1)) : 'Unknown'}</>
                )}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing}
                className={`rounded-xl ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                placeholder="First Name"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditing}
                className={`rounded-xl ${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                placeholder="Last Name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="flex items-center">
                <Input
                  id="email"
                  value={userData?.email || ''}
                  type="email"
                  disabled
                  className="rounded-xl bg-gray-50"
                  placeholder="Email"
                />
                <div className="ml-2">
                  {userData?.emailVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-500" title="Email verified" />
                  ) : (
                    <XCircle className="w-5 h-5 text-amber-500" title="Email not verified" />
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
                Available Credits
              </label>
              <div className="relative">
                <Input
                  id="credits"
                  value={userData?.credits || 0}
                  disabled
                  className="rounded-xl bg-gray-50 pl-9"
                  placeholder="Credits"
                />
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-500" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            {!isEditing ? (
              <Button 
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false)
                    setFirstName(userData.firstName || "")
                    setLastName(userData.lastName || "")
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </section>

      <section className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-indigo-500 mr-2" />
            <div>
              <div className="text-sm text-gray-500">Account created</div>
              <div className="font-medium">
                {userData?.createdAt ? moment(userData.createdAt).format('MMMM D, YYYY') : 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-indigo-500 mr-2" />
            <div>
              <div className="text-sm text-gray-500">Last login</div>
              <div className="font-medium">
                {userData?.lastLogin ? moment(userData.lastLogin).format('MMMM D, YYYY, h:mm a') : 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Award className="w-5 h-5 text-indigo-500 mr-2" />
            <div>
              <div className="text-sm text-gray-500">Role</div>
              <div className="font-medium capitalize">{userData?.userRole || 'user'}</div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-indigo-500 mr-2" />
            <div>
              <div className="text-sm text-gray-500">Login count</div>
              <div className="font-medium">{userData?.loginCount || 0} logins</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
