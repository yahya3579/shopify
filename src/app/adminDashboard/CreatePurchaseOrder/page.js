'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { ChevronDown, Search, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CreatePurchaseOrder() {
  const [supplier, setSupplier] = useState('');
  const [destination, setDestination] = useState('Shop location');
  const [paymentTerms, setPaymentTerms] = useState('None');
  const [supplierCurrency, setSupplierCurrency] = useState('Pakistani Rupee (PKR Rs)');
  const [estimatedArrival, setEstimatedArrival] = useState('');
  const [shippingCarrier, setShippingCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [noteToSupplier, setNoteToSupplier] = useState('');
  const [tags, setTags] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showCreateSupplierModal, setShowCreateSupplierModal] = useState(false);
  const [showManageCostModal, setShowManageCostModal] = useState(false);
  const calendarRef = useRef(null);
  const supplierRef = useRef(null);

  // Supplier form state
  const [supplierForm, setSupplierForm] = useState({
    company: '',
    country: 'PK',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    contactName: '',
    email: '',
    phone: ''
  });

  // Cost adjustments state
  const [costAdjustments, setCostAdjustments] = useState([
    { id: 1, label: 'Shipping', amount: '0.00' }
  ]);

  // Calendar functions
  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setEstimatedArrival(formatDate(date));
    setShowCalendar(false);
  };

  const getCurrentMonthDates = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const dates = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) { // 6 weeks
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
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
    return date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (supplierRef.current && !supplierRef.current.contains(event.target)) {
        setShowSupplierDropdown(false);
      }
    };

    if (showCalendar || showSupplierDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar, showSupplierDropdown]);

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
            <div className="max-w-[1200px] mx-auto px-6 py-6">
              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  {/* Purchase Orders Link */}
                  <a 
                    href="/adminDashboard/PurchaseOrders" 
                    className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Purchase orders"
                  >
                    <svg className="w-4 h-4 text-[#303030]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2.25 1a1.75 1.75 0 0 0-1.75 1.75v10.5c0 .966.784 1.75 1.75 1.75h4.5a.75.75 0 0 0 0-1.5h-4.5a.25.25 0 0 1-.25-.25v-10.5a.25.25 0 0 1 .25-.25h8a.25.25 0 0 1 .25.25v2.75a.75.75 0 0 0 1.5 0v-2.75a1.75 1.75 0 0 0-1.75-1.75z"></path>
                      <path d="M3.5 4.75a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75"></path>
                      <path d="M12 8.25a.75.75 0 0 0-1.5 0v.25a2 2 0 1 0 0 4h1a.5.5 0 0 1 0 1h-2.25a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 1.5 0 2 2 0 1 0 0-4h-1a.5.5 0 0 1 0-1h2.25a.75.75 0 0 0 0-1.5h-.75z"></path>
                      <path d="M4.25 7a.75.75 0 0 0 0 1.5h2.75a.75.75 0 0 0 0-1.5z"></path>
                      <path d="M3.5 10.75a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75"></path>
                    </svg>
                  </a>
                  
                  {/* Breadcrumb Separator */}
                  <svg width="10" height="20" viewBox="0 0 10 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="flex-shrink-0">
                    <path d="M4 8L6.5 11L4 14" stroke="#8A8A8A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  
                  {/* Page Title */}
                  <h1 className="text-[20px] font-semibold text-[#303030]" tabIndex="-1">Create purchase order</h1>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="flex gap-6">
                {/* Left Column - Main Content */}
                <div className="flex-1 space-y-6 overflow-visible">
                  {/* Card 1: Supplier and Destination */}
                  <div className="bg-white rounded-xl shadow-sm overflow-visible">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Supplier and destination</h2>
                    </div>
                    <div className="p-4 pb-8">
                      <div className="flex gap-0 mb-4">
                        {/* Supplier Section */}
                        <div className="flex-1 pr-4 relative" ref={supplierRef}>
                          <div className="pb-4">
                            <h3 className="text-[13px] font-medium text-[#303030]">
                              <label htmlFor="supplier" id="Supplier">Supplier</label>
                            </h3>
                          </div>
                          <div>
                            <div className="block">
                              <div className="inline-grid grid-cols-[minmax(0,1fr)_auto]">
                                <button 
                                  type="button" 
                                  id="supplier" 
                                  aria-describedby="Supplier" 
                                  onClick={() => setShowSupplierDropdown(!showSupplierDropdown)}
                                  className="w-full flex items-center justify-between px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] hover:bg-gray-50"
                                  tabIndex="0"
                                >
                                  <div className="flex items-center gap-1">
                                    <div className="inline-grid grid-cols-[1fr_auto]">
                                      <span className="text-[13px] text-[#6d7175] font-medium">Select supplier</span>
                                    </div>
                                  </div>
                                  <ChevronDown className="w-4 h-4 text-[#6d7175]" />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Supplier Dropdown */}
                          {showSupplierDropdown && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-[#c9cccf] rounded-lg shadow-lg z-[9999] w-[300px] overflow-hidden">
                              {/* Focus Tracker */}
                              <div tabIndex="0" className="sr-only"></div>
                              
                              {/* Content Container */}
                              <div className="p-2">
                                {/* Scrollable Content */}
                                <div className="max-h-[113px] overflow-y-auto">
                                  {/* Empty State */}
                                  <div className="py-2">
                                    <span className="text-[13px] text-[#6d7175]">No suppliers found</span>
                                  </div>
                                </div>
                                
                                {/* Fixed Bottom Action */}
                                <div className="border-t border-[#e1e1e1] pt-2 mt-2">
                                  <button 
                                    type="button"
                                    className="w-full text-left px-3 py-2 text-[13px] text-[#0084db] hover:bg-gray-50 rounded transition-colors"
                                    onClick={() => {
                                      setShowSupplierDropdown(false);
                                      setShowCreateSupplierModal(true);
                                    }}
                                  >
                                    Create new supplier
                                  </button>
                                </div>
                              </div>
                              
                              {/* Focus Tracker */}
                              <div tabIndex="0" className="sr-only"></div>
                            </div>
                          )}
                        </div>
                        
                        {/* Vertical Divider */}
                        <div className="w-px bg-[#e1e1e1]"></div>
                        
                        {/* Destination Section */}
                        <div className="flex-1 pl-4">
                          <div className="pb-4">
                            <h3 className="text-[13px] font-medium text-[#303030]">
                              <label htmlFor="destination" id="Destination">Destination</label>
                            </h3>
                          </div>
                          <div>
                            <div className="block">
                              <div className="inline-grid grid-cols-[minmax(0,1fr)_auto]">
                                <button 
                                  type="button" 
                                  id="destination" 
                                  aria-describedby="Destination" 
                                  className="w-full flex items-center justify-between px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] hover:bg-gray-50"
                                  tabIndex="0"
                                  title="Shop location"
                                >
                                  <div className="flex items-center gap-1">
                                    <div className="inline-grid grid-cols-[1fr_auto]">
                                      <span className="text-[13px] text-[#303030] font-medium">{destination}</span>
                                    </div>
                                  </div>
                                  <ChevronDown className="w-4 h-4 text-[#6d7175]" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label htmlFor="payment-terms" className="block text-[13px] font-medium text-[#303030] mb-1.5">Payment terms (optional)</label>
                          <div className="relative">
                            <select 
                              id="payment-terms" 
                              value={paymentTerms}
                              onChange={(e) => setPaymentTerms(e.target.value)}
                              className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] appearance-none"
                            >
                              <option value="None">None</option>
                              <option value="COD">Cash on delivery</option>
                              <option value="ON_RECEIPT">Payment on receipt</option>
                              <option value="IN_ADVANCE">Payment in advance</option>
                              <option value="NET7">Net 7</option>
                              <option value="NET15">Net 15</option>
                              <option value="NET30">Net 30</option>
                              <option value="NET45">Net 45</option>
                              <option value="NET60">Net 60</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#6d7175] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <label htmlFor="supplier-currency" className="block text-[13px] font-medium text-[#303030] mb-1.5">Supplier currency</label>
                          <div className="relative">
                            <select 
                              id="supplier-currency" 
                              value={supplierCurrency}
                              onChange={(e) => setSupplierCurrency(e.target.value)}
                              className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] appearance-none"
                            >
                              <option value="USD">US Dollar (USD $)</option>
                              <option value="EUR">Euro (EUR €)</option>
                              <option value="GBP">British Pound (GBP £)</option>
                              <option value="CAD">Canadian Dollar (CAD $)</option>
                              <option value="PKR">Pakistani Rupee (PKR Rs)</option>
                              <option value="INR">Indian Rupee (INR ₹)</option>
                              <option value="CNY">Chinese Yuan (CNY ¥)</option>
                              <option value="JPY">Japanese Yen (JPY ¥)</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#6d7175] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Shipment details */}
                  <div className="bg-white rounded-xl shadow-sm overflow-visible">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Shipment details</h2>
                    </div>
                    <div className="p-4 space-y-4 pb-8">
                      <div className="relative" ref={calendarRef}>
                        <label htmlFor="estimated-arrival" className="block text-[13px] font-medium text-[#303030] mb-1.5">Estimated arrival</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="estimated-arrival"
                            placeholder="YYYY-MM-DD"
                            value={estimatedArrival}
                            onChange={(e) => setEstimatedArrival(e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
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
                          <div className="absolute top-full left-0 mt-1 bg-white border border-[#c9cccf] rounded-lg shadow-lg z-[9999] w-64 overflow-visible">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between p-3 border-b border-[#e1e1e1]">
                              <button
                                onClick={() => navigateMonth(-1)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <ChevronLeft className="w-4 h-4 text-[#6d7175]" />
                              </button>
                              <h4 className="text-[14px] font-semibold text-[#303030]">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </h4>
                              <button
                                onClick={() => navigateMonth(1)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <ChevronRight className="w-4 h-4 text-[#6d7175]" />
                              </button>
                            </div>

                            {/* Calendar Body */}
                            <div className="p-3">
                              {/* Days of Week */}
                              <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                                  <div key={day} className="text-center text-[12px] font-medium text-[#6d7175] py-1">
                                    {day}
                                  </div>
                                ))}
                              </div>

                              {/* Calendar Grid */}
                              <div className="grid grid-cols-7 gap-1">
                                {getCurrentMonthDates().map((date, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleDateSelect(date)}
                                    className={`
                                      text-[12px] py-1 px-1 rounded transition-colors text-center
                                      ${isCurrentMonth(date) ? 'text-[#303030]' : 'text-[#6d7175]'}
                                      ${isToday(date) ? 'bg-[#005bd3] text-white font-semibold' : ''}
                                      ${isSelected(date) ? 'bg-[#005bd3] text-white font-semibold' : ''}
                                      ${!isToday(date) && !isSelected(date) ? 'hover:bg-gray-100' : ''}
                                    `}
                                  >
                                    {date.getDate()}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="shipping-carrier" className="block text-[13px] font-medium text-[#303030] mb-1.5">Shipping carrier</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="shipping-carrier"
                            value={shippingCarrier}
                            onChange={(e) => setShippingCarrier(e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                          />
                          <ChevronDown className="w-4 h-4 text-[#6d7175] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="tracking-number" className="block text-[13px] font-medium text-[#303030] mb-1.5">Tracking number</label>
                        <input
                          type="text"
                          id="tracking-number"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Add products */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Add products</h2>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-[#6d7175] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search products"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                          />
                        </div>
                        <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
                          Browse
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Additional details */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Additional details</h2>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <label htmlFor="reference-number" className="block text-[13px] font-medium text-[#303030] mb-1.5">Reference number</label>
                        <input
                          type="text"
                          id="reference-number"
                          value={referenceNumber}
                          onChange={(e) => setReferenceNumber(e.target.value)}
                          className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </div>
                      <div>
                        <label htmlFor="note-to-supplier" className="block text-[13px] font-medium text-[#303030] mb-1.5">Note to supplier</label>
                        <div className="relative">
                          <textarea
                            id="note-to-supplier"
                            rows="3"
                            maxLength="5000"
                            value={noteToSupplier}
                            onChange={(e) => setNoteToSupplier(e.target.value)}
                            className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] resize-y"
                          />
                          <div className="absolute bottom-2 right-3 text-[12px] text-[#6d7175]">{noteToSupplier.length}/5000</div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="tags" className="block text-[13px] font-medium text-[#303030] mb-1.5">Tags</label>
                        <input
                          type="text"
                          id="tags"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Cost Summary */}
                <div className="w-80">
                  {/* Card 5: Cost summary */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1] flex items-center justify-between">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Cost summary</h2>
                      <button 
                        onClick={() => setShowManageCostModal(true)}
                        className="text-[13px] text-[#005bd3] hover:underline font-medium"
                      >
                        Manage
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {/* Taxes */}
                        <div className="flex items-center justify-between text-[13px] text-[#303030]">
                          <span>Taxes <span className="text-[#6d7175]">(Included)</span></span>
                          <span>Rs 0.00</span>
                        </div>
                        
                        {/* Subtotal */}
                        <div className="flex items-center justify-between text-[13px] font-semibold text-[#303030]">
                          <span>Subtotal</span>
                          <span>Rs 0.00</span>
                        </div>
                        
                        {/* Items count */}
                        <p className="text-[12px] text-[#6d7175]">0 items</p>
                        
                        {/* Cost adjustments section */}
                        <div className="pt-3 border-t border-[#e1e1e1]">
                          <div className="space-y-2">
                            <h3 className="text-[13px] font-semibold text-[#303030]">Cost adjustments</h3>
                            <div className="flex items-center justify-between text-[13px] text-[#303030]">
                              <span>Shipping</span>
                              <span>Rs 0.00</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Total */}
                        <div className="pt-3 border-t border-[#e1e1e1] flex items-center justify-between text-[14px] font-semibold text-[#303030]">
                          <span>Total</span>
                          <span>Rs 0.00</span>
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

      {/* Create Supplier Modal */}
      {showCreateSupplierModal && (
        <div className="fixed inset-0  flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg w-[600px] max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#e1e1e1]">
              <h2 className="text-[20px] font-semibold text-[#303030]">Create supplier</h2>
              <button
                onClick={() => setShowCreateSupplierModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-[#6d7175]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-4">
                {/* Company Field */}
                <div>
                  <label htmlFor="company" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={supplierForm.company}
                    onChange={(e) => setSupplierForm({...supplierForm, company: e.target.value})}
                    className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                  />
                </div>

                {/* Country/Region Field */}
                <div>
                  <label htmlFor="country" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                    Country/region
                  </label>
                  <div className="relative">
                    <select
                      id="country"
                      value={supplierForm.country}
                      onChange={(e) => setSupplierForm({...supplierForm, country: e.target.value})}
                      className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] appearance-none"
                    >
                      <option value="AF">Afghanistan</option>
                      <option value="AL">Albania</option>
                      <option value="DZ">Algeria</option>
                      <option value="AR">Argentina</option>
                      <option value="AU">Australia</option>
                      <option value="AT">Austria</option>
                      <option value="BD">Bangladesh</option>
                      <option value="BE">Belgium</option>
                      <option value="BR">Brazil</option>
                      <option value="CA">Canada</option>
                      <option value="CN">China</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                      <option value="IN">India</option>
                      <option value="IT">Italy</option>
                      <option value="JP">Japan</option>
                      <option value="PK">Pakistan</option>
                      <option value="RU">Russia</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="SG">Singapore</option>
                      <option value="ZA">South Africa</option>
                      <option value="ES">Spain</option>
                      <option value="CH">Switzerland</option>
                      <option value="TH">Thailand</option>
                      <option value="TR">Türkiye</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="GB">United Kingdom</option>
                      <option value="US">United States</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#6d7175] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Address Field */}
                <div>
                  <label htmlFor="address" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                    Address
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#6d7175] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="address"
                      value={supplierForm.address}
                      onChange={(e) => setSupplierForm({...supplierForm, address: e.target.value})}
                      className="w-full pl-9 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                    />
                  </div>
                </div>

                {/* Apartment Field */}
                <div>
                  <label htmlFor="apartment" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                    Apartment, suite, etc
                  </label>
                  <input
                    type="text"
                    id="apartment"
                    value={supplierForm.apartment}
                    onChange={(e) => setSupplierForm({...supplierForm, apartment: e.target.value})}
                    className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                  />
                </div>

                {/* City and Postal Code Row */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="city" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={supplierForm.city}
                      onChange={(e) => setSupplierForm({...supplierForm, city: e.target.value})}
                      className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="postalCode" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                      Postal code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      value={supplierForm.postalCode}
                      onChange={(e) => setSupplierForm({...supplierForm, postalCode: e.target.value})}
                      className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                    />
                  </div>
                </div>

                {/* Contact Name Field */}
                <div>
                  <label htmlFor="contactName" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                    Contact name
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    value={supplierForm.contactName}
                    onChange={(e) => setSupplierForm({...supplierForm, contactName: e.target.value})}
                    className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                  />
                </div>

                {/* Email and Phone Row */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="email" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={supplierForm.email}
                      onChange={(e) => setSupplierForm({...supplierForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="phone" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                      Phone number
                    </label>
                    <div className="flex">
                      <button className="px-3 py-2 border border-[#c9cccf] border-r-0 rounded-l-lg text-[13px] flex items-center gap-2 hover:bg-gray-50">
                        <img 
                          src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/pk-C6GKfae7SBqL.svg" 
                          alt="Pakistan (+92)" 
                          className="w-4 h-4"
                        />
                        <ChevronDown className="w-3 h-3 text-[#6d7175]" />
                      </button>
                      <input
                        type="tel"
                        id="phone"
                        value={supplierForm.phone}
                        onChange={(e) => setSupplierForm({...supplierForm, phone: e.target.value})}
                        className="flex-1 px-3 py-2 border border-[#c9cccf] rounded-r-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-[#e1e1e1]">
              <button
                onClick={() => setShowCreateSupplierModal(false)}
                className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Handle save supplier
                  setShowCreateSupplierModal(false);
                  // Reset form or handle save logic
                }}
                className="px-4 py-2 bg-[#303030] text-white text-[13px] font-medium rounded-lg hover:bg-[#1a1a1a] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Cost Summary Modal */}
      {showManageCostModal && (
        <div className="fixed inset-0  flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg w-[500px] max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#e1e1e1]">
              <h2 className="text-[16px] font-semibold text-[#303030]">Manage cost summary</h2>
              <button
                onClick={() => setShowManageCostModal(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-[#6d7175]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)]">
              {/* Headers */}
              <div className="flex justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-[#303030]">Adjustment</h3>
                <h3 className="text-[14px] font-semibold text-[#303030]">Amount</h3>
              </div>

              {/* Adjustment Rows */}
              <div className="space-y-4">
                {costAdjustments.map((adjustment) => (
                  <div key={adjustment.id} className="space-y-3">
                    {/* Adjustment Type Dropdown */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="relative">
                          <select
                            value={adjustment.type || ''}
                            onChange={(e) => {
                              const newAdjustments = costAdjustments.map(adj => 
                                adj.id === adjustment.id ? { ...adj, type: e.target.value, label: e.target.value === 'customs' ? 'Customs duties' : e.target.value === 'discount' ? 'Discount' : e.target.value === 'foreign' ? 'Foreign transaction fee' : e.target.value === 'freight' ? 'Freight fee' : e.target.value === 'insurance' ? 'Insurance' : e.target.value === 'rush' ? 'Rush fee' : e.target.value === 'surcharge' ? 'Surcharge' : e.target.value === 'other' ? 'Other' : 'Shipping' } : adj
                              );
                              setCostAdjustments(newAdjustments);
                            }}
                            className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] appearance-none"
                          >
                            <option value="" disabled>Select</option>
                            <option value="customs">Customs duties</option>
                            <option value="discount">Discount</option>
                            <option value="foreign">Foreign transaction fee</option>
                            <option value="freight">Freight fee</option>
                            <option value="insurance">Insurance</option>
                            <option value="rush">Rush fee</option>
                            <option value="surcharge">Surcharge</option>
                            <option value="other">Other</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-[#6d7175] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#6d7175]">Rs</div>
                          <input
                            type="text"
                            value={adjustment.amount}
                            onChange={(e) => {
                              const newAdjustments = costAdjustments.map(adj => 
                                adj.id === adjustment.id ? { ...adj, amount: e.target.value } : adj
                              );
                              setCostAdjustments(newAdjustments);
                            }}
                            className="w-24 pl-8 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setCostAdjustments(costAdjustments.filter(adj => adj.id !== adjustment.id));
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-[#6d7175]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Adjustment Button */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    const newId = Math.max(...costAdjustments.map(adj => adj.id)) + 1;
                    setCostAdjustments([...costAdjustments, { id: newId, label: 'New adjustment', amount: '0.00', type: '' }]);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#056ba7] hover:bg-gray-50 rounded transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.25 8a.75.75 0 0 1 .75-.75h2.25v-2.25a.75.75 0 0 1 1.5 0v2.25h2.25a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0v-2.25h-2.25a.75.75 0 0 1-.75-.75"></path>
                    <path fillRule="evenodd" d="M8 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14m0-1.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 1 0 0 11"></path>
                  </svg>
                  Add adjustment
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-[#e1e1e1]">
              
              <button
                onClick={() => setShowManageCostModal(false)}
                className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle save cost adjustments
                  setShowManageCostModal(false);
                }}
                className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
