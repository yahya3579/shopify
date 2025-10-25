'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

export default function GiftCardsPage() {
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedGiftCards, setSelectedGiftCards] = useState([]);

  useEffect(() => {
    fetchGiftCards();
  }, []);

  useEffect(() => {
    // Clear selections when changing tabs
    setSelectedGiftCards([]);
  }, [activeTab]);

  const fetchGiftCards = async () => {
    try {
      const response = await fetch('/api/giftcards');
      const data = await response.json();
      if (data.success) {
        console.log('Fetched gift cards:', data.data);
        setGiftCards(data.data);
      }
    } catch (error) {
      console.error('Error fetching gift cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredGiftCards = () => {
    if (activeTab === 'all') return giftCards;
    if (activeTab === 'redeemable') return giftCards.filter(gc => gc.status === 'active' && gc.currentBalance > 0);
    if (activeTab === 'full') return giftCards.filter(gc => gc.currentBalance === gc.initialValue);
    if (activeTab === 'partial') return giftCards.filter(gc => gc.currentBalance > 0 && gc.currentBalance < gc.initialValue);
    if (activeTab === 'empty') return giftCards.filter(gc => gc.currentBalance === 0);
    if (activeTab === 'deactivated') return giftCards.filter(gc => gc.status === 'deactivated' || gc.status === 'expired');
    return giftCards;
  };

  const filteredGiftCards = getFilteredGiftCards();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (giftCard) => {
    if (giftCard.status === 'active' && giftCard.currentBalance > 0) {
      return <span className="px-2 py-1 text-[12px] font-medium bg-[#d1f7c4] text-[#0f5132] rounded-md">Active</span>;
    }
    if (giftCard.currentBalance === 0) {
      return <span className="px-2 py-1 text-[12px] font-medium bg-[#e3e4e5] text-[#616161] rounded-md">Empty</span>;
    }
    if (giftCard.status === 'expired') {
      return <span className="px-2 py-1 text-[12px] font-medium bg-[#fef3c7] text-[#92400e] rounded-md">Expired</span>;
    }
    if (giftCard.status === 'deactivated') {
      return <span className="px-2 py-1 text-[12px] font-medium bg-[#fecaca] text-[#991b1b] rounded-md">Deactivated</span>;
    }
    return <span className="px-2 py-1 text-[12px] font-medium bg-[#e3e4e5] text-[#616161] rounded-md">{giftCard.status}</span>;
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedGiftCards(filteredGiftCards.map(gc => gc._id));
    } else {
      setSelectedGiftCards([]);
    }
  };

  const handleSelectOne = (giftCardId) => {
    setSelectedGiftCards(prev => {
      if (prev.includes(giftCardId)) {
        return prev.filter(id => id !== giftCardId);
      } else {
        return [...prev, giftCardId];
      }
    });
  };

  const handleBulkDeactivate = async () => {
    if (!confirm(`Are you sure you want to deactivate ${selectedGiftCards.length} gift card(s)?`)) return;
    
    try {
      const updatePromises = selectedGiftCards.map(id =>
        fetch(`/api/giftcards/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'deactivated' }),
        })
      );
      
      await Promise.all(updatePromises);
      setSelectedGiftCards([]);
      fetchGiftCards();
    } catch (error) {
      console.error('Error deactivating gift cards:', error);
      alert('Failed to deactivate some gift cards');
    }
  };

  const handleBulkActivate = async () => {
    if (!confirm(`Are you sure you want to activate ${selectedGiftCards.length} gift card(s)?`)) return;
    
    try {
      const updatePromises = selectedGiftCards.map(id =>
        fetch(`/api/giftcards/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'active' }),
        })
      );
      
      await Promise.all(updatePromises);
      setSelectedGiftCards([]);
      fetchGiftCards();
    } catch (error) {
      console.error('Error activating gift cards:', error);
      alert('Failed to activate some gift cards');
    }
  };

  const getSelectedGiftCardsStatus = () => {
    const selected = giftCards.filter(gc => selectedGiftCards.includes(gc._id));
    const hasActive = selected.some(gc => gc.status === 'active');
    const hasDeactivated = selected.some(gc => gc.status === 'deactivated');
    
    return { hasActive, hasDeactivated };
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-[#6d7175]">Loading gift cards...</div>
        </div>
      </AdminLayout>
    );
  }

  // Show empty state if no gift cards
  if (giftCards.length === 0) {
    return (
      <AdminLayout>
        <div className="w-full px-4 lg:px-6 py-4 lg:py-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#000000]" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M13.5 3.5h-5.5v.75a.75.75 0 0 1-1.5 0v-.75h-4a.5.5 0 0 0-.5.5v3.043a.75.75 0 0 1 0 1.414v3.543a.5.5 0 0 0 .5.5h4v-1a.75.75 0 0 1 1.5 0v1h5.5a.5.5 0 0 0 .5-.5v-3.5h-1.25a.75.75 0 0 1 0-1.5h1.25v-3a.5.5 0 0 0-.5-.5m2 4.25v-3.75a2 2 0 0 0-2-2h-11a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2zm-8.703-1.758a2.117 2.117 0 0 0-4.047.88c0 1.171.95 2.128 2.125 2.128h.858c-.595.51-1.256.924-1.84 1.008a.749.749 0 1 0 .213 1.484c1.11-.158 2.128-.919 2.803-1.53a11 11 0 0 0 .341-.322q.16.158.34.322c.676.611 1.693 1.372 2.804 1.53a.749.749 0 1 0 .212-1.484c-.583-.084-1.244-.498-1.839-1.008h.858a2.13 2.13 0 0 0 2.125-2.128 2.118 2.118 0 0 0-4.047-.88l-.453.996zm-.962 1.508h-.96a.627.627 0 0 1-.625-.628.619.619 0 0 1 1.182-.259zm3.79 0h-.96l.403-.887a.618.618 0 0 1 1.182.259.63.63 0 0 1-.625.628"></path>
                      </svg>
                      <h1 className="text-[20px] font-semibold text-[#303030]">Gift cards</h1>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="py-8 px-0">
                      <div className="flex flex-col items-center">
                        <div className="mb-6">
                          <img 
                            src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/empty-state-gift-cards-8nmlfWYoOfXW.svg" 
                            alt="Gift cards illustration" 
                            className="w-auto h-auto max-w-[400px]"
                          />
                        </div>
                        <div className="max-w-[400px] text-center">
                          <div className="mb-4">
                            <div className="mb-3">
                              <h2 className="text-[16px] font-semibold text-[#303030] mb-2">Start selling gift cards</h2>
                            </div>
                            <div className="text-[13px] text-[#6d7175] mb-4">
                              <p>Add gift card products to sell or create gift cards and send them directly to your customers.</p>
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-6">
                              <a 
                                href="/adminDashboard/CreateGiftCard"
                                className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Create gift card
                              </a>
                              <a 
                                href="/adminDashboard/CreateGiftCardProduct"
                                className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors inline-block"
                              >
                                Add gift card product
                              </a>
                            </div>
                          </div>
                          <div className="text-[13px] text-[#6d7175]">
                            <p>
                              By using gift cards, you agree to our{' '}
                              <a 
                                href="https://www.shopify.com/legal/terms-gift-cards" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[#005bd3] hover:underline"
                              >
                                Terms of Service
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button className="text-[13px] text-[#005bd3] hover:underline font-medium">
                    Learn more about gift cards
                  </button>
                </div>
      </div>
    </AdminLayout>
  );
  }

  // Show table view if there are gift cards
  return (
    <AdminLayout>
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6">
              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#000000]" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M13.5 3.5h-5.5v.75a.75.75 0 0 1-1.5 0v-.75h-4a.5.5 0 0 0-.5.5v3.043a.75.75 0 0 1 0 1.414v3.543a.5.5 0 0 0 .5.5h4v-1a.75.75 0 0 1 1.5 0v1h5.5a.5.5 0 0 0 .5-.5v-3.5h-1.25a.75.75 0 0 1 0-1.5h1.25v-3a.5.5 0 0 0-.5-.5m2 4.25v-3.75a2 2 0 0 0-2-2h-11a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2zm-8.703-1.758a2.117 2.117 0 0 0-4.047.88c0 1.171.95 2.128 2.125 2.128h.858c-.595.51-1.256.924-1.84 1.008a.749.749 0 1 0 .213 1.484c1.11-.158 2.128-.919 2.803-1.53a11 11 0 0 0 .341-.322q.16.158.34.322c.676.611 1.693 1.372 2.804 1.53a.749.749 0 1 0 .212-1.484c-.583-.084-1.244-.498-1.839-1.008h.858a2.13 2.13 0 0 0 2.125-2.128 2.118 2.118 0 0 0-4.047-.88l-.453.996zm-.962 1.508h-.96a.627.627 0 0 1-.625-.628.619.619 0 0 1 1.182-.259zm3.79 0h-.96l.403-.887a.618.618 0 0 1 1.182.259.63.63 0 0 1-.625.628"></path>
                    </svg>
                    <h1 className="text-[20px] font-semibold text-[#303030]">Gift cards</h1>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a 
                      href="/adminDashboard/CreateGiftCardProduct"
                      className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Add gift card product
                    </a>
                    <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      Export
                    </button>
                    <a 
                      href="/adminDashboard/CreateGiftCard"
                      className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors"
                    >
                      Create gift card
                    </a>
                  </div>
                </div>
              </div>

              {/* Main Card with Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-[#e3e4e5] px-4 pt-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${
                        activeTab === 'all'
                          ? 'bg-[#f1f1f1] text-[#303030]'
                          : 'text-[#6d7175] hover:bg-[#f9fafb]'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setActiveTab('redeemable')}
                      className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${
                        activeTab === 'redeemable'
                          ? 'bg-[#f1f1f1] text-[#303030]'
                          : 'text-[#6d7175] hover:bg-[#f9fafb]'
                      }`}
                    >
                      Redeemable
                    </button>
                    {/* <button
                      onClick={() => setActiveTab('full')}
                      className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${
                        activeTab === 'full'
                          ? 'bg-[#f1f1f1] text-[#303030]'
                          : 'text-[#6d7175] hover:bg-[#f9fafb]'
                      }`}
                    >
                      Full
                    </button> */}
                    {/* <button
                      onClick={() => setActiveTab('partial')}
                      className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${
                        activeTab === 'partial'
                          ? 'bg-[#f1f1f1] text-[#303030]'
                          : 'text-[#6d7175] hover:bg-[#f9fafb]'
                      }`}
                    >
                      Partial
                    </button> */}
                    {/* <button
                      onClick={() => setActiveTab('empty')}
                      className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${
                        activeTab === 'empty'
                          ? 'bg-[#f1f1f1] text-[#303030]'
                          : 'text-[#6d7175] hover:bg-[#f9fafb]'
                      }`}
                    >
                      Empty
                    </button> */}
                    <button
                      onClick={() => setActiveTab('deactivated')}
                      className={`px-4 py-2 text-[13px] font-medium rounded-t-lg transition-colors ${
                        activeTab === 'deactivated'
                          ? 'bg-[#f1f1f1] text-[#303030]'
                          : 'text-[#6d7175] hover:bg-[#f9fafb]'
                      }`}
                    >
                      Deactivated
                    </button>
                  </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedGiftCards.length > 0 && (
                  <div className="bg-[#f7f7f7] border-b border-[#e3e4e5] px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] text-[#303030] font-medium">
                        {selectedGiftCards.length} selected
                      </span>
                      <button
                        onClick={() => setSelectedGiftCards([])}
                        className="text-[13px] text-[#005bd3] hover:underline"
                      >
                        Clear selection
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSelectedGiftCardsStatus().hasActive && (
                        <button
                          onClick={handleBulkDeactivate}
                          className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Deactivate
                        </button>
                      )}
                      {getSelectedGiftCardsStatus().hasDeactivated && (
                        <button
                          onClick={handleBulkActivate}
                          className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f9fafb] border-b border-[#e3e4e5]">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input 
                            type="checkbox" 
                            className="rounded border-[#c9cccf] cursor-pointer" 
                            checked={selectedGiftCards.length === filteredGiftCards.length && filteredGiftCards.length > 0}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-[13px] font-medium text-[#303030]">Code ending</th>
                        <th className="px-4 py-3 text-left text-[13px] font-medium text-[#303030]">Status</th>
                        <th className="px-4 py-3 text-left text-[13px] font-medium text-[#303030]">Customer</th>
                        <th className="px-4 py-3 text-left text-[13px] font-medium text-[#303030]">Recipient</th>
                        <th className="px-4 py-3 text-left text-[13px] font-medium text-[#303030]">Date issued</th>
                        <th className="px-4 py-3 text-right text-[13px] font-medium text-[#303030]">Current / Initial</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGiftCards.map((giftCard) => {
                        console.log('Gift card ID:', giftCard._id, 'Type:', typeof giftCard._id);
                        return (
                          <tr key={giftCard._id} className="border-b border-[#e3e4e5] hover:bg-[#f9fafb] transition-colors">
                            <td className="px-4 py-4">
                              <input 
                                type="checkbox" 
                                className="rounded border-[#c9cccf] cursor-pointer"
                                checked={selectedGiftCards.includes(giftCard._id)}
                                onChange={() => handleSelectOne(giftCard._id)}
                              />
                            </td>
                            <td className="px-4 py-4">
                              <Link href={`/adminDashboard/GiftCards/${giftCard._id}`} className="text-[13px] text-[#333333] hover:underline">
                                {giftCard.giftCardCode.slice(-4)}
                              </Link>
                            </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(giftCard)}
                          </td>
                          <td className="px-4 py-4 text-[13px] text-[#303030]">
                            {giftCard.customer?.firstName && giftCard.customer?.lastName
                              ? `${giftCard.customer.firstName} ${giftCard.customer.lastName}`
                              : <span className="text-[#6d7175]">No customer</span>
                            }
                          </td>
                          <td className="px-4 py-4 text-[13px] text-[#6d7175]">
                            No recipient
                          </td>
                          <td className="px-4 py-4 text-[13px] text-[#303030]">
                            {formatDate(giftCard.createdAt)}
                          </td>
                          <td className="px-4 py-4 text-right text-[13px] text-[#303030]">
                            {giftCard.currency} {giftCard.currentBalance.toFixed(2)} / {giftCard.currency} {giftCard.initialValue.toFixed(2)}
                          </td>
                        </tr>
                      );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer Link */}
              <div className="mt-6 text-center">
                <button className="text-[13px] text-[#292929] hover:underline font-medium">
                  Learn more about gift cards
                </button>
              </div>
      </div>
    </AdminLayout>
  );
}
