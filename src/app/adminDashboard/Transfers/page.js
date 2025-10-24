'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function TransfersPage() {
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
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#000000]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M1.75 2a.75.75 0 0 1 .75.75v4.5h6.69l-1.72-1.72a.749.749 0 1 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.749.749 0 1 1-1.06-1.06l1.72-1.72h-6.69v4.5a.75.75 0 0 1-1.5 0v-10.5a.75.75 0 0 1 .75-.75"></path>
                      <path d="M14.25 2a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0v-10.5a.75.75 0 0 1 .75-.75"></path>
                    </svg>
                    <h1 className="text-[20px] font-semibold text-[#303030]">Transfers</h1>
                  </div>
                </div>
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="py-8 px-0">
                    <div className="flex flex-col items-center">
                      {/* Empty State Image */}
                      <div className="mb-6">
                        <img 
                          src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/empty-state-transfers-BN_w9ghKHkD6.svg" 
                          alt="Transfers illustration" 
                          className="w-auto h-auto max-w-[400px]"
                        />
                      </div>

                      {/* Content */}
                      <div className="max-w-[400px] text-center">
                        <div className="mb-4">
                          <div className="mb-3">
                            <h2 className="text-[16px] font-semibold text-[#303030] mb-2">Move inventory between locations</h2>
                          </div>
                          <div className="text-[13px] text-black">
                            <p>Move and track inventory between your business locations.</p>
                          </div>
                        </div>

                        {/* Create Transfer Button */}
                        <div className="flex justify-center">
                          <a 
                            href="/adminDashboard/CreateTransfer"
                            className="inline-flex items-center px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors"
                          >
                            Create transfer
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Link */}
              <div className="mt-6 text-center">
                <button className="text-[13px] text-[#005bd3] hover:underline font-medium">
                  Learn more about transfers
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
