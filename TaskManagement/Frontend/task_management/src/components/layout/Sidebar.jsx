import { useAuth } from '@/contexts/useAuth'
import { cn } from '@/lib/utils';
import { Briefcase, CheckSquare, LayoutDashboard, LogOut, Settings, User, Users } from 'lucide-react';
import React from 'react'
import { NavLink } from 'react-router-dom';
import { Button } from '../ui/button';

const Sidebar = () => {

    const {user, logout} = useAuth();

    const isAdmin = user?.role === 'ADMIN';

    const navigation = [
        { name: "Dashboard", path: '/', icon: LayoutDashboard},
        {name: "Tasks", path: "/tasks", icon: CheckSquare},
        {name: "Projects", path: "/projects", icon: Briefcase},
        {name: "Profile", path: '/profile', icon: User}
    ];

    // admin only route
    if (isAdmin) {
        navigation.push({name: "Users", path:'/users', icon: Users});
        navigation.push({name: "Settings", path: '/settings', icon: Settings})
    }


  return (
    <div className = "hidden md:flex md:w-64 md:flex-col h-screen">
        <div className = "flex flex-col flex-1 border-r border-gray-200 bg-white">
        <div className = "flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
            <h1  className = "text-xl font-semibold text-gray-900">TaskFlow</h1>
        </div>
        <div className = "flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          
                <nav className = 'mt-5 flex-1 px-2 space-y-1'>
                    {navigation.map((item) => (
                       <NavLink
                        key = {item.name}
                        to  = {item.path}
                        className={
                            ({isActive}) => cn (
                                "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                                isActive ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )
                        }
                       >
                        <item.icon className = 'mr-3 flex-shrink-0 text-gray-400' />
                        {item.name}
                       </NavLink> 
                    ))}
                    
                </nav>
            </div>

            <div className='p-4 border-t border-gray-200'>
                <Button variant = "outline" className = "w-full flex items-center justify-center"
                onclick={logout}>
                    <LogOut className='mr-2 h-4 w-4'/>
                    <span>Log out</span>
                </Button>
            </div>
        </div>
    </div>
  )
}

export default Sidebar;