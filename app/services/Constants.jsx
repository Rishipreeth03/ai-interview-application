import { Calendar, LayoutDashboard, List, Settings, WalletCards } from "lucide-react";

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