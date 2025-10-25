'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function GiftCardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [giftCard, setGiftCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [isEditingExpiration, setIsEditingExpiration] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [expirationType, setExpirationType] = useState('no-expiration');
  const [expirationDate, setExpirationDate] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);

  useEffect(() => {
    const fetchGiftCard = async () => {
      if (!params.id) return;
      
      try {
        console.log('Fetching gift card with ID:', params.id);
        const response = await fetch(`/api/giftcards/${params.id}`);
        const data = await response.json();
        console.log('Gift card response:', data);
        
        if (data.success) {
          setGiftCard(data.data);
          setNotes(data.data.notes || '');
          setExpirationType(data.data.expirationType || 'no-expiration');
          setExpirationDate(data.data.expirationDate || '');
        } else {
          console.error('Gift card not found:', data);
          setError(data.error || 'Gift card not found');
        }
      } catch (error) {
        console.error('Error fetching gift card:', error);
        setError('Failed to load gift card');
      } finally {
        setLoading(false);
      }
    };

    fetchGiftCard();
  }, [params.id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const maskGiftCardCode = (code) => {
    if (!code) return '';
    const lastFour = code.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  const refetchGiftCard = async () => {
    try {
      const response = await fetch(`/api/giftcards/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setGiftCard(data.data);
        setNotes(data.data.notes || '');
        setExpirationType(data.data.expirationType || 'no-expiration');
        setExpirationDate(data.data.expirationDate || '');
      }
    } catch (error) {
      console.error('Error refetching gift card:', error);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('Are you sure you want to deactivate this gift card?')) return;
    
    try {
      const response = await fetch(`/api/giftcards/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'deactivated' }),
      });
      
      if (response.ok) {
        refetchGiftCard();
      }
    } catch (error) {
      console.error('Error deactivating gift card:', error);
    }
  };

  const handleActivate = async () => {
    if (!confirm('Are you sure you want to activate this gift card?')) return;
    
    try {
      const response = await fetch(`/api/giftcards/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });
      
      if (response.ok) {
        refetchGiftCard();
      }
    } catch (error) {
      console.error('Error activating gift card:', error);
    }
  };

  const handleSaveNotes = async () => {
    try {
      const response = await fetch(`/api/giftcards/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      
      if (response.ok) {
        setIsEditingNotes(false);
        refetchGiftCard();
      }
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const handleOpenExpirationModal = () => {
    setExpirationType(giftCard.expirationType || 'no-expiration');
    setExpirationDate(giftCard.expirationDate || '');
    setHasUnsavedChanges(false);
    setIsEditingExpiration(true);
  };

  const handleExpirationTypeChange = (type) => {
    setExpirationType(type);
    setHasUnsavedChanges(true);
    if (type === 'no-expiration') {
      setExpirationDate('');
    }
  };

  const handleSaveExpiration = async () => {
    try {
      const updateData = {
        expirationType,
        expirationDate: expirationType === 'set-expiration' ? expirationDate : null,
      };

      const response = await fetch(`/api/giftcards/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      if (response.ok) {
        setIsEditingExpiration(false);
        setHasUnsavedChanges(false);
        refetchGiftCard();
      }
    } catch (error) {
      console.error('Error updating expiration:', error);
    }
  };

  const handleCancelExpiration = () => {
    setExpirationType(giftCard.expirationType || 'no-expiration');
    setExpirationDate(giftCard.expirationDate || '');
    setHasUnsavedChanges(false);
    setIsEditingExpiration(false);
  };

  const handleEmojiSelect = (emoji) => {
    setComment(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    setIsPostingComment(true);
    try {
      const response = await fetch(`/api/giftcards/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          comment: comment.trim(),
          authorName: 'Yahya Arsalan' // Replace with actual user name when auth is implemented
        }),
      });
      if (response.ok) {
        const updated = await response.json();
        setGiftCard(updated.data); // Instantly show the new comment in UI
        setComment('');
        // Optionally: refetchGiftCard(); // if you want extra safety
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment');
    } finally {
      setIsPostingComment(false);
    }
  };

  const emojis = ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '👍', '👎', '👏', '🙌', '👋', '🤝', '🙏', '💪', '❤️', '💔', '💕', '💖', '💗', '💙', '💚', '💛', '🧡', '💜', '🖤', '💯', '💢', '💥', '💫', '💦', '💨', '🔥', '✨', '🌟', '⭐', '🎉', '🎊', '🎈', '🎁'];

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#f1f1f1]">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-[#6d7175]">Loading gift card...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !giftCard) {
    return (
      <div className="flex flex-col h-screen bg-[#f1f1f1]">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="text-[#6d7175] text-lg">{error || 'Gift card not found'}</div>
            <button
              onClick={() => router.push('/adminDashboard/GiftCards')}
              className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors"
            >
              Back to Gift Cards
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f1f1f1]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden bg-[#f1f1f1] rounded-tl-3xl">
          <main className="flex-1 overflow-auto bg-[#f1f1f1]">
            <div className="w-full px-60 py-8 max-w-[1400px] mx-auto">
              {/* Page Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  {/* Breadcrumb and Title */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => router.push('/adminDashboard/GiftCards')}
                      className="text-[#6d7175] hover:text-[#303030] transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M13.5 3.5h-5.5v.75a.75.75 0 0 1-1.5 0v-.75h-4a.5.5 0 0 0-.5.5v3.043a.75.75 0 0 1 0 1.414v3.543a.5.5 0 0 0 .5.5h4v-1a.75.75 0 0 1 1.5 0v1h5.5a.5.5 0 0 0 .5-.5v-3.5h-1.25a.75.75 0 0 1 0-1.5h1.25v-3a.5.5 0 0 0-.5-.5m2 4.25v-3.75a2 2 0 0 0-2-2h-11a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2zm-8.703-1.758a2.117 2.117 0 0 0-4.047.88c0 1.171.95 2.128 2.125 2.128h.858c-.595.51-1.256.924-1.84 1.008a.749.749 0 1 0 .213 1.484c1.11-.158 2.128-.919 2.803-1.53a11 11 0 0 0 .341-.322q.16.158.34.322c.676.611 1.693 1.372 2.804 1.53a.749.749 0 1 0 .212-1.484c-.583-.084-1.244-.498-1.839-1.008h.858a2.13 2.13 0 0 0 2.125-2.128 2.118 2.118 0 0 0-4.047-.88l-.453.996zm-.962 1.508h-.96a.627.627 0 0 1-.625-.628.619.619 0 0 1 1.182-.259zm3.79 0h-.96l.403-.887a.618.618 0 0 1 1.182.259.63.63 0 0 1-.625.628"></path>
                      </svg>
                    </button>
                    <svg width="10" height="20" viewBox="0 0 10 20" fill="none" className="text-[#8A8A8A]">
                      <path d="M4 8L6.5 11L4 14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <h1 className="text-[20px] font-semibold text-[#303030]">{giftCard.giftCardCode.slice(-4)}</h1>
                    {giftCard.status === 'active' && giftCard.currentBalance > 0 && (
                      <span className="px-2 py-1 text-[12px] font-medium bg-[#d1f7c4] text-[#0f5132] rounded-md">Active</span>
                    )}
                    {giftCard.status === 'deactivated' && (
                      <span className="px-2 py-1 text-[12px] font-medium bg-[#ffd79d] text-[#8a5700] rounded-md">Deactivated</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {giftCard.status === 'deactivated' ? (
                      <button
                        onClick={handleActivate}
                        className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Activate
                      </button>
                    ) : (
                      <button
                        onClick={handleDeactivate}
                        className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Deactivate
                      </button>
                    )}
                    <button
                      disabled
                      className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send gift card
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="col-span-2 space-y-6">
                  {/* Gift Card Code Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-6">
                      <h2 className="text-[20px] font-semibold text-[#303030]">
                        {maskGiftCardCode(giftCard.giftCardCode)}
                      </h2>
                      <button 
                        onClick={handleOpenExpirationModal}
                        className="text-[#6d7175] hover:text-[#303030]"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                          <path fillRule="evenodd" d="M13.655 2.344a2.694 2.694 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.009.01-5.88 5.88a2.75 2.75 0 0 0-.806 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.54a2.694 2.694 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88zm2.75.629.599-.599a1.196 1.196 0 0 0-1.69-1.69l-.598.6z"></path>
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div className="space-y-4">
                        <div>
                          <div className="text-[13px] font-semibold text-[#303030] mb-1">Expiration date</div>
                          <div className="text-[13px] text-[#6d7175]">
                            {giftCard.expirationType === 'no-expiration' 
                              ? "Doesn't expire"
                              : giftCard.expirationDate 
                                ? formatDate(giftCard.expirationDate)
                                : "Not set"
                            }
                          </div>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-[#303030] mb-1">Recipient</div>
                          <div className="text-[13px] text-[#6d7175]">None</div>
                        </div>
                      </div>
                      <div>
                        <img 
                          src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/gift-card-1WjvjslvRoGt.svg" 
                          alt="Gift card" 
                          className="w-24 h-24"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Balance Card */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="border-r border-[#e3e4e5] pr-6">
                        <div className="text-[13px] text-[#303030] mb-2">Current balance</div>
                        <div className="text-[20px] font-semibold text-[#303030]">
                          {giftCard.currency} {giftCard.currentBalance.toFixed(2)} PKR
                        </div>
                      </div>
                      <div>
                        <div className="text-[13px] text-[#6d7175] mb-2">Initial balance</div>
                        <div className="text-[20px] font-semibold text-[#6d7175]">
                          {giftCard.currency} {giftCard.initialValue.toFixed(2)} PKR
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-[#e3e4e5]">
                      <h2 className="text-[16px] font-semibold text-[#303030]">Timeline</h2>
                    </div>
                    
                    <div className="p-6">
                      {/* Comment Editor */}
                      <div className="flex gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[#b4e3ff] flex items-center justify-center text-[14px] font-semibold text-[#000000]">
                          YA
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Leave a comment..."
                            className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#005bd3] resize-none"
                            rows={3}
                          />
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 relative">
                              <button 
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="text-[#6d7175] hover:text-[#303030] relative"
                                type="button"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                                  <path d="M9.5 5a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 1.5 0v-1.5a.75.75 0 0 0-.75-.75"></path>
                                  <path d="M5.75 5.75a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0z"></path>
                                  <path d="M9.522 9.983a2.5 2.5 0 0 1-3.044 0 2.5 2.5 0 0 1-.893-1.336.75.75 0 1 0-1.448.388 3.999 3.999 0 0 0 7.727 0 .75.75 0 1 0-1.45-.388 2.5 2.5 0 0 1-.892 1.336"></path>
                                  <path fillRule="evenodd" d="M15 8a7 7 0 1 1-14 0 7 7 0 0 1 14 0m-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 1 1 11 0"></path>
                                </svg>
                              </button>
                              
                              {/* Emoji Picker Dropdown */}
                              {showEmojiPicker && (
                                <div className="absolute left-0 bottom-full mb-2 bg-white border border-[#c9cccf] rounded-lg shadow-lg p-3 w-[320px] max-h-[200px] overflow-y-auto z-50">
                                  <div className="grid grid-cols-8 gap-2">
                                    {emojis.map((emoji, index) => (
                                      <button
                                        key={index}
                                        onClick={() => handleEmojiSelect(emoji)}
                                        className="text-[20px] hover:bg-[#f1f1f1] rounded p-1 transition-colors"
                                        type="button"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <button className="text-[#6d7175] hover:text-[#303030]">
                                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.738 2.987a5.498 5.498 0 0 1 7.762 5.013c0 .874-.227 1.44-.5 1.773a1.26 1.26 0 0 1-1 .477c-.639 0-.96-.222-1.162-.523-.236-.355-.374-.93-.374-1.727v-2.571a.749.749 0 0 0-1.28-.531c-.437-.3-1.012-.505-1.755-.505-1.159 0-1.952.6-2.422 1.352-.45.72-.614 1.58-.614 2.255s.164 1.536.614 2.255c.47.752 1.263 1.352 2.422 1.352.95 0 1.655-.468 2.119-.937l.069-.072c.515.745 1.326 1.152 2.383 1.152.824 0 1.6-.347 2.157-1.024.55-.667.843-1.6.843-2.726a7 7 0 1 0-3.009 5.751.75.75 0 0 0-.855-1.232 5.51 5.51 0 0 1-6.776-.395 5.503 5.503 0 0 1 1.378-9.137m3.276 5.877a7 7 0 0 1-.05-.864v-.976l-.033-.075c-.09-.204-.173-.392-.352-.598-.2-.228-.522-.458-1.15-.458-.556 0-.906.256-1.15.647-.265.424-.386.991-.386 1.46s.121 1.036.386 1.46c.244.39.594.647 1.15.647.42 0 .763-.199 1.052-.491a3.2 3.2 0 0 0 .534-.752Z"></path>
                                </svg>
                              </button>
                              {/* <button className="text-[#6d7175] hover:text-[#303030]">
                                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                                  <path fillRule="evenodd" d="M12.239 2.379a.751.751 0 0 0-1.478-.258l-.457 2.629h-3.478l.413-2.371a.751.751 0 0 0-1.478-.258l-.457 2.629h-2.804a.75.75 0 0 0 0 1.5h2.543l-.609 3.5h-2.434a.75.75 0 0 0 0 1.5h2.174l-.413 2.372a.75.75 0 0 0 1.478.257l.457-2.629h3.478l-.413 2.372a.75.75 0 0 0 1.478.257l.457-2.629h2.804a.75.75 0 0 0 0-1.5h-2.543l.609-3.5h2.434a.75.75 0 0 0 0-1.5h-2.174zm-6.282 7.371h3.477l.61-3.5h-3.478z"></path>
                                </svg>
                              </button>
                              <button className="text-[#6d7175] hover:text-[#303030]">
                                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                                  <path fillRule="evenodd" d="M2.843 7.854a3.75 3.75 0 0 0 0 5.303l.147.147a3.543 3.543 0 0 0 5.01 0 .75.75 0 0 0-1.06-1.061 2.044 2.044 0 0 1-2.89 0l-.146-.146a2.25 2.25 0 0 1 0-3.182l5.015-5.015a2.242 2.242 0 1 1 3.173 3.172l-2.286 2.286a.815.815 0 0 1-1.155 0 .815.815 0 0 1 0-1.155l2.25-2.25a.75.75 0 0 0-1.06-1.061l-2.25 2.25a2.315 2.315 0 0 0 0 3.277c.904.905 2.37.905 3.275 0l2.286-2.286a3.743 3.743 0 1 0-5.294-5.294z"></path>
                                </svg>
                              </button> */}
                            </div>
                            <button
                              onClick={handlePostComment}
                              disabled={!comment.trim() || isPostingComment}
                              className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isPostingComment ? 'Posting...' : 'Post'}
                            </button>
                          </div>
                          <div className="text-[12px] text-[#6d7175] mt-2">
                            Only you and other staff can see comments
                          </div>
                        </div>
                      </div>

                      {/* Timeline Events */}
                      <div className="space-y-6">
                        {/* Comments */}
                        {giftCard.comments && giftCard.comments.length > 0 && (
                          <div className="space-y-4">
                            {giftCard.comments.slice().reverse().map((commentItem, index) => (
                              <div key={index} className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#b4e3ff] flex items-center justify-center text-[14px] font-semibold text-[#000000] shrink-0">
                                  {commentItem.authorName ? commentItem.authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST'}
                                </div>
                                <div className="flex-1 bg-[#f9fafb] rounded-lg p-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[13px] font-semibold text-[#303030]">
                                      {commentItem.authorName || 'Staff'}
                                    </span>
                                    <span className="text-[12px] text-[#6d7175]">
                                      {formatTime(commentItem.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-[13px] text-[#303030] whitespace-pre-wrap">{commentItem.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Creation Event */}
                        <div className="space-y-4">
                          <div className="text-[13px] font-semibold text-[#303030]">
                            {formatDate(giftCard.createdAt)}
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#303030] mt-1.5"></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-[13px] text-[#303030]">
                                  You created a new {giftCard.currency}{giftCard.initialValue.toFixed(2)} PKR gift card.
                                </p>
                                <span className="text-[13px] text-[#6d7175]">{formatTime(giftCard.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="col-span-1 space-y-6">
                  {/* Created By */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-[13px] font-semibold text-[#303030] mb-3">Created by</h3>
                    <p className="text-[13px] text-[#303030]">
                      {giftCard.createdBy?.firstName && giftCard.createdBy?.lastName
                        ? `${giftCard.createdBy.firstName} ${giftCard.createdBy.lastName}`
                        : 'Yahya Arsalan'
                      }
                    </p>
                  </div>

                  {/* Customer */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-[13px] font-semibold text-[#303030] mb-3">Customer</h3>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]">
                        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                          <path fillRule="evenodd" d="M10.323 11.383a5.5 5.5 0 1 1-3.323-9.883 5.5 5.5 0 0 1 4.383 8.823l2.897 2.897a.749.749 0 1 1-1.06 1.06zm.677-4.383c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4"></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search or create customer"
                        className="w-full pl-10 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[13px] font-semibold text-[#303030]">Notes</h3>
                      <button
                        onClick={() => setIsEditingNotes(!isEditingNotes)}
                        className="text-[#6d7175] hover:text-[#303030]"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                          <path fillRule="evenodd" d="M13.655 2.344a2.694 2.694 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.009.01-5.88 5.88a2.75 2.75 0 0 0-.806 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.54a2.694 2.694 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88zm2.75.629.599-.599a1.196 1.196 0 0 0-1.69-1.69l-.598.6z"></path>
                        </svg>
                      </button>
                    </div>
                    {isEditingNotes ? (
                      <div>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#005bd3] resize-none mb-3"
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveNotes}
                            className="px-3 py-1.5 bg-[#303030] text-white text-[12px] font-medium rounded-lg hover:bg-[#1a1a1a] transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingNotes(false);
                              setNotes(giftCard.notes || '');
                            }}
                            className="px-3 py-1.5 border border-[#c9cccf] text-[#303030] text-[12px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[13px] text-[#6d7175]">
                        {giftCard.notes || 'No notes'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Edit Expiration Date Modal */}
      {isEditingExpiration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50  " style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
            onClick={handleCancelExpiration}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[500px] mx-4">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e3e4e5]">
              <h2 className="text-[16px] font-semibold text-[#303030]">Edit expiration date</h2>
              <button
                onClick={handleCancelExpiration}
                className="text-[#6d7175] hover:text-[#303030] p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11.97 13.03a.749.749 0 1 0 1.06-1.06l-3.97-3.97 3.97-3.97a.749.749 0 1 0-1.06-1.06l-3.97 3.97-3.97-3.97a.749.749 0 1 0-1.06 1.06l3.97 3.97-3.97 3.97a.749.749 0 1 0 1.06 1.06l3.97-3.97z"></path>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Info Banner */}
              <div className="mb-4 p-3 bg-[#e0f5ff] rounded-lg flex items-start gap-2">
                <svg className="w-5 h-5 text-[#0078d4] shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 12a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-.75.75"></path>
                  <path d="M7 5a1 1 0 1 1 2 0 1 1 0 0 1-2 0"></path>
                  <path fillRule="evenodd" d="M15 8a7 7 0 1 1-14 0 7 7 0 0 1 14 0m-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 1 1 11 0"></path>
                </svg>
                <p className="text-[13px] text-[#303030]">
                  Countries have different laws for gift card expiration dates. Check the laws for your country before changing this date.
                </p>
              </div>

              {/* Radio Options */}
              <div className="space-y-3">
                {/* No expiration date */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                    <input
                      type="radio"
                      name="expirationType"
                      checked={expirationType === 'no-expiration'}
                      onChange={() => handleExpirationTypeChange('no-expiration')}
                      className="w-5 h-5 cursor-pointer accent-[#303030]"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[14px] text-[#303030]">No expiration date</span>
                  </div>
                </label>

                {/* Set expiration date */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                    <input
                      type="radio"
                      name="expirationType"
                      checked={expirationType === 'set-expiration'}
                      onChange={() => handleExpirationTypeChange('set-expiration')}
                      className="w-5 h-5 cursor-pointer accent-[#303030]"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[14px] text-[#303030]">Set expiration date</span>
                  </div>
                </label>

                {/* Date Input (shown when set-expiration is selected) */}
                {expirationType === 'set-expiration' && (
                  <div className="ml-8 mt-2">
                    <input
                      type="date"
                      value={expirationDate}
                      onChange={(e) => {
                        setExpirationDate(e.target.value);
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#e3e4e5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <>
                    <svg className="w-5 h-5 text-[#6d7175]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 4a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 .75-.75"></path>
                      <path d="M8 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
                      <path fillRule="evenodd" d="M1.5 6.25a4.75 4.75 0 0 1 4.75-4.75h3.5a4.75 4.75 0 0 1 4.75 4.75v2.5a4.75 4.75 0 0 1-4.573 4.747l-1.335 1.714a.75.75 0 0 1-1.189-.007l-1.3-1.706a4.75 4.75 0 0 1-4.603-4.748zm4.75-3.25a3.25 3.25 0 0 0-3.25 3.25v2.5a3.25 3.25 0 0 0 3.25 3.25h.226c.234 0 .455.11.597.296l.934 1.225.96-1.232a.75.75 0 0 1 .591-.289h.192a3.25 3.25 0 0 0 3.25-3.25v-2.5a3.25 3.25 0 0 0-3.25-3.25z"></path>
                    </svg>
                    <span className="text-[13px] text-[#6d7175]">Unsaved changes</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelExpiration}
                  className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveExpiration}
                  disabled={!hasUnsavedChanges}
                  className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

