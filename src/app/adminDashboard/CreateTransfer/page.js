'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { ChevronDown, Search, Calendar, Edit, Barcode, ChevronLeft, ChevronRight, X, PlusCircle, XCircle, Info } from 'lucide-react';
import { useRef, useEffect } from 'react';

export default function CreateTransferPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [searchProducts, setSearchProducts] = useState('');
  const [dateCreated, setDateCreated] = useState('2025-10-24');
  const [referenceName, setReferenceName] = useState('');
  const [tags, setTags] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date('2025-10-24'));
  const [currentMonth, setCurrentMonth] = useState(new Date('2025-10-24'));
  const [notes, setNotes] = useState('');
  const [noteText, setNoteText] = useState('');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddTagsModal, setShowAddTagsModal] = useState(false);
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [modalSelectedTags, setModalSelectedTags] = useState([]);
  
  // Refs for click outside detection
  const addNoteModalRef = useRef(null);
  const addTagsModalRef = useRef(null);

  // Calendar functions
  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDateCreated(formatDate(date));
    setShowCalendar(false);
  };

  const getCurrentMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  // Click outside handler for add note modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addNoteModalRef.current && !addNoteModalRef.current.contains(event.target)) {
        setShowAddNoteModal(false);
      }
    };

    if (showAddNoteModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddNoteModal]);

  // Click outside handler for add tags modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addTagsModalRef.current && !addTagsModalRef.current.contains(event.target)) {
        setShowAddTagsModal(false);
      }
    };

    if (showAddTagsModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddTagsModal]);

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
            <div className="max-w-[1200px] mx-auto px-12 py-6 pb-12">
              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <a 
                    href="/adminDashboard/Transfers"
                    className="flex items-center gap-2 text-[#0a0a0a] hover:underline"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M1.75 2a.75.75 0 0 1 .75.75v4.5h6.69l-1.72-1.72a.749.749 0 1 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.749.749 0 1 1-1.06-1.06l1.72-1.72h-6.69v4.5a.75.75 0 0 1-1.5 0v-10.5a.75.75 0 0 1 .75-.75"></path>
                      <path d="M14.25 2a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-1.5 0v-10.5a.75.75 0 0 1 .75-.75"></path>
                    </svg>
                    {/* <span className="text-[14px] font-medium">Transfers</span> */}
                  </a>
                  <ChevronDown className="w-4 h-4 text-[#8A8A8A] rotate-[-90deg]" />
                  <h1 className="text-[20px] font-semibold text-[#303030]">Create transfer</h1>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="col-span-2 space-y-6">
                  {/* Origin and Destination Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 pt-6 pb-6">
                      {/* <h2 className="text-[16px] font-semibold text-[#303030] mb-4">Origin and destination</h2> */}
                      <div className="flex">
                        {/* Origin Section */}
                        <div className="flex-1 pr-4">
                          <label className="block text-[14px] font-medium text-[#303030] mb-2">Origin</label>
                          <button className="w-full flex items-center justify-between px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] text-[#6d7175] hover:bg-gray-50 transition-colors">
                            <span>Select origin</span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px bg-[#e1e1e1] mx-4"></div>
                        
                        {/* Destination Section */}
                        <div className="flex-1 pl-4">
                          <label className="block text-[14px] font-medium text-[#303030] mb-2">Destination</label>
                          <button className="w-full flex items-center justify-between px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] text-[#6d7175] hover:bg-gray-50 transition-colors">
                            <span>Select destination</span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add Products Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-[14px] font-semibold text-[#303030] mb-4">Add products</h2>
                      <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                          <Search className="w-4 h-4 text-[#6d7175] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search products"
                            value={searchProducts}
                            onChange={(e) => setSearchProducts(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                          />
                        </div>
                        
                        {/* Action Buttons */}
                        <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[14px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Browse
                        </button>
                        <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[14px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Import
                        </button>
                        <button className="p-2 border border-[#c9cccf] text-[#303030] rounded-lg hover:bg-gray-50 transition-colors">
                          <Barcode className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6 overflow-visible">
                  {/* Notes Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[14px] font-semibold text-[#303030]">Notes</h2>
                        <button 
                          onClick={() => setShowAddNoteModal(true)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4 text-[#6d7175]" />
                        </button>
                      </div>
                      <p className="text-[14px] text-[#6d7175]">{notes || 'No notes'}</p>
                    </div>
                  </div>

                  {/* Transfer Details Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-visible">
                    <div className="p-6 pb-8">
                      <h2 className="text-[14px] font-semibold text-[#303030] mb-4">Transfer details</h2>
                      <div className="space-y-4">
                        {/* Date Created */}
                        <div className="relative">
                          <label className="block text-[14px] font-medium text-[#303030] mb-2">Date created</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={dateCreated}
                              onChange={(e) => setDateCreated(e.target.value)}
                              className="w-full px-3 py-2 pr-10 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                            />
                            <button
                              onClick={() => setShowCalendar(!showCalendar)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Calendar className="w-4 h-4 text-[#6d7175]" />
                            </button>
                          </div>

                          {/* Calendar Dropdown */}
                          {showCalendar && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-[#c9cccf] rounded-lg shadow-lg z-[9999] w-64 overflow-hidden">
                              {/* Calendar Header */}
                              <div className="flex items-center justify-between p-3 border-b border-[#e1e1e1]">
                                <button
                                  onClick={() => navigateMonth(-1)}
                                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                                >
                                  <ChevronLeft className="w-4 h-4 text-[#6d7175]" />
                                </button>
                                <h3 className="text-[14px] font-semibold text-[#303030]">
                                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </h3>
                                <button
                                  onClick={() => navigateMonth(1)}
                                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                                >
                                  <ChevronRight className="w-4 h-4 text-[#6d7175]" />
                                </button>
                              </div>

                              {/* Days of Week */}
                              <div className="grid grid-cols-7 gap-1 p-2">
                                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                                  <div key={day} className="text-center text-[12px] text-[#6d7175] font-medium py-1">
                                    {day}
                                  </div>
                                ))}
                              </div>

                              {/* Calendar Dates */}
                              <div className="grid grid-cols-7 gap-1 p-2">
                                {getCurrentMonthDates().map((date, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleDateSelect(date)}
                                    className={`text-[12px] py-1 rounded transition-colors ${
                                      isSelected(date)
                                        ? 'bg-[#005bd3] text-white'
                                        : isToday(date)
                                        ? 'bg-[#f0f0f0] text-[#303030] font-semibold'
                                        : isCurrentMonth(date)
                                        ? 'text-[#303030] hover:bg-gray-100'
                                        : 'text-[#6d7175] hover:bg-gray-50'
                                    }`}
                                  >
                                    {date.getDate()}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Reference Name */}
                        <div>
                          <label className="block text-[14px] font-medium text-[#303030] mb-2">Reference name</label>
                          <input
                            type="text"
                            value={referenceName}
                            onChange={(e) => setReferenceName(e.target.value)}
                            className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[14px] font-semibold text-[#303030]">Tags</h2>
                        <button 
                          onClick={() => {
                            setModalSelectedTags([...selectedTags]);
                            setShowAddTagsModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4 text-[#6d7175]" />
                        </button>
                      </div>
                      <div>
                        {selectedTags.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedTags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-[#303030] text-[12px] rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[14px] text-[#6d7175]">No tags</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div 
            ref={addNoteModalRef}
            className="bg-white rounded-lg shadow-lg max-w-[500px] w-full mx-4 max-h-[80vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-[#f6f6f7] px-6 py-4 border-b border-[#e1e1e1]">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#303030]">Add note</h2>
                <button
                  onClick={() => setShowAddNoteModal(false)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-[#6d7175]" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] font-medium text-[#303030] mb-2">Note</label>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] resize-none"
                    rows={8}
                    placeholder="Enter your note..."
                    maxLength={5000}
                  />
                  <div className="text-right mt-1">
                    <span className="text-[12px] text-[#6d7175]">{noteText.length}/5000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#e1e1e1] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">   
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddNoteModal(false)}
                    className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[12px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setNotes(noteText);
                      setShowAddNoteModal(false);
                    }}
                    className="px-4 py-2 bg-[#050505] text-white text-[12px] font-semibold rounded-lg hover:bg-[#0d0d0e] transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Tags Modal */}
      {showAddTagsModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div 
            ref={addTagsModalRef}
            className="bg-white rounded-lg shadow-lg max-w-[500px] w-full mx-4 max-h-[80vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-[#f6f6f7] px-6 py-4 border-b border-[#e1e1e1]">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-[#303030]">Add tags</h2>
                <button
                  onClick={() => setShowAddTagsModal(false)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-[#6d7175]" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#6d7175] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tagSearchTerm}
                    onChange={(e) => setTagSearchTerm(e.target.value)}
                    placeholder="Search to find or create tags"
                    maxLength={40}
                    className="w-full pl-9 pr-20 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-[12px] text-[#6d7175]">{tagSearchTerm.length}/40</span>
                    {tagSearchTerm && (
                      <button
                        onClick={() => setTagSearchTerm('')}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <XCircle className="w-4 h-4 text-[#6d7175]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Add Tag Button */}
                {tagSearchTerm && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        if (tagSearchTerm.trim() && !modalSelectedTags.includes(tagSearchTerm.trim())) {
                          setModalSelectedTags([...modalSelectedTags, tagSearchTerm.trim()]);
                          setTagSearchTerm('');
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-1 text-[#005bd3] text-[14px] hover:bg-gray-50 rounded transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add "{tagSearchTerm}"
                    </button>
                  </div>
                )}

                {/* Newly Added Tags Section */}
                {modalSelectedTags.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-[14px] font-medium text-[#303030]">Newly added</h3>
                    <div className="space-y-2">
                      {modalSelectedTags.map((tag, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`tag-${index}`}
                            checked={true}
                            onChange={(e) => {
                              if (!e.target.checked) {
                                setModalSelectedTags(modalSelectedTags.filter((_, i) => i !== index));
                              }
                            }}
                            className="w-4 h-4 text-[#005bd3] border-[#c9cccf] rounded focus:ring-[#005bd3] focus:ring-2"
                          />
                          <label htmlFor={`tag-${index}`} className="text-[14px] text-[#303030] cursor-pointer">
                            {tag}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Tags Found */}
                {modalSelectedTags.length === 0 && (
                  <div className="text-center">
                    <p className="text-[14px] text-[#6d7175]">No tags found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#e1e1e1] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#6d7175]" />
                  <span className="text-[12px] text-[#6d7175]">Unsaved changes</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowAddTagsModal(false);
                      setTagSearchTerm('');
                    }}
                    className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[12px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTags(modalSelectedTags);
                      setShowAddTagsModal(false);
                      setTagSearchTerm('');
                    }}
                    className="px-4 py-2 bg-[#303030] text-white text-[12px] font-semibold rounded-lg hover:bg-[#004494] transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
