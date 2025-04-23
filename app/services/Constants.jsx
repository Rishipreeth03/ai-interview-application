import { BriefcaseBusinessIcon, Calendar, Code2Icon, LayoutDashboard, List, PuzzleIcon, Settings, User2Icon, WalletCards } from "lucide-react";

export const SideBarOptions=[
    {
        name:"DashBoard",
        icon:LayoutDashboard,
        path:'/dashboard'
    },
    {
        name:"Schedule Interview",
        icon:Calendar,
        path:'/schedule-interview'
    },
    {
        name:"All Interview",
        icon:List,
        path:'/all-interview'
    },
    {
        name:"Billing",
        icon:WalletCards,
        path:'/billing'
    },
    {
        name:"Settings",
        icon:Settings,
        path:'/settings'
    }
]
export const InterviewType=[
    {
        title:'Technical',
        icon : Code2Icon
    },
    {
        title:'Behavioral',
        icon: User2Icon
    },
    {
        title:'Expereince',
        icon: BriefcaseBusinessIcon
    },
    {
        title: 'Problem Solving',
        icon: PuzzleIcon
    }
]