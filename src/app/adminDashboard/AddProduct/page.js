'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { ChevronLeft, ChevronDown } from 'lucide-react';

export default function AddProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [inventoryTracked, setInventoryTracked] = useState(false);
  const [quantity, setQuantity] = useState('0');
  const [physicalProduct, setPhysicalProduct] = useState(false);
  const [weight, setWeight] = useState('0.0');
  const [weightUnit, setWeightUnit] = useState('kg');

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
            <div className="max-w-[1200px] mx-auto px-26 py-6">
              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  {/* Products Link */}
                  <a 
                    href="/adminDashboard" 
                    className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Products"
                  >
                    <svg className="w-4 h-4 text-[#303030]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M11 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
                      <path fillRule="evenodd" d="M9.276 1.5c-1.02 0-1.994.415-2.701 1.149l-4.254 4.417a2.75 2.75 0 0 0 .036 3.852l2.898 2.898a2.5 2.5 0 0 0 3.502.033l4.747-4.571a3.25 3.25 0 0 0 .996-2.341v-2.187a3.25 3.25 0 0 0-3.25-3.25zm-1.62 2.19a2.24 2.24 0 0 1 1.62-.69h1.974c.966 0 1.75.784 1.75 1.75v2.187c0 .475-.194.93-.536 1.26l-4.747 4.572a1 1 0 0 1-1.401-.014l-2.898-2.898a1.25 1.25 0 0 1-.016-1.75l4.253-4.418Z"></path>
                    </svg>
                  </a>
                  
                  {/* Breadcrumb Separator */}
                  <svg width="10" height="20" viewBox="0 0 10 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="flex-shrink-0">
                    <path d="M4 8L6.5 11L4 14" stroke="#8A8A8A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  
                  {/* Page Title */}
                  <h1 className="text-[20px] font-semibold text-[#303030]" tabIndex="-1">Add product</h1>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="flex gap-5">
                {/* Left Column - Main Content */}
                <div className="flex-1 space-y-4">
                  {/* Title, Description, Media, Category Card */}
                  <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        placeholder="Short sleeve t-shirt"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] focus:border-transparent"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[13px] font-medium text-[#303030] mb-1.5">
                        Description
                      </label>
                      <div className="border border-[#c9cccf] rounded-lg overflow-hidden">
                        <div className="bg-[#f6f6f7] border-b border-[#c9cccf] px-2 py-1.5 flex items-center gap-1 flex-wrap">
                          <button className="p-1 hover:bg-[#e1e3e5] rounded text-[11px]" type="button">Paragraph</button>
                          <div className="w-px h-4 bg-[#c9cccf]"></div>
                          <button className="p-1 hover:bg-[#e1e3e5] rounded" type="button"><strong className="text-[11px]">B</strong></button>
                          <button className="p-1 hover:bg-[#e1e3e5] rounded" type="button"><em className="text-[11px]">I</em></button>
                          <button className="p-1 hover:bg-[#e1e3e5] rounded" type="button"><span className="text-[11px] underline">U</span></button>
                        </div>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-3 py-2 text-[13px] focus:outline-none resize-none"
                          rows="6"
                        />
                      </div>
                    </div>

                    {/* Media */}
                    <div>
                      <p className="text-[13px] font-medium text-[#303030] mb-2">Media</p>
                      <div className="border-2 border-dashed border-[#c9cccf] rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 bg-white border border-[#c9cccf] text-[13px] rounded-lg hover:bg-gray-50">
                              Upload new
                            </button>
                            <button className="text-[13px] text-[#000000] hover:underline">
                              Select existing
                            </button>
                          </div>
                          <p className="text-[12px] text-[#6d7175]">Accepts images, videos, or 3D models</p>
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                        Category
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="category"
                          placeholder="Choose a product category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2" type="button">
                          <ChevronDown className="w-4 h-4 text-[#6d7175]" />
                        </button>
                      </div>
                      <p className="text-[12px] text-[#6d7175] mt-1">
                        Determines tax rates and adds metafields to improve search, filters, and cross-channel sales
                      </p>
                    </div>
                  </div>

                  {/* Price Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Price</h2>
                    </div>
                    <div className="p-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#303030]">Rs</span>
                        <input
                          type="text"
                          placeholder="0.00"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </div>
                    </div>
                    <div className="border-t border-[#e1e1e1] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button className="px-3 py-1.5 text-[12px] text-[#6d7175] hover:bg-[#f6f6f7] rounded-lg">Compare at</button>
                          <button className="px-3 py-1.5 text-[12px] text-[#6d7175] hover:bg-[#f6f6f7] rounded-lg">Cost per item</button>
                        </div>
                        <button className="p-1" type="button">
                          <ChevronDown className="w-4 h-4 text-[#6d7175]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inventory Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1] flex items-center justify-between">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Inventory</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#6d7175]">Inventory tracked</span>
                        <button
                          onClick={() => setInventoryTracked(!inventoryTracked)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            inventoryTracked ? 'bg-[#008060]' : 'bg-[#e1e3e5]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              inventoryTracked ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    {inventoryTracked && (
                      <div className="p-4">
                        <div className="border border-[#c9cccf] rounded-lg overflow-hidden">
                          <div className="flex border-b border-[#c9cccf] bg-[#f6f6f7]">
                            <div className="flex-1 px-3 py-2 text-[12px] font-medium text-[#303030]">Location</div>
                            <div className="w-32 px-3 py-2 text-[12px] font-medium text-[#303030] text-right">Quantity</div>
                          </div>
                          <div className="flex">
                            <div className="flex-1 px-3 py-2 text-[13px] text-[#303030]">Shop location</div>
                            <div className="w-32 px-2 py-1">
                              <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full px-2 py-1 border border-[#c9cccf] rounded text-[13px] text-right focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="border-t border-[#e1e1e1] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button className="px-3 py-1.5 text-[12px] text-[#6d7175] hover:bg-[#f6f6f7] rounded-lg">SKU</button>
                          <button className="px-3 py-1.5 text-[12px] text-[#6d7175] hover:bg-[#f6f6f7] rounded-lg">Barcode</button>
                        </div>
                        <button className="p-1" type="button">
                          <ChevronDown className="w-4 h-4 text-[#6d7175]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1] flex items-center justify-between">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Shipping</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#6d7175]">Physical product</span>
                        <button
                          onClick={() => setPhysicalProduct(!physicalProduct)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            physicalProduct ? 'bg-[#008060]' : 'bg-[#e1e3e5]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              physicalProduct ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    {physicalProduct && (
                      <div className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Weight</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="flex-1 px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                              />
                              <select
                                value={weightUnit}
                                onChange={(e) => setWeightUnit(e.target.value)}
                                className="px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                              >
                                <option value="lb">lb</option>
                                <option value="oz">oz</option>
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Variants Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Variants</h2>
                    </div>
                    <div className="p-4">
                      <button className="flex items-center gap-2 text-[13px] text-[#000000] hover:underline">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M4.25 8a.75.75 0 0 1 .75-.75h2.25v-2.25a.75.75 0 0 1 1.5 0v2.25h2.25a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0v-2.25h-2.25a.75.75 0 0 1-.75-.75"></path>
                          <path fillRule="evenodd" d="M8 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14m0-1.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 1 0 0 11"></path>
                        </svg>
                        Add options like size or color
                      </button>
                    </div>
                  </div>

                  {/* SEO Card */}
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Search engine listing</h2>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path fillRule="evenodd" d="M13.655 2.344a2.694 2.694 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.009.01-5.88 5.88a2.75 2.75 0 0 0-.806 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.54a2.694 2.694 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88zm2.75.629.599-.599a1.196 1.196 0 0 0-1.69-1.69l-.598.6z"></path>
                        </svg>
                      </button>
                    </div>
                    <p className="text-[13px] text-[#6d7175]">
                      Add a title and description to see how this product might appear in a search engine listing
                    </p>
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="w-80 space-y-4">
                  {/* Status Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Status</h2>
                    </div>
                    <div className="p-4">
                      <select className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]">
                        <option>Active</option>
                        <option>Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Publishing Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1] flex items-center justify-between">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Publishing</h2>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path fillRule="evenodd" d="M7.095 4.25a3 3 0 0 1 5.81 0h1.345a.75.75 0 0 1 0 1.5h-1.345a3 3 0 0 1-5.81 0h-5.345a.75.75 0 0 1 0-1.5zm1.405.75a1.5 1.5 0 1 1 3.001.001 1.5 1.5 0 0 1-3.001-.001"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-[#f6f6f7] rounded">
                        <span className="text-[12px] text-[#303030]">Online Store</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-[#f6f6f7] rounded">
                        <span className="text-[12px] text-[#303030]">Point of Sale</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Organization Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Product organization</h2>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Type</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Vendor</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Collections</label>
                        <input
                          type="text"
                          placeholder="Search collections"
                          className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Tags</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Theme Template Card */}
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Theme template</label>
                    <select className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]">
                      <option>Default product</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors">
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