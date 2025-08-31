'use client'
import React from 'react'
import Link from 'next/link'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from '@/components/ui/button'
import { Plus, LogOut } from 'lucide-react'
import { SideBarOptions } from '@/app/services/Constants'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/app/services/supaBaseclient'

function AppSidebar() {
  const path = usePathname()
  const router = useRouter()

  const handleCreateInterview = () => {
    router.push('/dashboard/create-interview')
  }

  const handleLogout = async () => {
    // Logout from supabase session
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <Sidebar className='w-[240px] flex flex-col'>
      <SidebarHeader className='flex flex-col items-center gap-2 py-4'>
        <Image src="/logo.png" alt="Logo" height={60} width={120} />
        <Button
          className='w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold'
          aria-label="Create New Interview"
          onClick={handleCreateInterview}
        >
          <Plus /> Create New Interview
        </Button>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {SideBarOptions.map((option, index) => {
                const isActive = option.path === path
                return (
                  <SidebarMenuItem key={index} className='p-1'>
                    <SidebarMenuButton asChild
                      className={`p-3 flex items-center gap-3 rounded transition-colors
                        ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 hover:text-blue-700'}
                      `}
                      aria-label={option.name}
                    >
                      <Link href={option.path}>
                        <option.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-700'}`} />
                        <span className={`text-[16px] font-medium ${isActive ? 'text-white' : 'text-gray-800'}`}>
                          {option.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col items-center py-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-red-600"
          aria-label="Logout"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar


