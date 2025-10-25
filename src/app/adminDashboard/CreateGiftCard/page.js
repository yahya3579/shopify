'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { ChevronDown, Search, Edit, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function CreateGiftCardPage() {
  const router = useRouter();
  const [giftCardCode, setGiftCardCode] = useState('gfxjkvjppy7xg8gk');
  const [initialValue, setInitialValue] = useState('10.00');
  const [expirationType, setExpirationType] = useState('set-expiration');
  const [customer, setCustomer] = useState('');
  const [notes, setNotes] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [noteText, setNoteText] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const calendarRef = useRef(null);
  const customerDropdownRef = useRef(null);
  const createCustomerModalRef = useRef(null);
  const addNoteModalRef = useRef(null);

  // Calendar functions
  const formatDate = (date) => {
    if (!date) return '';
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setExpirationDate(formatDate(date));
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

  // Generate random gift card code
  const generateGiftCardCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGiftCardCode(code);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccessMessage('');

      // Validation
      if (!giftCardCode || giftCardCode.trim() === '') {
        setError('Gift card code is required');
        setIsLoading(false);
        return;
      }

      if (!initialValue || parseFloat(initialValue) <= 0) {
        setError('Initial value must be greater than 0');
        setIsLoading(false);
        return;
      }

      if (expirationType === 'set-expiration' && !expirationDate) {
        setError('Expiration date is required when expiration type is set');
        setIsLoading(false);
        return;
      }

      // Parse customer data from the customer string or newCustomer object
      let customerData = {
        firstName: newCustomer.firstName || '',
        lastName: newCustomer.lastName || '',
        email: newCustomer.email || '',
        phone: newCustomer.phone || '',
      };

      // Prepare gift card data
      const giftCardData = {
        giftCardCode: giftCardCode.trim(),
        initialValue: parseFloat(initialValue),
        currency: 'Rs',
        expirationType: expirationType,
        expirationDate: expirationType === 'set-expiration' ? expirationDate : null,
        customer: customerData,
        notes: notes || '',
      };

      // Make API call
      const response = await fetch('/api/giftcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(giftCardData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create gift card');
      }

      setSuccessMessage('Gift card created successfully!');
      
      // Redirect to gift cards page after 1.5 seconds
      setTimeout(() => {
        router.push('/adminDashboard/GiftCards');
      }, 1500);

    } catch (err) {
      console.error('Error creating gift card:', err);
      setError(err.message || 'Failed to create gift card');
    } finally {
      setIsLoading(false);
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (customerDropdownRef.current && !customerDropdownRef.current.contains(event.target)) {
        setShowCustomerDropdown(false);
      }
      if (createCustomerModalRef.current && !createCustomerModalRef.current.contains(event.target)) {
        setShowCreateCustomerModal(false);
      }
      if (addNoteModalRef.current && !addNoteModalRef.current.contains(event.target)) {
        setShowAddNoteModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <div className="max-w-[1200px] mx-auto px-12 py-6">
              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <a 
                       href="/adminDashboard/GiftCards"
                       className="flex items-center gap-2 text-[#1b1b1b] hover:underline"
                     >
                       <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                         <path fillRule="evenodd" d="M13.5 3.5h-5.5v.75a.75.75 0 0 1-1.5 0v-.75h-4a.5.5 0 0 0-.5.5v3.043a.75.75 0 0 1 0 1.414v3.543a.5.5 0 0 0 .5.5h4v-1a.75.75 0 0 1 1.5 0v1h5.5a.5.5 0 0 0 .5-.5v-3.5h-1.25a.75.75 0 0 1 0-1.5h1.25v-3a.5.5 0 0 0-.5-.5m2 4.25v-3.75a2 2 0 0 0-2-2h-11a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2zm-8.703-1.758a2.117 2.117 0 0 0-4.047.88c0 1.171.95 2.128 2.125 2.128h.858c-.595.51-1.256.924-1.84 1.008a.749.749 0 1 0 .213 1.484c1.11-.158 2.128-.919 2.803-1.53a11 11 0 0 0 .341-.322q.16.158.34.322c.676.611 1.693 1.372 2.804 1.53a.749.749 0 1 0 .212-1.484c-.583-.084-1.244-.498-1.839-1.008h.858a2.13 2.13 0 0 0 2.125-2.128 2.118 2.118 0 0 0-4.047-.88l-.453.996zm-.962 1.508h-.96a.627.627 0 0 1-.625-.628.619.619 0 0 1 1.182-.259zm3.79 0h-.96l.403-.887a.618.618 0 0 1 1.182.259.63.63 0 0 1-.625.628"></path>
                       </svg>
                       
                     </a>
                    <ChevronDown className="w-4 h-4 text-[#8A8A8A] rotate-[-90deg]" />
                    <h1 className="text-[20px] font-semibold text-[#303030]">Create gift card</h1>
                  </div>
                  
                  {/* Save Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-[14px] text-red-600">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-[14px] text-green-600">{successMessage}</p>
                </div>
              )}

              {/* Main Content Grid */}
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column - 2/3 width */}
                <div className="col-span-2 space-y-6">
                  {/* Gift Card Details Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-[14px] font-semibold text-[#303030] mb-4">Gift card details</h2>
                      <div className="space-y-4">
                        {/* Gift Card Code */}
                        <div>
                          <label className="block text-[14px] font-medium text-[#303030] mb-2">Gift card code</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={giftCardCode}
                              onChange={(e) => setGiftCardCode(e.target.value)}
                              className="flex-1 px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                            />
                            <button
                              type="button"
                              onClick={generateGiftCardCode}
                              className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Generate
                            </button>
                          </div>
                        </div>

                        {/* Initial Value */}
                        <div>
                          <label className="block text-[14px] font-medium text-[#303030] mb-2">Initial value</label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#6d7175]">Rs</div>
                            <input
                              type="text"
                              placeholder="0.00"
                              value={initialValue}
                              onChange={(e) => setInitialValue(e.target.value)}
                              className="w-full pl-8 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                   {/* Expiration Date Card */}
                   <div className="bg-white rounded-xl shadow-sm overflow-visible relative">
                     <div className="p-6 pb-8">
                       <div className="space-y-2 mb-4">
                         <h3 className="text-[14px] font-medium text-[#303030]">Expiration date</h3>
                         <p className="text-[14px] text-[#6d7175]">
                           Countries have different laws for gift card expiry dates. Check the laws for your country before changing this date.
                         </p>
                       </div>
                       
                       <div className="space-y-2">
                         {/* No Expiration Date */}
                         <label className="flex items-center gap-3 cursor-pointer">
                           <input
                             type="radio"
                             name="expiration"
                             value="no-expiration"
                             checked={expirationType === 'no-expiration'}
                             onChange={(e) => setExpirationType(e.target.value)}
                             className="w-4 h-4 text-[#005bd3] focus:ring-[#005bd3]"
                           />
                           <span className="text-[14px] text-[#303030]">No expiration date</span>
                         </label>

                         {/* Set Expiration Date */}
                         <label className="flex items-center gap-3 cursor-pointer">
                           <input
                             type="radio"
                             name="expiration"
                             value="set-expiration"
                             checked={expirationType === 'set-expiration'}
                             onChange={(e) => setExpirationType(e.target.value)}
                             className="w-4 h-4 text-[#005bd3] focus:ring-[#005bd3]"
                           />
                           <span className="text-[14px] text-[#303030]">Set expiration date</span>
                         </label>

                         {/* Expires On Field - Only show when "Set expiration date" is selected */}
                         {expirationType === 'set-expiration' && (
                           <div className="mt-4">
                             <label className="block text-[14px] font-medium text-[#303030] mb-2">Expires on</label>
                             <div className="relative">
                               <input
                                 type="text"
                                 value={expirationDate}
                                 onChange={(e) => setExpirationDate(e.target.value)}
                                 className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                                 placeholder="MM/DD/YYYY"
                               />
                               <button
                                 type="button"
                                 onClick={() => setShowCalendar(!showCalendar)}
                                 className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                               >
                                 <Calendar className="w-4 h-4 text-[#6d7175]" />
                               </button>
                             </div>

                             {/* Calendar Dropdown */}
                             {showCalendar && (
                               <div 
                                 ref={calendarRef}
                                 className="absolute top-full left-0 mt-1 bg-white border border-[#c9cccf] rounded-lg shadow-lg z-[9999] w-64 overflow-hidden"
                               >
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
                         )}
                       </div>
                     </div>
                   </div>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-6">
                   {/* Customer Card */}
                   <div className="bg-white rounded-xl shadow-sm overflow-visible relative">
                     <div className="p-6 pb-8">
                       <h3 className="text-[14px] font-semibold text-[#303030] mb-4">Customer</h3>
                       <div className="relative" ref={customerDropdownRef}>
                         <Search className="w-4 h-4 text-[#6d7175] absolute left-3 top-1/2 -translate-y-1/2" />
                         <input
                           type="text"
                           placeholder="Search or create customer"
                           value={customer}
                           onChange={(e) => setCustomer(e.target.value)}
                           onFocus={() => setShowCustomerDropdown(true)}
                           className="w-full pl-9 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                         />

                         {/* Customer Dropdown */}
                         {showCustomerDropdown && (
                           <div className="absolute top-full left-0 mt-1 bg-white border border-[#c9cccf] rounded-lg shadow-lg z-[9999] w-full overflow-hidden">
                             {/* Create New Customer Button */}
                             <button
                               onClick={() => {
                                 setShowCustomerDropdown(false);
                                 setShowCreateCustomerModal(true);
                               }}
                               className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                             >
                               <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                 <svg className="w-3 h-3 text-[#6d7175]" fill="currentColor" viewBox="0 0 16 16">
                                   <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                 </svg>
                               </div>
                               <span className="text-[14px] text-[#303030]">Create a new customer</span>
                             </button>

                             {/* No Customers Found */}
                             <div className="px-3 py-2">
                               <span className="text-[14px] text-[#6d7175]">No customers found</span>
                             </div>
                           </div>
                         )}
                       </div>
                     </div>
                   </div>

                  {/* Notes Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[14px] font-semibold text-[#303030]">Notes</h2>
                        <button 
                          onClick={() => {
                            setNoteText(notes);
                            setShowAddNoteModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4 text-[#6d7175]" />
                        </button>
                      </div>
                      <p className="text-[14px] text-[#6d7175]">{notes || 'No notes'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Create Customer Modal */}
      {showCreateCustomerModal && (
        <div className="fixed inset-0  flex items-center justify-center z-[9999] " style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div 
            ref={createCustomerModalRef}
            className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Create a new customer"
          >
            {/* Modal Header */}
            <div className="bg-[#f6f6f7] border-b border-[#e1e1e1] p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-[#303030]">Create a new customer</h2>
                <button
                  onClick={() => setShowCreateCustomerModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-[#6d7175]" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[60vh]">
              <div className="p-6">
                <form>
                  {/* First Row - First Name and Last Name */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-[14px] font-medium text-[#303030] mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={newCustomer.firstName}
                        onChange={(e) => setNewCustomer({...newCustomer, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-[#303030] mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={newCustomer.lastName}
                        onChange={(e) => setNewCustomer({...newCustomer, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  {/* Second Row - Email and Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[14px] font-medium text-[#303030] mb-2">Email</label>
                      <input
                        type="text"
                        name="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                        className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-[#303030] mb-2">Phone number</label>
                      <div className="flex">
                        <button
                          type="button"
                          className="px-3 py-2 border border-[#c9cccf] border-r-0 rounded-l-lg bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-2"
                        >
                          <img 
                            src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/pk-C6GKfae7SBqL.svg" 
                            alt="Pakistan (+92)" 
                            className="w-4 h-4"
                          />
                          <ChevronDown className="w-3 h-3 text-[#6d7175]" />
                        </button>
                        <input
                          type="text"
                          name="phone"
                          value={newCustomer.phone}
                          onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                          className="flex-1 px-3 py-2 border border-[#c9cccf] rounded-r-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                          autoComplete="tel"
                          inputMode="tel"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-[#e1e1e1] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateCustomerModal(false)}
                    className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[12px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const customerName = `${newCustomer.firstName} ${newCustomer.lastName}`.trim();
                      setCustomer(customerName);
                      setShowCreateCustomerModal(false);
                      setNewCustomer({ firstName: '', lastName: '', email: '', phone: '' });
                    }}
                    className="px-4 py-2 bg-[#050505] text-white text-[12px] font-semibold rounded-lg hover:bg-[#0d0d0e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newCustomer.firstName || !newCustomer.lastName}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <div 
            ref={addNoteModalRef}
            className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Add note"
          >
            {/* Modal Header */}
            <div className="bg-[#f6f6f7] border-b border-[#e1e1e1] p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-[#303030]">Add note</h2>
                <button
                  onClick={() => setShowAddNoteModal(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-[#6d7175]" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[60vh]">
              <div className="p-6">
                <div className="relative">
                  <label className="block text-[14px] font-medium text-[#303030] mb-2">Notes</label>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] resize-none"
                    rows={6}
                    maxLength={5000}
                    placeholder="Enter your notes here..."
                  />
                  {/* Character Counter */}
                  <div className="absolute bottom-2 right-2 text-[12px] text-[#6d7175] bg-white px-1">
                    {noteText.length}/5000
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
    </div>
  );
}
