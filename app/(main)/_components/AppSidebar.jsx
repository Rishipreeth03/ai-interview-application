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
import { motion, AnimatePresence } from 'framer-motion'

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
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Image src="/logo.png" alt="Logo" height={60} width={120} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="w-full"
        >
          <Button
            className='w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold'
            aria-label="Create New Interview"
            onClick={handleCreateInterview}
          >
            <Plus /> Create New Interview
          </Button>
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              <AnimatePresence>
                {SideBarOptions.map((option, index) => {
                  const isActive = option.path === path
                  return (
                    <motion.div
                      key={option.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: index * 0.05, duration: 0.25 }}
                    >
                      <SidebarMenuItem className='p-1'>
                        <SidebarMenuButton asChild
                          className={`p-3 flex items-center gap-3 rounded transition-colors
                            ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 hover:text-blue-700'}
                          `}
                          aria-label={option.name}
                        >
                          <Link href={option.path}>
                            <motion.span
                              layout
                              className="flex items-center gap-3"
                            >
                              <option.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-700'} transition-colors`} />
                              <span className={`text-[16px] font-medium ${isActive ? 'text-white' : 'text-gray-800'}`}>
                                {option.name}
                              </span>
                            </motion.span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </SidebarMenu>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-col items-center py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="w-full"
        >
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-all"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </motion.div>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar


