import Image from 'next/image'

export default function AuthIllustration() {
  return (
    <div className="flex justify-center">
      <Image src="/login.webp" alt="login" width={200} height={120} className="rounded-xl shadow-md border-2 border-white/30" />
    </div>
  )
}
