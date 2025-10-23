'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';

export default function Inventory() {
  return (
    <div className="flex flex-col h-screen bg-[#f1f1f1]">
      {/* Header */}
      <Header />

      {/* Main Layout with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#f1f1f1] rounded-tl-3xl">
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-[#f1f1f1]">
            <div className="w-full px-6 py-6">
              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  {/* Inventory Icon */}
                  <svg className="w-5 h-5 text-[#000000]" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M9.265.953a2.25 2.25 0 0 0-2.53 0l-4.094 2.784a3.75 3.75 0 0 0-1.641 3.1v7.413a.75.75 0 0 0 1.5 0v-7.412c0-.745.369-1.442.985-1.86l4.093-2.784a.75.75 0 0 1 .844 0l4.093 2.783c.616.42.985 1.116.985 1.86v7.413a.75.75 0 0 0 1.5 0v-7.412a3.75 3.75 0 0 0-1.641-3.101z"></path>
                    <path fillRule="evenodd" d="M8 14.969q-.12.03-.25.031h-3a1 1 0 0 1-1-1v-3.5a1 1 0 0 1 1-1h.75v-3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3h.75a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1h-3a1 1 0 0 1-.25-.031m.75-3.969v2.5h2v-2.5zm-1.5 2.5v-2.5h-2v2.5zm1.75-4v-2.5h-2v2.5z"></path>
                  </svg>
                  
                  {/* Page Title */}
                  <h1 className="text-[20px] font-semibold text-[#303030]" tabIndex="-1">Inventory</h1>
                </div>
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    {/* Empty State Image */}
                    <div className="mb-8">
                      <img 
                        src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/empty-state-inventory-CSGe8bIdQxmT.svg" 
                        alt="Keep track of your inventory" 
                        className="w-80 h-80 object-contain"
                        role="presentation"
                      />
                    </div>

                    {/* Content */}
                    <div className="max-w-md mb-6">
                      <h2 className="text-[18px] font-semibold text-[#303030] mb-4">
                        Keep track of your inventory
                      </h2>
                      <p className="text-[13px] text-[#616161] leading-relaxed">
                        When you enable inventory tracking on your products, you can view and adjust their inventory counts here.
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center">
                      <a 
                        href="/adminDashboard"
                        className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors"
                      >
                        Go to products
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Help */}
              <div className="mt-6 text-center">
                <button className="text-[13px] text-[#131212] hover:underline font-medium">
                  Learn more about managing inventory
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
