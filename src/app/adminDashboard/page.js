'use client';

import { Plus } from 'lucide-react';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';

export default function AdminDashboard() {
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
          <main className="flex-1 overflow-auto bg-[#f1f1f1] flex flex-col">
          <div className="p-8 bg-[#f1f1f1]">
            {/* Products Page */}
            <div className="mb-6">
              {/* Page Header - Outside Card */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#303030]" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M11 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
                    <path fillRule="evenodd" d="M9.276 1.5c-1.02 0-1.994.415-2.701 1.149l-4.254 4.417a2.75 2.75 0 0 0 .036 3.852l2.898 2.898a2.5 2.5 0 0 0 3.502.033l4.747-4.571a3.25 3.25 0 0 0 .996-2.341v-2.187a3.25 3.25 0 0 0-3.25-3.25zm-1.62 2.19a2.24 2.24 0 0 1 1.62-.69h1.974c.966 0 1.75.784 1.75 1.75v2.187c0 .475-.194.93-.536 1.26l-4.747 4.572a1 1 0 0 1-1.401-.014l-2.898-2.898a1.25 1.25 0 0 1-.016-1.75l4.253-4.418Z"></path>
                  </svg>
                </div>
                <h1 className="text-[20px] font-semibold text-[#303030]">Products</h1>
              </div>

              {/* Rounded Card Container */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Index Filters */}
                <div className="border-b border-[#e1e1e1]">
                  <div className="px-6 py-3">
                    <div className="flex items-center justify-between">
                      {/* Tabs */}
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 text-[13px] font-medium text-[#303030] bg-[#f1f1f1] rounded-lg">
                          All
                        </button>
                        <button className="p-2 text-[#5c5f62] hover:bg-gray-100 rounded">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-[#5c5f62] hover:bg-gray-100 rounded">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <path fillRule="evenodd" d="M10.323 11.383a5.5 5.5 0 1 1-3.323-9.883 5.5 5.5 0 0 1 4.383 8.823l2.897 2.897a.749.749 0 1 1-1.06 1.06zm.677-4.383c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4"></path>
                          </svg>
                        </button>
                        <button className="p-2 text-[#5c5f62] hover:bg-gray-100 rounded">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M1 4a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5h-12.5a.75.75 0 0 1-.75-.75"></path>
                            <path d="M4.75 12a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75"></path>
                            <path d="M3.5 7.25a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5z"></path>
                          </svg>
                        </button>
                        <button className="p-2 text-[#5c5f62] hover:bg-gray-100 rounded">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5.75 4.06v7.69a.75.75 0 0 1-1.5 0v-7.69l-1.72 1.72a.749.749 0 1 1-1.06-1.06l3-3a.75.75 0 0 1 1.06 0l3 3a.749.749 0 1 1-1.06 1.06z"></path>
                            <path d="M11.75 4.25a.75.75 0 0 0-1.5 0v7.69l-1.72-1.72a.749.749 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.749.749 0 1 0-1.06-1.06l-1.72 1.72z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Empty State */}
                <div className="px-8 py-16">
                  <div className="flex items-center justify-between max-w-5xl mx-auto">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-[20px] font-semibold text-[#303030]" tabIndex="-1">
                        Add your products
                      </h2>
                      <p className="text-[13px] text-[#616161]">
                        Start by stocking your store with products your customers will love
                      </p>
                      <div className="flex flex-wrap gap-3 mt-4">
                        <a href="/adminDashboard/AddProduct" className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5z"></path>
                          </svg>
                          <span className="font-semibold">Add product</span>
                        </a>
                        <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8.75 2.25a.75.75 0 0 0-1.5 0v6.69l-1.72-1.72a.749.749 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.749.749 0 1 0-1.06-1.06l-1.72 1.72z"></path>
                            <path d="M14.5 11.75a.75.75 0 0 0-1.5 0v.8a.75.75 0 0 1-.75.75h-8.5a.75.75 0 0 1-.75-.75v-.8a.75.75 0 0 0-1.5 0v.8a2.25 2.25 0 0 0 2.25 2.25h8.5a2.25 2.25 0 0 0 2.25-2.25z"></path>
                          </svg>
                          <span className="font-medium">Import</span>
                        </button>
                      </div>
                    </div>

                    {/* Product Image */}
                    <div className="flex items-center justify-center">
                      <img src="/productimage.svg" alt="Start by stocking your store with products your customers will love" className="w-65 h-65 object-contain" />
                    </div>
                  </div>
                </div>

                 {/* Product Sourcing Section */}
                 <div className="bg-[#f6f6f7] px-8 py-6 border-t border-[#e1e1e1]">
                   <div className="flex items-center justify-center">
                     <div className="max-w-4xl w-full">
                       <div className="flex flex-col items-start gap-1">
                         <h3 className="text-[16px] font-semibold text-[#303030]" tabIndex="-1">
                           Find products to sell
                         </h3>
                         <p className="text-[13px] text-[#616161]">
                           Have dropshipping or print on demand products shipped directly from the supplier to your customer, and only pay for what you sell.
                         </p>
                         <div className="mt-3">
                           <div className="flex flex-wrap gap-2">
                             <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-white transition-colors">
                               <span className="font-medium">Browse product sourcing apps</span>
                             </button>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>
    </div>
  );
}