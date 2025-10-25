'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const [productsExpanded, setProductsExpanded] = useState(true);
  const [activeMenu, setActiveMenu] = useState('products');
  const [activeSubItem, setActiveSubItem] = useState('collections'); // Track active sub-item

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.sidebar-container') && !event.target.closest('[data-sidebar-trigger]')) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when sidebar is open on mobile
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" style={{ backgroundColor: '#000000', opacity: 0.5 }} />
      )}
      
      {/* Sidebar */}
      <aside className={`
        sidebar-container
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-[240px] bg-[#ececec] border-r border-[#e1e1e1] flex flex-col
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#e1e1e1]">
          <span className="text-[16px] font-semibold text-[#303030]">Menu</span>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#e8e8e8] rounded transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-[#5c5f62]" />
          </button>
        </div>

        {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Primary Navigation */}
        <div className="py-2">
          <ul className="space-y-0.5">
            {/* Home */}
            <li>
              <a href="/adminDashboard" className="w-full flex items-center gap-3 px-4 py-2 text-[14px] hover:bg-[#e8e8e8] transition-colors">
                <svg className="w-4 h-4 text-[#5c5f62]" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12 14h-2a1 1 0 0 1-1-1v-2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v2.5a1 1 0 0 1-1 1h-2a2 2 0 0 1-2-2v-4.257c0-.796.316-1.56.879-2.122l3.707-3.707c.78-.78 2.047-.78 2.828 0l3.707 3.707a3 3 0 0 1 .879 2.122v4.257a2 2 0 0 1-2 2"></path>
                </svg>
                <span className="text-[#303030] font-medium">Home</span>
              </a>
            </li>

            {/* Orders */}
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-[14px] hover:bg-[#e8e8e8] transition-colors">
                <svg className="w-4 h-4 text-[#5c5f62]" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M2.255 3.847a2.75 2.75 0 0 1 2.72-2.347h6.05a2.75 2.75 0 0 1 2.72 2.347l.66 4.46q.095.638.095 1.282v1.661a3.25 3.25 0 0 1-3.25 3.25h-6.5a3.25 3.25 0 0 1-3.25-3.25v-1.66q0-.645.094-1.283zm2.72-.847a1.25 1.25 0 0 0-1.236 1.067l-.583 3.933h2.484c.538 0 1.015.344 1.185.855l.159.474a.25.25 0 0 0 .237.171h1.558a.25.25 0 0 0 .237-.17l.159-.475a1.25 1.25 0 0 1 1.185-.855h2.484l-.583-3.933a1.25 1.25 0 0 0-1.236-1.067z"></path>
                </svg>
                <span className="text-[#303030] font-medium">Orders</span>
              </button>
            </li>

            {/* Products */}
            <li>
              <div>
                <div className="flex items-center">
                  <a 
                    href="/adminDashboard"
                    className={`flex-1 flex items-center gap-3 px-4 py-2 text-[14px] hover:bg-[#e8e8e8] transition-colors ${
                      activeMenu === 'products' ? 'bg-[#e8e8e8]' : ''
                    }`}
                  >
                    <svg className="w-4 h-4 text-[#5c5f62]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M11 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
                      <path fillRule="evenodd" d="M9.276 1.5c-1.02 0-1.994.415-2.701 1.149l-4.254 4.417a2.75 2.75 0 0 0 .036 3.852l2.898 2.898a2.5 2.5 0 0 0 3.502.033l4.747-4.571a3.25 3.25 0 0 0 .996-2.341v-2.187a3.25 3.25 0 0 0-3.25-3.25zm-1.62 2.19a2.24 2.24 0 0 1 1.62-.69h1.974c.966 0 1.75.784 1.75 1.75v2.187c0 .475-.194.93-.536 1.26l-4.747 4.572a1 1 0 0 1-1.401-.014l-2.898-2.898a1.25 1.25 0 0 1-.016-1.75l4.253-4.418Z"></path>
                    </svg>
                    <span className="text-[#303030] font-semibold">Products</span>
                  </a>
                  <button 
                    onClick={() => setProductsExpanded(!productsExpanded)}
                    className="px-2 py-2 text-[#5c5f62] hover:bg-[#e8e8e8] transition-colors"
                  >
                    {productsExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                </div>
                
                {/* Products Submenu */}
                {productsExpanded && (
                  <div className="bg-[#ececec]">
                    <ul className="py-1">
                      <li>
                        <a 
                          href="/adminDashboard/Collections" 
                          onClick={() => setActiveSubItem('collections')}
                          className={`w-full flex items-center justify-between px-4 py-1.5 pl-[44px] text-[14px] text-[#303030] font-normal hover:bg-[#f7f7f7] transition-colors ${
                            activeSubItem === 'collections' ? 'bg-[#ececec]' : ''
                          }`}
                        >
                          <span>Collections</span>
                          {/* {activeSubItem === 'collections' && (
                            <ChevronRight className="w-3 h-3 text-[#5c5f62]" />
                          )} */}
                        </a>
                      </li>
                      <li>
                        <a 
                          href="/adminDashboard/Inventory" 
                          onClick={() => setActiveSubItem('inventory')}
                          className={`w-full flex items-center justify-between px-4 py-1.5 pl-[44px] text-[14px] text-[#303030] font-normal hover:bg-[#f7f7f7] transition-colors ${
                            activeSubItem === 'inventory' ? 'bg-[#ececec]' : ''
                          }`}
                        >
                          <span>Inventory</span>
                          {activeSubItem === 'inventory' && (
                            <ChevronRight className="w-3 h-3 text-[#5c5f62]" />
                          )}
                        </a>
                      </li>
                      <li>
                        <a 
                          href="/adminDashboard/PurchaseOrders" 
                          onClick={() => setActiveSubItem('purchase-orders')}
                          className={`w-full flex items-center justify-between px-4 py-1.5 pl-[44px] text-[14px] text-[#303030] font-normal hover:bg-[#f7f7f7] transition-colors ${
                            activeSubItem === 'purchase-orders' ? 'bg-[#ececec]' : ''
                          }`}
                        >
                          <span>Purchase orders</span>
                          {activeSubItem === 'purchase-orders' && (
                            <ChevronRight className="w-3 h-3 text-[#5c5f62]" />
                          )}
                        </a>
                      </li>
                      <li>
                        <a 
                          href="/adminDashboard/Transfers" 
                          onClick={() => setActiveSubItem('transfers')}
                          className={`w-full flex items-center justify-between px-4 py-1.5 pl-[44px] text-[14px] text-[#303030] font-normal hover:bg-[#f7f7f7] transition-colors ${
                            activeSubItem === 'transfers' ? 'bg-[#ececec]' : ''
                          }`}
                        >
                          <span>Transfers</span>
                          {activeSubItem === 'transfers' && (
                            <ChevronRight className="w-3 h-3 text-[#5c5f62]" />
                          )}
                        </a>
                      </li>
                      <li>
                        <a 
                          href="/adminDashboard/GiftCards" 
                          onClick={() => setActiveSubItem('gift-cards')}
                          className={`w-full flex items-center justify-between px-4 py-1.5 pl-[44px] text-[14px] text-[#303030] font-normal hover:bg-[#f7f7f7] transition-colors ${
                            activeSubItem === 'gift-cards' ? 'bg-[#ececec]' : ''
                          }`}
                        >
                          <span>Gift cards</span>
                          {activeSubItem === 'gift-cards' && (
                            <ChevronRight className="w-3 h-3 text-[#5c5f62]" />
                          )}
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </li>

            {/* Customers */}
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-[14px] hover:bg-[#e8e8e8] transition-colors">
                <svg className="w-4 h-4 text-[#5c5f62]" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.5 4.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"></path>
                  <path d="M2.516 12.227a6.273 6.273 0 0 1 10.968 0l.437.786a1.338 1.338 0 0 1-1.17 1.987h-9.502a1.338 1.338 0 0 1-1.17-1.987z"></path>
                </svg>
                <span className="text-[#303030] font-medium">Customers</span>
              </button>
            </li>

            {/* Marketing */}
            {/* <li>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-[14px] hover:bg-[#e8e8e8] transition-colors">
                <svg className="w-4 h-4 text-[#5c5f62]" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 8a5 5 0 0 1 10 0 1 1 0 0 0 2 0 7 7 0 1 0-7 7 1 1 0 0 0 0-2 5 5 0 0 1-5-5"></path>
                  <path d="M9.29 7.84a1 1 0 1 0 1.98-.279 3.25 3.25 0 0 0-2.16-2.62 3.25 3.25 0 1 0-1.622 6.274 1 1 0 0 0 .347-1.97 1.25 1.25 0 0 1-.978-.865 1.24 1.24 0 0 1 .327-1.265 1.25 1.25 0 0 1 1.275-.283 1.26 1.26 0 0 1 .831 1.008"></path>
                  <path d="M9.611 8.973a.5.5 0 0 0-.638.638l2.121 6.01a.502.502 0 0 0 .871.134l1.172-1.557 1.038 1.037a.5.5 0 0 0 .707 0l.353-.353a.5.5 0 0 0 0-.707l-1.037-1.038 1.557-1.172a.502.502 0 0 0-.134-.871z"></path>
                </svg>
                <span className="text-[#303030] font-medium">Marketing</span>
              </button>
            </li> */}

            {/* Discounts */}
            <li>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-[14px] hover:bg-[#e8e8e8] transition-colors">
                <svg className="w-4 h-4 text-[#5c5f62]" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M9.527 1.327c-.6-1.306-2.455-1.306-3.054 0a1.68 1.68 0 0 1-2.112.874c-1.347-.5-2.66.813-2.16 2.16a1.68 1.68 0 0 1-.874 2.112c-1.306.6-1.306 2.455 0 3.054a1.68 1.68 0 0 1 .874 2.112c-.5 1.347.813 2.659 2.16 2.16a1.68 1.68 0 0 1 2.112.874c.6 1.306 2.455 1.306 3.054 0a1.68 1.68 0 0 1 2.112-.874c1.347.499 2.66-.813 2.16-2.16a1.68 1.68 0 0 1 .874-2.112c1.306-.6 1.306-2.455 0-3.054a1.68 1.68 0 0 1-.874-2.112c.5-1.347-.813-2.66-2.16-2.16a1.68 1.68 0 0 1-2.112-.874m-2.527 4.923a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3.53.53-4 4a.749.749 0 1 1-1.06-1.06l4-4a.749.749 0 1 1 1.06 1.06m.47 3.47a1 1 0 1 1-2 0 1 1 0 0 1 2 0"></path>
                </svg>
                <span className="text-[#303030] font-medium">Discounts</span>
              </button>
            </li>

            {/* Content */}
            {/* <li>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-[14px] hover:bg-[#e8e8e8] transition-colors">
                <svg className="w-4 h-4 text-[#5c5f62]" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M10 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
                  <path fillRule="evenodd" d="M5.42 1.5h5.16c.535 0 .98 0 1.345.03.38.03.736.098 1.073.27.518.263.939.684 1.202 1.202.172.337.24.693.27 1.073.03.365.03.81.03 1.345v1.91c0 .535 0 .98-.03 1.345-.03.38-.098.736-.27 1.073a2.74 2.74 0 0 1-1.201 1.202c-.338.172-.694.24-1.074.27a6 6 0 0 1-.288.017.7.7 0 0 1-.137.013h-6.08c-.535 0-.98 0-1.345-.03-.38-.03-.736-.098-1.073-.27a2.75 2.75 0 0 1-1.047-.934.75.75 0 0 1-.176-.31c-.157-.324-.22-.667-.25-1.031-.029-.365-.029-.81-.029-1.345v-1.91c0-.535 0-.98.03-1.345.03-.38.098-.736.27-1.073a2.74 2.74 0 0 1 1.202-1.202c.337-.172.693-.24 1.073-.27.365-.03.81-.03 1.345-.03m7.58 5.8-.001.533-.135-.192a1.75 1.75 0 0 0-2.778-.116l-1.086 1.303-2.411-2.893a1.75 1.75 0 0 0-2.68-.01l-.909 1.073v-1.548c0-.572 0-.957.025-1.253.023-.287.065-.424.111-.514.12-.236.311-.427.547-.547.09-.046.227-.088.514-.111.296-.024.68-.025 1.253-.025h5.1c.572 0 .957 0 1.252.025.288.023.425.065.516.111.235.12.426.311.546.547.046.09.088.227.111.514.024.296.025.68.025 1.253z"></path>
                  <path d="M2 13.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75"></path>
                  <path d="M10.75 13a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5z"></path>
                </svg>
                <span className="text-[#303030] font-medium">Content</span>
              </button>
            </li> */}

            {/* Markets */}
            {/* <li>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-[14px] hover:bg-[#e8e8e8] transition-colors">
                <svg className="w-4 h-4 text-[#5c5f62]" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1 8a7 7 0 0 1 12.584-4.222 2 2 0 0 0-2.327 1.806 3.5 3.5 0 0 0-1.862 2.166h-1.395a1.255 1.255 0 0 1-.764-2.248l.462-.357a.89.89 0 0 0 .347-.707v-.04c0-.747.606-1.353 1.353-1.353h.057c.193 0 .37-.069.509-.184a5.5 5.5 0 0 0-6.945 2.804l1.89 1.89c.378.379.591.892.591 1.427v.518a1 1 0 0 0 1 1 1.5 1.5 0 0 1 1.5 1.5v1.5q.647-.002 1.253-.143c.029.546.277 1.035.658 1.379a7 7 0 0 1-8.911-6.736"></path>
                  <path d="M13.25 5a.75.75 0 0 1 .75.75v.75h.75a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 0 0 1.5h.5a2.25 2.25 0 0 1 .25 4.486v.264a.75.75 0 0 1-1.5 0v-.25h-.75a.75.75 0 0 1 0-1.5h2a.75.75 0 0 0 0-1.5h-.5a2.25 2.25 0 0 1-.25-4.486v-.764a.75.75 0 0 1 .75-.75"></path>
                </svg>
                <span className="text-[#303030] font-medium">Markets</span>
              </button>
            </li> */}

            {/* Analytics */}
            {/* <li>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-[14px] hover:bg-[#e8e8e8] transition-colors">
                <svg className="w-4 h-4 text-[#5c5f62]" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M7.971 2c-.204 0-.344 0-.465.024a1.25 1.25 0 0 0-.982.982c-.024.121-.024.26-.024.465v9.058c0 .204 0 .344.024.465.099.496.486.883.982.982.121.024.26.024.465.024h.058c.204 0 .344 0 .465-.024a1.25 1.25 0 0 0 .982-.982c.024-.121.024-.26.024-.465v-9.058c0-.204 0-.344-.024-.465a1.25 1.25 0 0 0-.982-.982c-.121-.024-.26-.024-.465-.024z"></path>
                  <path d="M3.471 7.5c-.204 0-.344 0-.465.024a1.25 1.25 0 0 0-.982.982c-.024.121-.024.26-.024.465v3.558c0 .204 0 .344.024.465.099.496.486.883.982.982.121.024.26.024.465.024h.058c.204 0 .344 0 .465-.024a1.25 1.25 0 0 0 .982-.982c.024-.121.024-.26.024-.465v-3.558c0-.204 0-.344-.024-.465a1.25 1.25 0 0 0-.982-.982c-.121-.024-.26-.024-.465-.024z"></path>
                  <path d="M12.471 4.5c-.204 0-.344 0-.465.024a1.25 1.25 0 0 0-.982.982c-.024.121-.024.26-.024.465v6.558c0 .204 0 .344.024.465.099.496.486.883.982.982.121.024.26.024.465.024h.058c.204 0 .344 0 .465-.024a1.25 1.25 0 0 0 .982-.982c.024-.121.024-.26.024-.465v-6.558c0-.204 0-.344-.024-.465a1.25 1.25 0 0 0-.982-.982c-.121-.024-.26-.024-.465-.024z"></path>
                </svg>
                <span className="text-[#303030] font-medium">Analytics</span>
              </button>
            </li> */}
          </ul>
        </div>

        {/* Sales Channels Section */}
       
      </div>

      {/* Settings at bottom */}
      <div className="p-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-[14px] hover:bg-[#e8e8e8] transition-colors">
          <svg className="w-4 h-4 text-[#5c5f62]" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M6 2.176c0-.76.617-1.376 1.377-1.376h1.246c.76 0 1.376.616 1.376 1.376v.688c0 .19.126.396.358.517q.219.114.424.248c.221.144.465.152.632.056l.6-.347c.658-.38 1.5-.154 1.88.504l.622 1.08c.38.658.155 1.5-.503 1.88l-.648.373c-.163.094-.277.303-.269.56a5 5 0 0 1-.004.439c-.014.264.1.478.268.575l.653.377c.658.38.883 1.222.503 1.88l-.623 1.08a1.377 1.377 0 0 1-1.88.503l-.7-.405c-.164-.094-.401-.088-.62.048q-.164.102-.335.191c-.232.121-.358.326-.358.517v.811c0 .76-.616 1.376-1.376 1.376h-1.246c-.76 0-1.376-.616-1.376-1.376v-.81c0-.192-.127-.397-.359-.518a5 5 0 0 1-.333-.19c-.22-.138-.458-.143-.621-.049l-.7.405c-.659.38-1.5.154-1.88-.504l-.624-1.08a1.375 1.375 0 0 1 .504-1.879l.653-.377c.167-.097.282-.311.268-.575a5 5 0 0 1-.004-.439c.008-.257-.106-.465-.27-.56l-.647-.374a1.376 1.376 0 0 1-.504-1.88l.624-1.079a1.376 1.376 0 0 1 1.88-.504l.6.347c.166.096.41.088.631-.056q.205-.135.423-.248c.232-.121.359-.326.359-.517v-.688Zm2 7.324a1.5 1.5 0 1 0-.001-3.001 1.5 1.5 0 0 0 .001 3.001"></path>
          </svg>
          <span className="text-[#303030] font-medium">Settings</span>
        </button>
      </div>
    </aside>
    </>
  );
}
