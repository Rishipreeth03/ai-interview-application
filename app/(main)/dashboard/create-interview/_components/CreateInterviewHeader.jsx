import { ArrowLeft } from 'lucide-react'

function CreateInterviewHeader({ router }) {
    return (
        <div className='flex gap-5 items-center mb-6'>
            <ArrowLeft onClick={() => router.back()} className='cursor-pointer hover:text-blue-600 transition' />
            <h2 className='font-bold text-2xl'>Create new Interview</h2>
        </div>
    )
}

export default CreateInterviewHeader
