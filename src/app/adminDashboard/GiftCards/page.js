'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function GiftCardsPage() {
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#000000]" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M13.5 3.5h-5.5v.75a.75.75 0 0 1-1.5 0v-.75h-4a.5.5 0 0 0-.5.5v3.043a.75.75 0 0 1 0 1.414v3.543a.5.5 0 0 0 .5.5h4v-1a.75.75 0 0 1 1.5 0v1h5.5a.5.5 0 0 0 .5-.5v-3.5h-1.25a.75.75 0 0 1 0-1.5h1.25v-3a.5.5 0 0 0-.5-.5m2 4.25v-3.75a2 2 0 0 0-2-2h-11a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2zm-8.703-1.758a2.117 2.117 0 0 0-4.047.88c0 1.171.95 2.128 2.125 2.128h.858c-.595.51-1.256.924-1.84 1.008a.749.749 0 1 0 .213 1.484c1.11-.158 2.128-.919 2.803-1.53a11 11 0 0 0 .341-.322q.16.158.34.322c.676.611 1.693 1.372 2.804 1.53a.749.749 0 1 0 .212-1.484c-.583-.084-1.244-.498-1.839-1.008h.858a2.13 2.13 0 0 0 2.125-2.128 2.118 2.118 0 0 0-4.047-.88l-.453.996zm-.962 1.508h-.96a.627.627 0 0 1-.625-.628.619.619 0 0 1 1.182-.259zm3.79 0h-.96l.403-.887a.618.618 0 0 1 1.182.259.63.63 0 0 1-.625.628"></path>
                      </svg>
                      <h1 className="text-[20px] font-semibold text-[#303030]">Gift cards</h1>
                    </div>
                  </div>
                  
                  {/* Action Menu */}
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                      Export
                    </button>
                    
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
                          src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/empty-state-gift-cards-8nmlfWYoOfXW.svg" 
                          alt="Gift cards illustration" 
                          className="w-auto h-auto max-w-[400px]"
                        />
                      </div>

                      {/* Content */}
                      <div className="max-w-[400px] text-center">
                        <div className="mb-4">
                          <div className="mb-3">
                            <h2 className="text-[16px] font-semibold text-[#303030] mb-2">Start selling gift cards</h2>
                          </div>
                          <div className="text-[13px] text-[#6d7175] mb-4">
                            <p>Add gift card products to sell or create gift cards and send them directly to your customers.</p>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center justify-center gap-2 mb-6">
                            <a 
                              href="/adminDashboard/CreateGiftCard"
                              className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Create gift card
                            </a>
                            <a 
                              href="/adminDashboard/CreateGiftCardProduct"
                              className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors inline-block"
                            >
                              Add gift card product
                            </a>
                          </div>
                        </div>

                        {/* Terms of Service */}
                        <div className="text-[13px] text-[#6d7175]">
                          <p>
                            By using gift cards, you agree to our{' '}
                            <a 
                              href="https://www.shopify.com/legal/terms-gift-cards" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#005bd3] hover:underline"
                            >
                              Terms of Service
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Link */}
              <div className="mt-6 text-center">
                <button className="text-[13px] text-[#005bd3] hover:underline font-medium">
                  Learn more about gift cards
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
