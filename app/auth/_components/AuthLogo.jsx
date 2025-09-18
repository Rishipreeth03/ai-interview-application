import Image from 'next/image'

export default function AuthLogo() {
  return (
    <div className="flex justify-center">
      <Image src="/logow.png" alt="logo" width={300} height={40} className="object-contain h-[150px] drop-shadow-lg" />
    </div>
  )
}
