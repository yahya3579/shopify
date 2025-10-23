'use client';

import { useState } from 'react';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';

export default function Collections() {
  const [selectedCollections, setSelectedCollections] = useState([]);

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
                  {/* Title with Icon */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#000000]" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M9.5 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
                        <path fillRule="evenodd" d="M5.517 2.098a3.75 3.75 0 0 1 2.652-1.098h2.081a2.75 2.75 0 0 1 2.75 2.75v2.289c0 .862-.342 1.688-.952 2.298l-4.206 4.206a2.5 2.5 0 0 1-3.536 0l-2.672-2.673a2.75 2.75 0 0 1 0-3.889zm2.652.402c-.597 0-1.17.237-1.591.659l-3.883 3.883a1.25 1.25 0 0 0 0 1.768l2.672 2.672a1 1 0 0 0 1.414 0l4.206-4.206c.329-.328.513-.773.513-1.237v-2.289c0-.69-.56-1.25-1.25-1.25z"></path>
                        <path d="M14.75 3.5a.75.75 0 0 1 .75.75v3.029c0 .87-.348 1.703-.967 2.313l-4.756 4.692a.75.75 0 0 1-1.054-1.067l4.756-4.693c.333-.328.521-.777.521-1.245v-3.029a.75.75 0 0 1 .75-.75"></path>
                      </svg>
                    </div>
                    <h1 className="text-[20px] font-semibold text-[#303030]" tabIndex="-1">Collections</h1>
                  </div>

                  {/* Add Collection Button */}
                  <a 
                    href="/adminDashboard/Collections/AddCollection"
                    className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors"
                  >
                    Add collection
                  </a>
                </div>
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Index Filters */}
                <div className="border-b border-[#e1e1e1]">
                  <div className="px-4 py-2 flex items-center justify-between">
                    {/* Tabs */}
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-[13px] font-medium text-[#303030] bg-[#f1f1f1] rounded-lg">
                        All
                      </button>
                      <button className="p-1.5 text-[#5c5f62] hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5z"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-[#5c5f62] hover:bg-gray-100 rounded flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path fillRule="evenodd" d="M10.323 11.383a5.5 5.5 0 1 1-3.323-9.883 5.5 5.5 0 0 1 4.383 8.823l2.897 2.897a.749.749 0 1 1-1.06 1.06zm.677-4.383c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4"></path>
                        </svg>
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M1 4a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5h-12.5a.75.75 0 0 1-.75-.75"></path>
                          <path d="M4.75 12a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75"></path>
                          <path d="M3.5 7.25a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5z"></path>
                        </svg>
                      </button>
                      <button className="p-1.5 text-[#5c5f62] hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M5.75 4.06v7.69a.75.75 0 0 1-1.5 0v-7.69l-1.72 1.72a.749.749 0 1 1-1.06-1.06l3-3a.75.75 0 0 1 1.06 0l3 3a.749.749 0 1 1-1.06 1.06z"></path>
                          <path d="M11.75 4.25a.75.75 0 0 0-1.5 0v7.69l-1.72-1.72a.749.749 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.749.749 0 1 0-1.06-1.06l-1.72 1.72z"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#fafbfb] border-b border-[#e1e1e1]">
                      <tr>
                        <th className="w-10 px-4 py-2">
                          <input type="checkbox" className="w-4 h-4 rounded border-[#c9cccf]" />
                        </th>
                        <th className="w-12 px-2 py-2">
                          <span className="text-[12px] font-medium text-[#616161] sr-only">Image</span>
                        </th>
                        <th className="text-left px-4 py-2">
                          <button className="flex items-center gap-1 text-[12px] font-medium text-[#616161] hover:bg-gray-100 rounded px-1 -ml-1">
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9.116 4.323a1.25 1.25 0 0 1 1.768 0l2.646 2.647a.75.75 0 0 1-1.06 1.06l-2.47-2.47-2.47 2.47a.75.75 0 1 1-1.06-1.06l2.646-2.647Z"></path>
                              <path fillOpacity=".33" fillRule="evenodd" d="M9.116 15.677a1.25 1.25 0 0 0 1.768 0l2.646-2.647a.75.75 0 0 0-1.06-1.06l-2.47 2.47-2.47-2.47a.75.75 0 0 0-1.06 1.06l2.646 2.647Z"></path>
                            </svg>
                            Title
                          </button>
                        </th>
                        <th className="text-left px-4 py-2">
                          <span className="text-[12px] font-medium text-[#616161] ">Products</span>
                        </th>
                        <th className="text-left px-4 py-2">
                          <span className="text-[12px] font-medium text-[#616161] ">Product conditions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#e1e1e1] hover:bg-[#f9fafb] transition-colors">
                        <td className="px-4 py-3">
                          <input type="checkbox" className="w-4 h-4 rounded border-[#c9cccf]" />
                        </td>
                        <td className="px-2 py-3">
                          <div className="w-10 h-10 bg-[#f6f6f7] rounded flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#8a8a8a]" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M10.5 7a1.5 1.5 0 1 0-.001-3.001 1.5 1.5 0 0 0 .001 3.001"></path>
                              <path fillRule="evenodd" d="M7.018 1.5h1.964c.813 0 1.469 0 2 .043.546.045 1.026.14 1.47.366.706.36 1.28.933 1.64 1.639.226.444.32.924.365 1.47.043.531.043 1.187.043 2v1.964c0 .813 0 1.469-.043 2-.045.546-.14 1.026-.366 1.47a3.76 3.76 0 0 1-1.638 1.64c-.445.226-.925.32-1.471.365-.531.043-1.187.043-2 .043h-1.964c-.813 0-1.469 0-2-.043-.546-.045-1.026-.14-1.47-.366a3.76 3.76 0 0 1-1.64-1.638c-.226-.445-.32-.925-.365-1.471-.043-.531-.043-1.187-.043-2v-1.964c0-.813 0-1.469.043-2 .045-.546.14-1.026.366-1.47.36-.706.933-1.28 1.639-1.64.444-.226.924-.32 1.47-.365.531-.043 1.187-.043 2-.043m-1.877 1.538c-.454.037-.715.107-.912.207a2.25 2.25 0 0 0-.984.984c-.1.197-.17.458-.207.912-.037.462-.038 1.057-.038 1.909v1.429l.723-.868a1.75 1.75 0 0 1 2.582-.117l2.695 2.695 1.18-1.18a1.75 1.75 0 0 1 2.604.145l.216.27v-2.374c0-.852 0-1.447-.038-1.91-.037-.453-.107-.714-.207-.911a2.25 2.25 0 0 0-.984-.984c-.197-.1-.458-.17-.912-.207-.462-.037-1.057-.038-1.909-.038h-1.9c-.852 0-1.447 0-1.91.038Zm-2.103 7.821-.006-.08.044-.049 1.8-2.159a.25.25 0 0 1 .368-.016l3.226 3.225a.75.75 0 0 0 1.06 0l1.71-1.71a.25.25 0 0 1 .372.021l1.213 1.516q-.032.09-.07.165c-.216.423-.56.767-.984.983-.197.1-.458.17-.912.207-.462.037-1.057.038-1.909.038h-1.9c-.852 0-1.447 0-1.91-.038-.453-.037-.714-.107-.911-.207a2.25 2.25 0 0 1-.984-.984c-.1-.197-.17-.458-.207-.912"></path>
                            </svg>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <a href="#" className="text-[14px] text-[#303030] hover:underline">
                            Home page
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[14px] text-[#303030]">0</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[14px] text-[#616161]"></span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Help */}
              <div className="mt-6 text-center">
                <button className="text-[13px] text-[#000000] hover:underline font-medium">
                  Learn more about collections
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

