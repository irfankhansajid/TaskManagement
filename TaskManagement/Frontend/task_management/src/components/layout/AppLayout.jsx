import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

function AppLayout() {
  return (
    <div className = "min-h-screen bg-gray-50">
    <div className = "flex h-screen overflow-hidden">
        <Sidebar />
        
        <div className = "flex flex-col flex-1 overflow-hidden">
          <Header />
          
          <main className = "flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout