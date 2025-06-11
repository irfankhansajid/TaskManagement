import { useAuth } from '@/contexts/useAuth'
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';


function Header() {
  const { user }                            = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');

    // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '?';
    if (user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user.username ? user.username[0].toUpperCase(): '?';
  };

  return (
    <header className = "bg-white border-b border-gray-200 sticky top-0 z-10">
    <div    className = "px-4 sm:px-6 lg:px-8">
    <div    className = "flex justify-between h-16">
          {/* Left section with mobile menu button */}
          <div className = "flex items-center md:hidden">
            <Button 
              variant = "ghost"
              size    = "icon"
              onClick = {() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className = "h-6 w-6" />
              ) : (
                <Menu className = "h-6 w-6" />
              )}
            </Button>
          </div>
          
          {/* Search bar (hidden on mobile) */}
          <div    className = "hidden md:flex md:flex-1 md:items-center md:justify-start">
          <div    className = "max-w-lg w-full lg:max-w-xs">
          <label  htmlFor   = "search" className = "sr-only">Search</label>
          <div    className = "relative">
          <div    className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className = "h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id          = "search"
                  name        = "search"
                  className   = "block w-full pl-10 pr-3 py-2"
                  placeholder = "Search for tasks or projects"
                  type        = "search"
                  value       = {searchQuery}
                  onChange    = {(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Right section with notifications and user menu */}
          <div className = "flex items-center">
            {/* Notifications */}
            <Button variant   = "ghost" size = "icon" className = "relative">
            <Bell   className = "h-5 w-5" />
            <span   className = "absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>
            
            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant   = "ghost" size = "icon" className = "ml-2">
                <Avatar className = "h-8 w-8">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align = "end">
                <DropdownMenuLabel>
                  <div className = "flex flex-col">
                  <p   className = "font-medium">{user?.name || user?.username}</p>
                  <p   className = "text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to = "/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to = "/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to = "/logout">Log out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className = "md:hidden bg-white border-t border-gray-200">
        <div className = "px-2 pt-2 pb-3 space-y-1">
            <Link 
              to        = "/"
              className = "block px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-gray-50"
              onClick   = {() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to        = "/tasks"
              className = "block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick   = {() => setMobileMenuOpen(false)}
            >
              Tasks
            </Link>
            <Link 
              to        = "/projects"
              className = "block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick   = {() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              to        = "/profile"
              className = "block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick   = {() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
          
          {/* Mobile search */}
          <div    className = "px-3 py-2">
          <label  htmlFor   = "mobile-search" className = "sr-only">Search</label>
          <div    className = "relative">
          <div    className = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className = "h-4 w-4 text-gray-400" />
              </div>
              <Input
                id          = "mobile-search"
                name        = "mobile-search"
                className   = "block w-full pl-10 pr-3 py-2"
                placeholder = "Search"
                type        = "search"
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;