'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { ChevronDown, Search, Edit, Upload, Image, PlayCircle, Link, MoreHorizontal, Code, Trash2, Calendar, Sliders, Info } from 'lucide-react';

export default function CreateGiftCardProductPage() {
  const [title, setTitle] = useState('My Store gift card');
  const [description, setDescription] = useState('');
  const [denominations, setDenominations] = useState(['10.00', '25.00', '50.00', '100.00']);
  const [productType, setProductType] = useState('');
  const [vendor, setVendor] = useState('');
  const [collections, setCollections] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('Active');
  const [themeTemplate, setThemeTemplate] = useState('Default product');
  const [giftCardTemplate, setGiftCardTemplate] = useState('gift_card');

  const addDenomination = () => {
    setDenominations([...denominations, '']);
  };

  const removeDenomination = (index) => {
    setDenominations(denominations.filter((_, i) => i !== index));
  };

  const updateDenomination = (index, value) => {
    const newDenominations = [...denominations];
    newDenominations[index] = value;
    setDenominations(newDenominations);
  };

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
            <div className="max-w-[1400px] mx-auto px-60 py-6">
              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <a 
                    href="/adminDashboard/GiftCards"
                    className="flex items-center gap-2 text-[#3a3a3a] hover:underline"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M13.5 3.5h-5.5v.75a.75.75 0 0 1-1.5 0v-.75h-4a.5.5 0 0 0-.5.5v3.043a.75.75 0 0 1 0 1.414v3.543a.5.5 0 0 0 .5.5h4v-1a.75.75 0 0 1 1.5 0v1h5.5a.5.5 0 0 0 .5-.5v-3.5h-1.25a.75.75 0 0 1 0-1.5h1.25v-3a.5.5 0 0 0-.5-.5m2 4.25v-3.75a2 2 0 0 0-2-2h-11a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2zm-8.703-1.758a2.117 2.117 0 0 0-4.047.88c0 1.171.95 2.128 2.125 2.128h.858c-.595.51-1.256.924-1.84 1.008a.749.749 0 1 0 .213 1.484c1.11-.158 2.128-.919 2.803-1.53a11 11 0 0 0 .341-.322q.16.158.34.322c.676.611 1.693 1.372 2.804 1.53a.749.749 0 1 0 .212-1.484c-.583-.084-1.244-.498-1.839-1.008h.858a2.13 2.13 0 0 0 2.125-2.128 2.118 2.118 0 0 0-4.047-.88l-.453.996zm-.962 1.508h-.96a.627.627 0 0 1-.625-.628.619.619 0 0 1 1.182-.259zm3.79 0h-.96l.403-.887a.618.618 0 0 1 1.182.259.63.63 0 0 1-.625.628"></path>
                    </svg>
                    
                  </a>
                  <ChevronDown className="w-4 h-4 text-[#8A8A8A] rotate-[-90deg]" />
                  <h1 className="text-[24px] font-semibold text-[#303030]">Create gift card product</h1>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="col-span-2 space-y-6">
                  {/* Title Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#303030] mb-2">Title</label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="My Store gift card"
                            className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#303030] mb-2">Description</label>
                          
                          {/* Rich Text Editor Toolbar */}
                          <div className="border border-[#c9cccf] rounded-t-lg bg-gray-50 p-2">
                            <div className="flex items-center gap-2">
                              {/* Magic Wand */}
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <svg className="w-4 h-4 text-[#6d7175]" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M3.702 2.253a.624.624 0 0 1 1.096 0l.196.358c.207.378.517.688.895.895l.358.196a.625.625 0 0 1 0 1.097l-.358.196a2.25 2.25 0 0 0-.895.894l-.196.359a.625.625 0 0 1-1.096 0l-.196-.359a2.25 2.25 0 0 0-.895-.894l-.358-.196a.625.625 0 0 1 0-1.097l.358-.196c.378-.207.688-.517.895-.895z"></path>
                                </svg>
                              </button>
                              <ChevronDown className="w-3 h-3 text-[#6d7175]" />
                              
                              {/* Paragraph Dropdown */}
                              <button className="px-2 py-1 text-[12px] font-medium text-[#303030] hover:bg-gray-200 rounded transition-colors">
                                Paragraph
                                <ChevronDown className="w-3 h-3 text-[#6d7175] ml-1" />
                              </button>
                              
                              {/* Formatting Buttons */}
                              <div className="flex items-center gap-1">
                                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                  <svg className="w-4 h-4 text-[#6d7175]" fill="currentColor" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M5 1a1.5 1.5 0 0 0-1.5 1.5v10.461c0 .85.689 1.539 1.538 1.539h4.462a3.999 3.999 0 0 0 2.316-7.262 3.999 3.999 0 0 0-3.316-6.238zm3.5 5.5a1.5 1.5 0 0 0 0-3h-2.5v3zm-2.5 2.5v3h3.5a1.5 1.5 0 0 0 0-3z"></path>
                                  </svg>
                                </button>
                                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                  <svg className="w-4 h-4 text-[#6d7175]" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.5 2.25a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-2.344l-2.273 10h2.117a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5h2.345l2.272-10h-2.117a.75.75 0 0 1-.75-.75"></path>
                                  </svg>
                                </button>
                                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                  <svg className="w-4 h-4 text-[#6d7175]" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.25 1.75a.75.75 0 0 0-1.5 0v6a4.25 4.25 0 0 0 8.5 0v-6a.75.75 0 0 0-1.5 0v6a2.75 2.75 0 1 1-5.5 0z"></path>
                                    <path d="M2.75 13.5a.75.75 0 0 0 0 1.5h10.5a.75.75 0 0 0 0-1.5z"></path>
                                  </svg>
                                </button>
                              </div>
                              
                              {/* Color Dropdown */}
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <svg className="w-4 h-4 text-[#6d7175]" fill="currentColor" viewBox="0 0 16 16">
                                  <path fillRule="evenodd" d="M8 1a.75.75 0 0 1 .686.447l4.2 9.5a.75.75 0 1 1-1.372.606l-1.35-3.053h-4.328l-1.35 3.053a.75.75 0 1 1-1.372-.607l4.2-9.5a.75.75 0 0 1 .686-.446m0 2.605 1.501 3.395h-3.002z"></path>
                                </svg>
                                <ChevronDown className="w-3 h-3 text-[#6d7175]" />
                              </button>
                              
                              {/* Alignment */}
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <svg className="w-4 h-4 text-[#6d7175]" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M1.75 2a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 0-1.5z"></path>
                                  <path d="M2 5.5a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5z"></path>
                                  <path d="M1 9.75a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5h-12.5a.75.75 0 0 1-.75-.75"></path>
                                  <path d="M2 12.5a.75.75 0 0 0 0 1.5h8a.75.75 0 0 0 0-1.5z"></path>
                                </svg>
                                <ChevronDown className="w-3 h-3 text-[#6d7175]" />
                              </button>
                              
                              {/* Link */}
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors opacity-50 cursor-not-allowed">
                                <Link className="w-4 h-4 text-[#6d7175]" />
                              </button>
                              
                              {/* Image */}
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Image className="w-4 h-4 text-[#6d7175]" />
                              </button>
                              
                              {/* Video */}
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <PlayCircle className="w-4 h-4 text-[#6d7175]" />
                              </button>
                              
                              {/* More Options */}
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <MoreHorizontal className="w-4 h-4 text-[#6d7175]" />
                              </button>
                              
                              {/* HTML */}
                              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                <Code className="w-4 h-4 text-[#6d7175]" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Text Area */}
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-[#c9cccf] border-t-0 rounded-b-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] resize-none"
                            rows={6}
                            placeholder="Enter product description..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#303030] mb-2">Media</label>
                          <div className="border-2 border-dashed border-[#c9cccf] rounded-lg p-8 text-center">
                            <div className="space-y-4">
                              <div className="flex items-center justify-center gap-4">
                                <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[12px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                  Upload new
                                </button>
                                <button className="px-4 py-2 text-[#005bd3] text-[12px] font-medium hover:underline transition-colors">
                                  Select existing
                                </button>
                              </div>
                              <p className="text-[12px] text-[#6d7175]">Accepts images, videos, or 3D models</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#303030] mb-2">Category</label>
                          <input
                            type="text"
                            value="Gift Cards"
                            disabled
                            className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] bg-gray-50 text-[#6d7175] cursor-not-allowed"
                          />
                          <p className="text-[12px] text-[#6d7175] mt-2">
                            Determines tax rates and adds metafields to improve search, filters, and cross-channel sales
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Denominations Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="space-y-4">
                        <h2 className="text-[14px] font-semibold text-[#303030]">Denominations</h2>
                        <div className="space-y-3">
                          {denominations.map((denomination, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="flex-1">
                                <label className="block text-[14px] font-medium text-[#303030] mb-2">Denomination amount</label>
                                <div className="relative">
                                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#6d7175]">Rs</div>
                                  <input
                                    type="text"
                                    value={denomination}
                                    onChange={(e) => updateDenomination(index, e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-8 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                                  />
                                </div>
                              </div>
                              <button
                                onClick={() => removeDenomination(index)}
                                className="p-2 hover:bg-gray-100 rounded transition-colors mt-6"
                              >
                                <Trash2 className="w-4 h-4 text-[#6d7175]" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={addDenomination}
                          className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[12px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Add denomination
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Search Engine Listing Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[14px] font-semibold text-[#303030]">Search engine listing</h2>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <Edit className="w-4 h-4 text-[#6d7175]" />
                        </button>
                      </div>
                      <p className="text-[14px] text-[#6d7175]">
                        Add a title and description to see how this product might appear in a search engine listing
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                  {/* Status Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="space-y-4">
                        <h2 className="text-[14px] font-semibold text-[#303030]">Status</h2>
                        <button className="w-full flex items-center justify-between px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] text-[#303030] hover:bg-gray-50 transition-colors">
                          <span>{status}</span>
                          <ChevronDown className="w-4 h-4 text-[#6d7175]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Publishing Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-[14px] font-semibold text-[#303030]">Publishing</h2>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <Sliders className="w-4 h-4 text-[#6d7175]" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-[#303030] text-[12px] font-medium rounded-full">
                              Online Store
                            </span>
                            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                              <Calendar className="w-3 h-3 text-[#6d7175]" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-[#303030] text-[12px] font-medium rounded-full">
                              Point of Sale
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Organization Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h2 className="text-[14px] font-semibold text-[#303030]">Product organization</h2>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <Info className="w-4 h-4 text-[#6d7175]" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[14px] font-medium text-[#303030] mb-2">Type</label>
                            <input
                              type="text"
                              value={productType}
                              onChange={(e) => setProductType(e.target.value)}
                              className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                            />
                          </div>
                          <div>
                            <label className="block text-[14px] font-medium text-[#303030] mb-2">Vendor</label>
                            <input
                              type="text"
                              value={vendor}
                              onChange={(e) => setVendor(e.target.value)}
                              className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                            />
                          </div>
                          <div>
                            <label className="block text-[14px] font-medium text-[#303030] mb-2">Collections</label>
                            <div className="relative">
                              <Search className="w-4 h-4 text-[#6d7175] absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={collections}
                                onChange={(e) => setCollections(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[14px] font-medium text-[#303030] mb-2">Tags</label>
                            <input
                              type="text"
                              value={tags}
                              onChange={(e) => setTags(e.target.value)}
                              className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Theme Template Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#303030] mb-2">Theme template</label>
                          <select
                            value={themeTemplate}
                            onChange={(e) => setThemeTemplate(e.target.value)}
                            className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                          >
                            <option value="Default product">Default product</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gift Card Template Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[14px] font-medium text-[#303030] mb-2">Gift card template</label>
                          <select
                            value={giftCardTemplate}
                            onChange={(e) => setGiftCardTemplate(e.target.value)}
                            className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                          >
                            <option value="gift_card">gift_card</option>
                          </select>
                          <p className="text-[12px] text-[#6d7175] mt-2">
                            This is what customers see when they redeem a gift card.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 bg-[#2e2e2e] text-white text-[12px] font-semibold rounded-lg hover:bg-[#004494] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Save gift card product
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
