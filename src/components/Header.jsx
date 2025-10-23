'use client';

import { Plus } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-[#1a1a1a] text-white h-14 flex items-center justify-between px-4 border-b border-[#2d2d2d]">
      {/* Left Side - Logo */}
      <div className="flex items-center gap-4">
        {/* Shopify Logo */}
        <div className="flex items-center gap-2">
          <img 
            src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/shopify-glyph-white-DZNyE9BvHIk-.svg" 
            alt="Shopify" 
            className="w-6 h-6"
          />
          <img 
            src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/shopify-wordmark-monochrome-CpVsfBAAmxEP.svg" 
            alt="Shopify" 
            className="h-5"
          />
        </div>
      </div>

      {/* Center - Search Bar and View as Button */}
      <div className="flex-1 flex items-center justify-center gap-3 max-w-3xl mx-auto">
        {/* Search Bar */}
        <div className="w-full max-w-xl">
          <button className="w-full flex items-center justify-between bg-[#303030] hover:bg-[#404040] rounded-lg px-3 py-2 text-sm transition-colors">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M10.323 11.383a5.5 5.5 0 1 1-3.323-9.883 5.5 5.5 0 0 1 4.383 8.823l2.897 2.897a.749.749 0 1 1-1.06 1.06zm.677-4.383c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4"></path>
              </svg>
              <span className="text-white">Search</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-xs font-mono text-gray-400 bg-[#404040] rounded-md border border-[#555]">CTRL</kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-mono text-gray-400 bg-[#404040] rounded-md border border-[#555]">K</kbd>
            </div>
          </button>
        </div>

        {/* View as Button */}
        <button className="flex items-center gap-2 px-3 py-2 bg-[#303030] rounded-lg text-sm hover:bg-[#404040] transition-colors whitespace-nowrap">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-1.5 0a1.5 1.5 0 1 1-3.001-.001 1.5 1.5 0 0 1 3.001.001"></path>
            <path fillRule="evenodd" d="M8 2c-2.476 0-4.348 1.23-5.577 2.532a9.3 9.3 0 0 0-1.4 1.922 6 6 0 0 0-.37.818c-.082.227-.153.488-.153.728s.071.501.152.728c.088.246.213.524.371.818.317.587.784 1.27 1.4 1.922 1.229 1.302 3.1 2.532 5.577 2.532s4.348-1.23 5.577-2.532a9.3 9.3 0 0 0 1.4-1.922c.158-.294.283-.572.37-.818.082-.227.153-.488.153-.728s-.071-.501-.152-.728a6 6 0 0 0-.371-.818a9.3 9.3 0 0 0-1.4-1.922c-1.229-1.302-3.1-2.532-5.577-2.532m-5.999 6.002v-.004c.004-.02.017-.09.064-.223.058-.161.15-.369.278-.608a7.8 7.8 0 0 1 1.17-1.605c1.042-1.104 2.545-2.062 4.487-2.062s3.445.958 4.486 2.062c.52.55.912 1.126 1.17 1.605.13.24.221.447.279.608.047.132.06.203.064.223v.004c-.004.02-.017.09-.064.223-.058.161-.15.369-.278.608a7.8 7.8 0 0 1-1.17 1.605c-1.042 1.104-2.545 2.062-4.487 2.062s-3.445-.958-4.486-2.062a7.7 7.7 0 0 1-1.17-1.605 4.5 4.5 0 0 1-.279-.608c-.047-.132-.06-.203-.064-.223"></path>
          </svg>
          <span className="text-white font-medium">View as</span>
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button className="relative">
          <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="m5.252 12.424-2.446-.281c-1.855-.213-2.38-2.659-.778-3.616l.065-.038a2.89 2.89 0 0 0 1.407-2.48v-.509a4.5 4.5 0 0 1 9 0v.51c0 1.016.535 1.958 1.408 2.479l.065.038c1.602.957 1.076 3.403-.778 3.616l-2.543.292v.365a2.7 2.7 0 0 1-5.4 0zm3.9.076h-2.4v.3a1.2 1.2 0 1 0 2.4 0zm-3.152-1.5h4l3.024-.348a.452.452 0 0 0 .18-.837l-.065-.038a4.4 4.4 0 0 1-.674-.495l-.073-.067a4.4 4.4 0 0 1-1.392-3.205v-.51a3 3 0 1 0-6 0v.51a4.4 4.4 0 0 1-1.391 3.205l-.073.067a4.6 4.6 0 0 1-.674.495l-.065.038a.453.453 0 0 0 .18.838z"></path>
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#fd5749] rounded-full flex items-center justify-center text-[10px] font-semibold">
            1
          </span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="relative">
            <span className="w-8 h-8 rounded-lg bg-[#95bf47] flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 40 40">
                <text className="fill-current" x="50%" y="50%" dy="0.35em" textAnchor="middle">MS</text>
              </svg>
            </span>
          </div>
          <span className="text-sm font-medium text-white">My Store</span>
        </div>
      </div>
    </header>
  );
}
