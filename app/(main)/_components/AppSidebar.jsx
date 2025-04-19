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
import { Plus } from 'lucide-react'
import { SideBarOptions } from '@/app/services/Constants'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
function AppSidebar() {
  const path = usePathname();


  return (
    <Sidebar className='w-[240px]'>
      <SidebarHeader className='flex items-center justify-between'>
        <Image src="/logo.png" alt="Logo" height={90} width={150} />
        <Button className='w-full p-5'><Plus />Create New interview</Button>


      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup >
          <SidebarContent>
            <SidebarMenu>
              {SideBarOptions.map((option, index) => (
                <SidebarMenuItem key={index} className='p-1'>
                  <SidebarMenuButton asChild className={`p-3 ${option.path === path && 'bg-blue-200 text-white'} `}>
                    <Link href={option.path}>
                      <option.icon className={` ${path == option.path && 'text-black'}`} />
                      <span className={`text-[16px] font-medium ${path == option.path && 'text-black'}`}>{option.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

              ))}
            </SidebarMenu>

          </SidebarContent>
        </SidebarGroup >
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar
