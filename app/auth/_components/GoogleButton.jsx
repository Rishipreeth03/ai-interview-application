import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'

export default function GoogleButton({ onClick }) {
  return (
    <Button
      className="w-full bg-white text-black hover:bg-gray-100 shadow-lg flex items-center justify-center gap-2 text-base font-medium transition-all duration-300"
      onClick={onClick}
    >
      <FcGoogle size={20} />
      Login with Google
    </Button>
  )
}
