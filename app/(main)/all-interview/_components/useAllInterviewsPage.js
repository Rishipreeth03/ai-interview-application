import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/services/supaBaseclient'
import { useUser } from '@/app/provider'

function useAllInterviewsPage() {
    const router = useRouter()
    const [interviewList, setInterviewList] = useState([])
    const { user } = useUser()

    useEffect(() => {
        GetInterviewList()
        // eslint-disable-next-line
    }, [user])

    const GetInterviewList = async () => {
        let { data: Interviews, error } = await supabase
            .from("interviews")
            .select('*')
            .eq("userEmail", user?.email)
            .order('created_at', { ascending: false })
        setInterviewList(Interviews)
    }

    const handleAddInterview = () => {
        router.push('/dashboard/create-interview')
    }

    return {
        interviewList,
        router,
        handleAddInterview,
    }
}

export default useAllInterviewsPage
