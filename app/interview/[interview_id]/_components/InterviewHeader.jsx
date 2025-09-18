import Image from 'next/image'

function InterviewHeader() {
  return (
    <>
      <Image src={'/logo.png'} alt='logo' width={200} height={100}
        className="w-[140px] mb-2 drop-shadow-lg" />
      <h2 className="mt-2 text-lg font-semibold text-indigo-700 tracking-wide">AI-Powered Interview Platform</h2>
      <Image src={'/interview.png'} alt='interview'
        width={500}
        height={500}
        className="w-[220px] md:w-[280px] my-6 rounded-2xl shadow-lg border border-indigo-100" />
    </>
  )
}

export default InterviewHeader
