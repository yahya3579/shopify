'use client';

import { useState } from 'react';
import Header from '../../../../components/Header';
import Sidebar from '../../../../components/Sidebar';
import { ChevronLeft } from 'lucide-react';

export default function AddCollection() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collectionType, setCollectionType] = useState('manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('BEST_SELLING');

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
            <div className="max-w-[1200px] mx-auto px-30 py-6">
              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  {/* Collections Link */}
                  <a 
                    href="/adminDashboard/Collections" 
                    className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Collections"
                  >
                    <svg className="w-4 h-4 text-[#303030]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M9.5 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
                      <path fillRule="evenodd" d="M5.517 2.098a3.75 3.75 0 0 1 2.652-1.098h2.081a2.75 2.75 0 0 1 2.75 2.75v2.289c0 .862-.342 1.688-.952 2.298l-4.206 4.206a2.5 2.5 0 0 1-3.536 0l-2.672-2.673a2.75 2.75 0 0 1 0-3.889zm2.652.402c-.597 0-1.17.237-1.591.659l-3.883 3.883a1.25 1.25 0 0 0 0 1.768l2.672 2.672a1 1 0 0 0 1.414 0l4.206-4.206c.329-.328.513-.773.513-1.237v-2.289c0-.69-.56-1.25-1.25-1.25z"></path>
                      <path d="M14.75 3.5a.75.75 0 0 1 .75.75v3.029c0 .87-.348 1.703-.967 2.313l-4.756 4.692a.75.75 0 0 1-1.054-1.067l4.756-4.693c.333-.328.521-.777.521-1.245v-3.029a.75.75 0 0 1 .75-.75"></path>
                    </svg>
                  </a>
                  
                  {/* Breadcrumb Separator */}
                  <svg width="10" height="20" viewBox="0 0 10 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="flex-shrink-0">
                    <path d="M4 8L6.5 11L4 14" stroke="#8A8A8A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  
                  {/* Page Title */}
                  <h1 className="text-[20px] font-semibold text-[#303030]" tabIndex="-1">Add collection</h1>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="flex gap-6">
                {/* Left Column - Main Content */}
                <div className="flex-1 space-y-6">
                  {/* Title Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-[14px] font-medium text-[#303030] mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          placeholder="e.g., Summer collection, Under $100, Staff picks"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[14px] font-medium text-[#303030] mb-2">
                          Description
                        </label>
                        <div className="border border-[#c9cccf] rounded-lg overflow-hidden">
                          {/* Rich Text Editor Toolbar */}
                          <div className="bg-[#f6f6f7] border-b border-[#c9cccf] px-3 py-2 flex items-center gap-2 flex-wrap">
                            <button className="flex items-center gap-1 px-2 py-1 text-[12px] text-[#303030] hover:bg-gray-200 rounded">
                              Paragraph
                              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" d="M4.24 6.2a.75.75 0 0 1 1.06.04l2.7 2.908 2.7-2.908a.75.75 0 0 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 0 1 .04-1.06"></path>
                              </svg>
                            </button>
                            <div className="w-px h-4 bg-[#c9cccf]"></div>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" d="M5 1a1.5 1.5 0 0 0-1.5 1.5v10.461c0 .85.689 1.539 1.538 1.539h4.462a3.999 3.999 0 0 0 2.316-7.262 3.999 3.999 0 0 0-3.316-6.238zm3.5 5.5a1.5 1.5 0 0 0 0-3h-2.5v3zm-2.5 2.5v3h3.5a1.5 1.5 0 0 0 0-3z"></path>
                              </svg>
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M5.5 2.25a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-2.344l-2.273 10h2.117a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5h2.345l2.272-10h-2.117a.75.75 0 0 1-.75-.75"></path>
                              </svg>
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M5.25 1.75a.75.75 0 0 0-1.5 0v6a4.25 4.25 0 0 0 8.5 0v-6a.75.75 0 0 0-1.5 0v6a2.75 2.75 0 1 1-5.5 0z"></path>
                                <path d="M2.75 13.5a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5z"></path>
                              </svg>
                            </button>
                            <div className="w-px h-4 bg-[#c9cccf]"></div>
                            <button className="flex items-center gap-1 p-1 hover:bg-gray-200 rounded">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" d="M8 1a.75.75 0 0 1 .686.447l4.2 9.5a.75.75 0 1 1-1.372.606l-1.35-3.053h-4.328l-1.35 3.053a.75.75 0 1 1-1.372-.607l4.2-9.5a.75.75 0 0 1 .686-.446m0 2.605 1.501 3.395h-3.002z"></path>
                                <path d="M1.825 13.5a.75.75 0 0 0 0 1.5h12.35a.75.75 0 0 0 0-1.5z"></path>
                              </svg>
                              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" d="M4.24 6.2a.75.75 0 0 1 1.06.04l2.7 2.908 2.7-2.908a.75.75 0 0 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 0 1 .04-1.06"></path>
                              </svg>
                            </button>
                            <button className="flex items-center gap-1 p-1 hover:bg-gray-200 rounded">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z"></path>
                                <path d="M2 5.5a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5z"></path>
                                <path d="M1 9.75a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5h-12.5a.75.75 0 0 1-.75-.75"></path>
                                <path d="M2 12.5a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5z"></path>
                              </svg>
                              <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" d="M4.24 6.2a.75.75 0 0 1 1.06.04l2.7 2.908 2.7-2.908a.75.75 0 0 1 1.1 1.02l-3.25 3.5a.75.75 0 0 1-1.1 0l-3.25-3.5a.75.75 0 0 1 .04-1.06"></path>
                              </svg>
                            </button>
                            <div className="w-px h-4 bg-[#c9cccf]"></div>
                            <button className="p-1 hover:bg-gray-200 rounded opacity-50 cursor-not-allowed">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" d="M13.842 2.176a3.746 3.746 0 0 0-5.298 0l-2.116 2.116a3.75 3.75 0 0 0 .01 5.313l.338.337a.751.751 0 0 0 1.057-1.064l-.339-.338a2.25 2.25 0 0 1-.005-3.187l2.116-2.117a2.247 2.247 0 1 1 3.173 3.18l-1.052 1.048a.749.749 0 1 0 1.057 1.063l1.053-1.047a3.745 3.745 0 0 0 .006-5.304m-11.664 11.67a3.75 3.75 0 0 0 5.304 0l2.121-2.122a3.75 3.75 0 0 0 0-5.303l-.362-.362a.749.749 0 1 0-1.06 1.06l.361.363c.88.878.88 2.303 0 3.182l-2.12 2.121a2.25 2.25 0 0 1-3.183-3.182l1.07-1.069a.75.75 0 0 0-1.062-1.06l-1.069 1.068a3.75 3.75 0 0 0 0 5.304"></path>
                              </svg>
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M10.5 7a1.5 1.5 0 1 0-.001-3.001 1.5 1.5 0 0 0 .001 3.001"></path>
                                <path fillRule="evenodd" d="M7.018 1.5h1.964c.813 0 1.469 0 2 .043.546.045 1.026.14 1.47.366.706.36 1.28.933 1.64 1.639.226.444.32.924.365 1.47.043.531.043 1.187.043 2v1.964c0 .813 0 1.469-.043 2-.045.546-.14 1.026-.366 1.47a3.76 3.76 0 0 1-1.638 1.64c-.445.226-.925.32-1.471.365-.531.043-1.187.043-2 .043h-1.964c-.813 0-1.469 0-2-.043-.546-.045-1.026-.14-1.47-.366a3.76 3.76 0 0 1-1.64-1.638c-.226-.445-.32-.925-.365-1.471-.043-.531-.043-1.187-.043-2v-1.964c0-.813 0-1.469.043-2 .045-.546.14-1.026.366-1.47.36-.706.933-1.28 1.639-1.64.444-.226.924-.32 1.47-.365.531-.043 1.187-.043 2-.043m-1.877 1.538c-.454.037-.715.107-.912.207a2.25 2.25 0 0 0-.984.984c-.1.197-.17.458-.207.912-.037.462-.038 1.057-.038 1.909v1.429l.723-.868a1.75 1.75 0 0 1 2.582-.117l2.695 2.695 1.18-1.18a1.75 1.75 0 0 1 2.604.145l.216.27v-2.374c0-.852 0-1.447-.038-1.91-.037-.453-.107-.714-.207-.911a2.25 2.25 0 0 0-.984-.984c-.197-.1-.458-.17-.912-.207-.462-.037-1.057-.038-1.909-.038h-1.9c-.852 0-1.447 0-1.91.038Zm-2.103 7.821-.006-.08.044-.049 1.8-2.159a.25.25 0 0 1 .368-.016l3.226 3.225a.75.75 0 0 0 1.06 0l1.71-1.71a.25.25 0 0 1 .372.021l1.213 1.516q-.032.09-.07.165c-.216.423-.56.767-.984.983-.197.1-.458.17-.912.207-.462.037-1.057.038-1.909.038h-1.9c-.852 0-1.447 0-1.91-.038-.453-.037-.714-.107-.911-.207a2.25 2.25 0 0 1-.984-.984c-.1-.197-.17-.458-.207-.912"></path>
                              </svg>
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" d="M11.875 8.65a.752.752 0 0 0 0-1.3l-5.25-3.03a.75.75 0 0 0-.75 0 .75.75 0 0 0-.375.649v6.062a.752.752 0 0 0 1.125.65zm-4.875 1.082v-3.464l3 1.732z"></path>
                                <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14 7 7 0 0 0 0-14m-5.5 7a5.5 5.5 0 1 1 11 0 5.5 5.5 0 1 1-11 0"></path>
                              </svg>
                            </button>
                            <div className="w-px h-4 bg-[#c9cccf]"></div>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M4 8a1.5 1.5 0 1 1-3.001-.001 1.5 1.5 0 0 1 3.001.001"></path>
                                <path d="M9.5 8a1.5 1.5 0 1 1-3.001-.001 1.5 1.5 0 0 1 3.001.001"></path>
                                <path d="M13.5 9.5a1.5 1.5 0 1 0-.001-3.001 1.5 1.5 0 0 0 .001 3.001"></path>
                              </svg>
                            </button>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M10.221 2.956a.75.75 0 0 0-1.442-.412l-3 10.5a.75.75 0 0 0 1.442.412z"></path>
                                <path d="M5.03 4.22a.75.75 0 0 1 0 1.06l-2.72 2.72 2.72 2.72a.749.749 0 1 1-1.06 1.06l-3.25-3.25a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0"></path>
                                <path d="M10.97 11.78a.75.75 0 0 1 0-1.06l2.72-2.72-2.72-2.72a.749.749 0 1 1 1.06-1.06l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0"></path>
                              </svg>
                            </button>
                          </div>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-3 text-[14px] focus:outline-none resize-none"
                            rows="6"
                            style={{ minHeight: '150px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collection Type Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="space-y-4">
                      <h2 className="text-[16px] font-semibold text-[#303030]">Collection type</h2>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            id="manual"
                            name="collectionType"
                            value="manual"
                            checked={collectionType === 'manual'}
                            onChange={(e) => setCollectionType(e.target.value)}
                            className="mt-1 w-4 h-4 text-[#005bd3] border-gray-300 focus:ring-[#005bd3]"
                          />
                          <div className="flex-1">
                            <label htmlFor="manual" className="text-[14px] font-medium text-[#303030]">
                              Manual
                            </label>
                            <p className="text-[13px] text-[#616161] mt-1">
                              Add products to this collection one by one. Learn more about{' '}
                              <a href="#" className="text-[#005bd3] hover:underline">manual collections</a>.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            id="smart"
                            name="collectionType"
                            value="smart"
                            checked={collectionType === 'smart'}
                            onChange={(e) => setCollectionType(e.target.value)}
                            className="mt-1 w-4 h-4 text-[#005bd3] border-gray-300 focus:ring-[#005bd3]"
                          />
                          <div className="flex-1">
                            <label htmlFor="smart" className="text-[14px] font-medium text-[#303030]">
                              Smart
                            </label>
                            <p className="text-[13px] text-[#616161] mt-1">
                              Existing and future products that match the conditions you set will automatically be added to this collection. Learn more about{' '}
                              <a href="#" className="text-[#005bd3] hover:underline">smart collections</a>.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="space-y-4">
                      <h2 className="text-[16px] font-semibold text-[#303030]">Products</h2>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#616161]" viewBox="0 0 16 16" fill="currentColor">
                              <path fillRule="evenodd" d="M10.323 11.383a5.5 5.5 0 1 1-3.323-9.883 5.5 5.5 0 0 1 4.383 8.823l2.897 2.897a.749.749 0 1 1-1.06 1.06zm.677-4.383c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4"></path>
                            </svg>
                            <input
                              type="text"
                              placeholder="Search products"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] focus:border-transparent"
                            />
                          </div>
                        </div>
                        <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[14px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Browse
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] text-[#303030]">Sort:</span>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="px-3 py-1 border border-[#c9cccf] rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        >
                          <option value="BEST_SELLING">Best selling</option>
                          <option value="ALPHA_ASC">Product title A-Z</option>
                          <option value="ALPHA_DESC">Product title Z-A</option>
                          <option value="PRICE_DESC">Highest price</option>
                          <option value="PRICE_ASC">Lowest price</option>
                          <option value="CREATED_DESC">Newest</option>
                          <option value="CREATED">Oldest</option>
                          <option value="MANUAL">Manually</option>
                        </select>
                      </div>
                      
                      {/* Empty State */}
                      <div className="flex flex-col items-center justify-center py-12 bg-[#f6f6f7] rounded-lg">
                        <img 
                          src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/tag-icon-DRV-C5YVuJdV.svg" 
                          alt="No Products" 
                          className="w-16 h-16 mb-4"
                        />
                        <p className="text-[14px] text-[#303030] font-medium">There are no products in this collection.</p>
                        <p className="text-[14px] text-[#303030]">Search or browse to add products.</p>
                      </div>
                    </div>
                  </div>

                  {/* Search Engine Listing Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-[16px] font-semibold text-[#303030]">Search engine listing</h2>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <path fillRule="evenodd" d="M13.655 2.344a2.694 2.694 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.009.01-5.88 5.88a2.75 2.75 0 0 0-.806 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.54a2.694 2.694 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88zm2.75.629.599-.599a1.196 1.196 0 0 0-1.69-1.69l-.598.6z"></path>
                          </svg>
                        </button>
                      </div>
                      <p className="text-[14px] text-[#616161]">
                        Add a title and description to see how this collection might appear in a search engine listing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="w-80 space-y-6">
                  {/* Publishing Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-[16px] font-semibold text-[#303030]">Publishing</h2>
                        <button className="text-[#005bd3] text-[14px] hover:underline">
                          Manage
                        </button>
                      </div>
                      <div>
                        <h3 className="text-[14px] font-medium text-[#303030] mb-2">Sales channels</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-[#f6f6f7] rounded">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border border-[#c9cccf] rounded-full"></div>
                              <span className="text-[14px] text-[#303030]">Online Store</span>
                            </div>
                            <button className="p-1 hover:bg-gray-200 rounded">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" d="M4 .25a.75.75 0 0 1 .75.75v.528c.487-.028 1.07-.028 1.768-.028h2.482v-.5a.75.75 0 0 1 1.5 0v.604a3.04 3.04 0 0 1 2.25 2.936c0 .835-.678 1.513-1.513 1.513h-8.733c-.004.288-.004.617-.004.997v2.468c0 1.233 1 2.232 2.232 2.232a.75.75 0 0 1 0 1.5 3.73 3.73 0 0 1-3.732-3.732v-2.5c0-.813 0-1.469.043-2 .045-.546.14-1.026.366-1.47a3.75 3.75 0 0 1 1.841-1.733v-.815a.75.75 0 0 1 .75-.75m7.237 4.303h-8.61c.033-.13.072-.234.118-.324a2.25 2.25 0 0 1 .984-.984c.197-.1.458-.17.912-.207.462-.037 1.057-.038 1.909-.038h3.16c.85 0 1.54.69 1.54 1.54v.005l-.004.004-.004.003z"></path>
                                <path d="M12.25 10a.75.75 0 0 0-1.5 0v1.293c0 .331.132.65.366.884l.854.853a.749.749 0 1 0 1.06-1.06l-.78-.78z"></path>
                                <path fillRule="evenodd" d="M11.5 16a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m0-1.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6"></path>
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-[#f6f6f7] rounded">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border border-[#c9cccf] rounded-full"></div>
                              <span className="text-[14px] text-[#303030]">Point of Sale</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="space-y-4">
                      <h2 className="text-[18px] font-semibold text-[#303030]">Image</h2>
                      <div className="border-2 border-dashed border-[#c9cccf] rounded-lg p-8 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[14px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
                            Add image
                          </button>
                          <p className="text-[13px] text-[#616161]">or drop an image to upload</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Theme Template Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="space-y-4">
                      <h2 className="text-[16px] font-semibold text-[#303030]">Theme template</h2>
                      <select className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]">
                        <option value="">Default collection</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button 
                  disabled={!title.trim()}
                  className={`px-4 py-2 text-[14px] font-semibold rounded-lg transition-colors ${
                    title.trim() 
                      ? 'bg-[#303030] text-white hover:bg-[#1a1a1a]' 
                      : 'bg-[#c9cccf] text-[#616161] cursor-not-allowed'
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
