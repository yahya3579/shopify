'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, ChevronDown, Check, LogOut, Menu, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header({ onMenuClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        console.log('Fetching user data with token:', token.substring(0, 20) + '...');

        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('API response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('User data received:', data);
          setUser(data.user);
        } else {
          const errorData = await response.json();
          console.error('API error:', errorData);
          // Token is invalid, remove it
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Clear local storage
      localStorage.removeItem('token');
      
      // Redirect to login page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if API call fails
      localStorage.removeItem('token');
      router.push('/');
    }
  };
  return (
    <header className="bg-[#1a1a1a] text-white h-14 flex items-center justify-between px-4 border-b border-[#2d2d2d] relative z-50">
      {/* Left Side - Mobile Menu + Logo */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick && onMenuClick();
          }}
          className="lg:hidden p-2 hover:bg-[#2d2d2d] rounded transition-colors"
          aria-label="Toggle menu"
          data-sidebar-trigger
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Shopify Logo */}
        <div className="flex items-center gap-2">
          <img 
            src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/shopify-glyph-white-DZNyE9BvHIk-.svg" 
            alt="Shopify" 
            className="w-6 h-6"
          />
          <img 
            src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/shopify-wordmark-monochrome-CpVsfBAAmxEP.svg" 
            alt="Shopify" 
            className="h-5 hidden sm:block"
          />
        </div>
      </div>

      {/* Center - Search Bar and View as Button */}
      <div className="flex-1 flex items-center justify-center gap-3 max-w-3xl mx-auto px-4">
        {/* Desktop Search Bar */}
        <div className="hidden md:block w-full max-w-xl">
          <button className="w-full flex items-center justify-between bg-[#303030] hover:bg-[#404040] rounded-lg px-3 py-2 text-sm transition-colors">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M10.323 11.383a5.5 5.5 0 1 1-3.323-9.883 5.5 5.5 0 0 1 4.383 8.823l2.897 2.897a.749.749 0 1 1-1.06 1.06zm.677-4.383c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4"></path>
              </svg>
              <span className="text-white">Search</span>
            </div>
            <div className="hidden lg:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs font-mono text-gray-400 bg-[#404040] rounded-md border border-[#555]">CTRL</kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-mono text-gray-400 bg-[#404040] rounded-md border border-[#555]">K</kbd>
            </div>
          </button>
        </div>

        {/* View as Button - Hidden on small screens */}
        <button className="hidden lg:flex items-center gap-2 px-3 py-2 bg-[#303030] rounded-lg text-sm hover:bg-[#404040] transition-colors whitespace-nowrap">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-1.5 0a1.5 1.5 0 1 1-3.001-.001 1.5 1.5 0 0 1 3.001.001"></path>
            <path fillRule="evenodd" d="M8 2c-2.476 0-4.348 1.23-5.577 2.532a9.3 9.3 0 0 0-1.4 1.922 6 6 0 0 0-.37.818c-.082.227-.153.488-.153.728s.071.501.152.728c.088.246.213.524.371.818.317.587.784 1.27 1.4 1.922 1.229 1.302 3.1 2.532 5.577 2.532s4.348-1.23 5.577-2.532a9.3 9.3 0 0 0 1.4-1.922c.158-.294.283-.572.37-.818.082-.227.153-.488.153-.728s-.071-.501-.152-.728a6 6 0 0 0-.371-.818a9.3 9.3 0 0 0-1.4-1.922c-1.229-1.302-3.1-2.532-5.577-2.532m-5.999 6.002v-.004c.004-.02.017-.09.064-.223.058-.161.15-.369.278-.608a7.8 7.8 0 0 1 1.17-1.605c1.042-1.104 2.545-2.062 4.487-2.062s3.445.958 4.486 2.062c.52.55.912 1.126 1.17 1.605.13.24.221.447.279.608.047.132.06.203.064.223v.004c-.004.02-.017.09-.064.223-.058.161-.15.369-.278.608a7.8 7.8 0 0 1-1.17 1.605c-1.042 1.104-2.545 2.062-4.487 2.062s-3.445-.958-4.486-2.062a7.7 7.7 0 0 1-1.17-1.605 4.5 4.5 0 0 1-.279-.608c-.047-.132-.06-.203-.064-.223"></path>
          </svg>
          <span className="text-white font-medium">View as</span>
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Mobile Search Button */}
        <button 
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="md:hidden p-2 hover:bg-[#2d2d2d] rounded transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
        
        {/* Notifications */}
        <button className="relative p-2 hover:bg-[#2d2d2d] rounded transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="m5.252 12.424-2.446-.281c-1.855-.213-2.38-2.659-.778-3.616l.065-.038a2.89 2.89 0 0 0 1.407-2.48v-.509a4.5 4.5 0 0 1 9 0v.51c0 1.016.535 1.958 1.408 2.479l.065.038c1.602.957 1.076 3.403-.778 3.616l-2.543.292v.365a2.7 2.7 0 0 1-5.4 0zm3.9.076h-2.4v.3a1.2 1.2 0 1 0 2.4 0zm-3.152-1.5h4l3.024-.348a.452.452 0 0 0 .18-.837l-.065-.038a4.4 4.4 0 0 1-.674-.495l-.073-.067a4.4 4.4 0 0 1-1.392-3.205v-.51a3 3 0 1 0-6 0v.51a4.4 4.4 0 0 1-1.391 3.205l-.073.067a4.6 4.6 0 0 1-.674.495l-.065.038a.453.453 0 0 0 .18.838z"></path>
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#fd5749] rounded-full flex items-center justify-center text-[10px] font-semibold">
            1
          </span>
        </button>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 cursor-pointer hover:bg-[#2d2d2d] rounded px-2 py-1 transition-colors"
          >
            <div className="relative">
              <span className="w-8 h-8 rounded-lg bg-[#95bf47] flex items-center justify-center">
                <svg className="w-8 h-8" viewBox="0 0 40 40">
                  <text className="fill-current" x="50%" y="50%" dy="0.35em" textAnchor="middle">MS</text>
                </svg>
              </span>
            </div>
            <span className="text-sm font-medium text-white hidden sm:block">My Store</span>
            <ChevronDown className="w-4 h-4 text-white hidden sm:block" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-[#e1e1e1] z-50 overflow-hidden">
              {/* Store Options */}
              

              {/* Separator */}
              <div className="border-t border-[#e1e1e1]"></div>

              {/* User Profile Section */}
              <div className="py-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#8b5cf6] flex items-center justify-center">
                      <svg className="w-8 h-8" viewBox="0 0 40 40">
                        <text className="fill-current text-white" x="50%" y="50%" dy="0.35em" textAnchor="middle">
                          {user ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}` : 'U'}
                        </text>
                      </svg>
                    </span>
                    <div className="text-left">
                      <p className="text-[14px] font-medium text-[#303030]">
                        {user ? `${user.firstName || ''} ${user.lastName || ''}` : 'Loading...'}
                      </p>
                      <p className="text-[12px] text-[#6d7175]">
                        {user ? user.email : ''}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Separator */}
              <div className="border-t border-[#e1e1e1]"></div>

              {/* Log Out */}
              <div className="py-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-[#6d7175]" />
                  <span className="text-[14px] text-[#303030]">Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="absolute top-full left-0 right-0 bg-[#1a1a1a] border-b border-[#2d2d2d] p-4 md:hidden z-40">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center bg-[#303030] rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                  autoFocus
                />
              </div>
            </div>
            <button
              onClick={() => setShowMobileSearch(false)}
              className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
