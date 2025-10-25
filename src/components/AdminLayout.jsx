'use client';

import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#f1f1f1]">
      {/* Header */}
      <Header onMenuClick={() => setSidebarOpen(true)} />

      {/* Main Layout with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#f1f1f1] lg:rounded-tl-3xl">
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-[#f1f1f1]">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
