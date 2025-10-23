'use client';

import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';

export default function PurchaseOrders() {
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
                  {/* Purchase Orders Icon */}
                  <svg className="w-5 h-5 text-[#000000]" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2.25 1a1.75 1.75 0 0 0-1.75 1.75v10.5c0 .966.784 1.75 1.75 1.75h4.5a.75.75 0 0 0 0-1.5h-4.5a.25.25 0 0 1-.25-.25v-10.5a.25.25 0 0 1 .25-.25h8a.25.25 0 0 1 .25.25v2.75a.75.75 0 0 0 1.5 0v-2.75a1.75 1.75 0 0 0-1.75-1.75z"></path>
                    <path d="M3.5 4.75a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75"></path>
                    <path d="M12 8.25a.75.75 0 0 0-1.5 0v.25a2 2 0 1 0 0 4h1a.5.5 0 0 1 0 1h-2.25a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 1.5 0 2 2 0 1 0 0-4h-1a.5.5 0 0 1 0-1h2.25a.75.75 0 0 0 0-1.5h-.75z"></path>
                    <path d="M4.25 7a.75.75 0 0 0 0 1.5h2.75a.75.75 0 0 0 0-1.5z"></path>
                    <path d="M3.5 10.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75"></path>
                  </svg>
                  
                  {/* Page Title */}
                  <h1 className="text-[20px] font-semibold text-[#303030]" tabIndex="-1">Purchase orders</h1>
                </div>
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-16">
                  {/* Empty State Content */}
                  <div className="flex flex-col items-center text-center">
                    {/* Illustration */}
                    <div className="mb-8">
                      <img 
                        src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/empty-state-purchase-DmIBo_-747ua.svg" 
                        alt="Manage your purchase orders" 
                        className="w-80 h-80 object-contain"
                      />
                    </div>

                    {/* Text Content */}
                    <div className="max-w-md mb-6">
                      <h2 className="text-[18px] font-semibold text-[#303030] mb-3">
                        Manage your purchase orders
                      </h2>
                      <p className="text-[13px] text-[#616161]">
                        Track and receive inventory ordered from suppliers.
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center">
                      <a href="/adminDashboard/CreatePurchaseOrder" className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors">
                        Create purchase order
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Help */}
              <div className="mt-6 text-center">
                <button className="text-[13px] text-[#131212] hover:underline font-medium">
                  Learn more about purchase orders
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
