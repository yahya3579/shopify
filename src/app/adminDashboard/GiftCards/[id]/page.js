'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

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
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData.user);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

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
      
      const data = await response.json();
      
      if (response.ok) {
        // Update the local state immediately for better UX
        setGiftCard(prev => ({ ...prev, status: 'deactivated' }));
        // Also refetch to ensure consistency
        refetchGiftCard();
      } else {
        console.error('Error deactivating gift card:', data);
        alert(data.error || 'Failed to deactivate gift card');
      }
    } catch (error) {
      console.error('Error deactivating gift card:', error);
      alert('Failed to deactivate gift card');
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
      
      const data = await response.json();
      
      if (response.ok) {
        // Update the local state immediately for better UX
        setGiftCard(prev => ({ ...prev, status: 'active' }));
        // Also refetch to ensure consistency
        refetchGiftCard();
      } else {
        console.error('Error activating gift card:', data);
        alert(data.error || 'Failed to activate gift card');
      }
    } catch (error) {
      console.error('Error activating gift card:', error);
      alert('Failed to activate gift card');
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
      const authorName = currentUser 
        ? `${currentUser.firstName} ${currentUser.lastName}` 
        : 'Staff';
        
      const response = await fetch(`/api/giftcards/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          comment: comment.trim(),
          authorName: authorName
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

  const handleDeleteComment = async (commentIndex) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const response = await fetch(`/api/giftcards/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          deleteCommentIndex: commentIndex
        }),
      });
      
      if (response.ok) {
        const updated = await response.json();
        setGiftCard(updated.data); // Update UI with comment removed
      } else {
        alert('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const emojis = ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '👍', '👎', '👏', '🙌', '👋', '🤝', '🙏', '💪', '❤️', '💔', '💕', '💖', '💗', '💙', '💚', '💛', '🧡', '💜', '🖤', '💯', '💢', '💥', '💫', '💦', '💨', '🔥', '✨', '🌟', '⭐', '🎉', '🎊', '🎈', '🎁'];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-[#6d7175]">Loading gift card...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !giftCard) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="text-[#6d7175] text-lg">{error || 'Gift card not found'}</div>
          <button
            onClick={() => router.push('/adminDashboard/GiftCards')}
            className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            Back to Gift Cards
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 bg-[#f1f1f1] max-w-[1400px] mx-auto">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Breadcrumb and Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => router.push('/adminDashboard/GiftCards')}
                className="text-[#6d7175] hover:text-[#303030] transition-colors shrink-0"
              >
                <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M13.5 3.5h-5.5v.75a.75.75 0 0 1-1.5 0v-.75h-4a.5.5 0 0 0-.5.5v3.043a.75.75 0 0 1 0 1.414v3.543a.5.5 0 0 0 .5.5h4v-1a.75.75 0 0 1 1.5 0v1h5.5a.5.5 0 0 0 .5-.5v-3.5h-1.25a.75.75 0 0 1 0-1.5h1.25v-3a.5.5 0 0 0-.5-.5m2 4.25v-3.75a2 2 0 0 0-2-2h-11a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2zm-8.703-1.758a2.117 2.117 0 0 0-4.047.88c0 1.171.95 2.128 2.125 2.128h.858c-.595.51-1.256.924-1.84 1.008a.749.749 0 1 0 .213 1.484c1.11-.158 2.128-.919 2.803-1.53a11 11 0 0 0 .341-.322q.16.158.34.322c.676.611 1.693 1.372 2.804 1.53a.749.749 0 1 0 .212-1.484c-.583-.084-1.244-.498-1.839-1.008h.858a2.13 2.13 0 0 0 2.125-2.128 2.118 2.118 0 0 0-4.047-.88l-.453.996zm-.962 1.508h-.96a.627.627 0 0 1-.625-.628.619.619 0 0 1 1.182-.259zm3.79 0h-.96l.403-.887a.618.618 0 0 1 1.182.259.63.63 0 0 1-.625.628"></path>
                </svg>
              </button>
              <svg width="10" height="20" viewBox="0 0 10 20" fill="none" className="text-[#8A8A8A] shrink-0 hidden sm:block">
                <path d="M4 8L6.5 11L4 14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <h1 className="text-[18px] sm:text-[20px] font-semibold text-[#303030] truncate">{giftCard.giftCardCode.slice(-4)}</h1>
              <div className="flex items-center gap-2">
                {giftCard.status === 'active' && (
                  <span className="px-2 py-1 text-[11px] sm:text-[12px] font-medium bg-[#d1f7c4] text-[#0f5132] rounded-md">Active</span>
                )}
                {giftCard.status === 'deactivated' && (
                  <span className="px-2 py-1 text-[11px] sm:text-[12px] font-medium bg-[#ffd79d] text-[#8a5700] rounded-md">Deactivated</span>
                )}
                {giftCard.status === 'used' && (
                  <span className="px-2 py-1 text-[11px] sm:text-[12px] font-medium bg-[#e1e5e9] text-[#6c757d] rounded-md">Used</span>
                )}
                {giftCard.status === 'expired' && (
                  <span className="px-2 py-1 text-[11px] sm:text-[12px] font-medium bg-[#f8d7da] text-[#721c24] rounded-md">Expired</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {giftCard.status === 'deactivated' ? (
                <button
                  onClick={handleActivate}
                  className="px-3 sm:px-4 py-2 border border-[#c9cccf] text-[#303030] text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Activate
                </button>
              ) : giftCard.status === 'active' ? (
                <button
                  onClick={handleDeactivate}
                  className="px-3 sm:px-4 py-2 border border-[#c9cccf] text-[#303030] text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Deactivate
                </button>
              ) : (
                <button
                  disabled
                  className="px-3 sm:px-4 py-2 border border-[#c9cccf] text-[#6c757d] text-[12px] sm:text-[13px] font-medium rounded-lg opacity-50 cursor-not-allowed"
                  title={`Cannot modify ${giftCard.status} gift card`}
                >
                  {giftCard.status === 'used' ? 'Used' : giftCard.status === 'expired' ? 'Expired' : 'Unavailable'}
                </button>
              )}
              <button
                disabled
                className="px-3 sm:px-4 py-2 bg-[#303030] text-white text-[12px] sm:text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Send gift card</span>
                <span className="sm:hidden">Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Gift Card Code Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <h2 className="text-[16px] sm:text-[20px] font-semibold text-[#303030] break-all">
                  {maskGiftCardCode(giftCard.giftCardCode)}
                </h2>
                <button 
                  onClick={handleOpenExpirationModal}
                  className="text-[#6d7175] hover:text-[#303030] shrink-0 ml-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M13.655 2.344a2.694 2.694 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.009.01-5.88 5.88a2.75 2.75 0 0 0-.806 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.54a2.694 2.694 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88zm2.75.629.599-.599a1.196 1.196 0 0 0-1.69-1.69l-.598.6z"></path>
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="text-[12px] sm:text-[13px] font-semibold text-[#303030] mb-1">Expiration date</div>
                    <div className="text-[12px] sm:text-[13px] text-[#6d7175]">
                      {giftCard.expirationType === 'no-expiration' 
                        ? "Doesn't expire"
                        : giftCard.expirationDate 
                          ? formatDate(giftCard.expirationDate)
                          : "Not set"
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] sm:text-[13px] font-semibold text-[#303030] mb-1">Recipient</div>
                    <div className="text-[12px] sm:text-[13px] text-[#6d7175]">None</div>
                  </div>
                </div>
                <div className="flex justify-center sm:justify-end">
                  <img 
                    src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/gift-card-1WjvjslvRoGt.svg" 
                    alt="Gift card" 
                    className="w-20 h-20 sm:w-24 sm:h-24"
                  />
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="sm:border-r border-[#e3e4e5] sm:pr-6 pb-4 sm:pb-0 border-b sm:border-b-0">
                  <div className="text-[12px] sm:text-[13px] text-[#303030] mb-2">Current balance</div>
                  <div className="text-[18px] sm:text-[20px] font-semibold text-[#303030]">
                    {giftCard.currency} {giftCard.currentBalance.toFixed(2)} PKR
                  </div>
                </div>
                <div className="pt-4 sm:pt-0">
                  <div className="text-[12px] sm:text-[13px] text-[#6d7175] mb-2">Initial balance</div>
                  <div className="text-[18px] sm:text-[20px] font-semibold text-[#6d7175]">
                    {giftCard.currency} {giftCard.initialValue.toFixed(2)} PKR
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 sm:p-6 border-b border-[#e3e4e5]">
                <h2 className="text-[14px] sm:text-[16px] font-semibold text-[#303030]">Timeline</h2>
              </div>
              
              <div className="p-4 sm:p-6">
                {/* Comment Editor */}
                <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#b4e3ff] flex items-center justify-center text-[12px] sm:text-[14px] font-semibold text-[#000000] shrink-0">
                    {currentUser 
                      ? `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`.toUpperCase()
                      : 'ST'
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Leave a comment..."
                      className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[12px] sm:text-[13px] text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#005bd3] resize-none"
                      rows={3}
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-3">
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
                          <div className="absolute left-0 bottom-full mb-2 bg-white border border-[#c9cccf] rounded-lg shadow-lg p-3 w-[280px] sm:w-[320px] max-h-[200px] overflow-y-auto z-50">
                            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                              {emojis.map((emoji, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleEmojiSelect(emoji)}
                                  className="text-[18px] sm:text-[20px] hover:bg-[#f1f1f1] rounded p-1 transition-colors"
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
                      </div>
                      <button
                        onClick={handlePostComment}
                        disabled={!comment.trim() || isPostingComment}
                        className="px-3 sm:px-4 py-2 border border-[#c9cccf] text-[#303030] text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                      >
                        {isPostingComment ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                    <div className="text-[11px] sm:text-[12px] text-[#6d7175] mt-2">
                      Only you and other staff can see comments
                    </div>
                  </div>
                </div>

                {/* Timeline Events */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Comments */}
                  {giftCard.comments && giftCard.comments.length > 0 && (
                    <div className="space-y-3 sm:space-y-4">
                      {giftCard.comments.slice().reverse().map((commentItem, index) => {
                        // Calculate the original index in the non-reversed array
                        const originalIndex = giftCard.comments.length - 1 - index;
                        return (
                          <div key={index} className="flex gap-2 sm:gap-3 group">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#b4e3ff] flex items-center justify-center text-[12px] sm:text-[14px] font-semibold text-[#000000] shrink-0">
                              {commentItem.authorName ? commentItem.authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST'}
                            </div>
                            <div className="flex-1 bg-[#f9fafb] rounded-lg p-3 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                                <span className="text-[12px] sm:text-[13px] font-semibold text-[#303030]">
                                  {commentItem.authorName || 'Staff'}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] sm:text-[12px] text-[#6d7175]">
                                    {formatTime(commentItem.createdAt)}
                                  </span>
                                  <button
                                    onClick={() => handleDeleteComment(originalIndex)}
                                    className="opacity-0 group-hover:opacity-100 text-[#6d7175] hover:text-red-500 transition-all duration-200 p-1 hover:bg-red-50 rounded"
                                    title="Delete comment"
                                  >
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 6h18"></path>
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <p className="text-[12px] sm:text-[13px] text-[#303030] whitespace-pre-wrap wrap-break-word">{commentItem.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Creation Event */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-[12px] sm:text-[13px] font-semibold text-[#303030]">
                      {formatDate(giftCard.createdAt)}
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#303030] mt-1.5 shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <p className="text-[12px] sm:text-[13px] text-[#303030]">
                            You created a new {giftCard.currency}{giftCard.initialValue.toFixed(2)} PKR gift card.
                          </p>
                          <span className="text-[11px] sm:text-[13px] text-[#6d7175] shrink-0">{formatTime(giftCard.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Created By */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-[12px] sm:text-[13px] font-semibold text-[#303030] mb-3">Created by</h3>
              <p className="text-[12px] sm:text-[13px] text-[#303030]">
                {giftCard.createdBy?.firstName && giftCard.createdBy?.lastName
                  ? `${giftCard.createdBy.firstName} ${giftCard.createdBy.lastName}`
                  : currentUser 
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : 'Staff'
                }
              </p>
            </div>

            {/* Customer */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-[12px] sm:text-[13px] font-semibold text-[#303030] mb-3">Customer</h3>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6d7175]">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M10.323 11.383a5.5 5.5 0 1 1-3.323-9.883 5.5 5.5 0 0 1 4.383 8.823l2.897 2.897a.749.749 0 1 1-1.06 1.06zm.677-4.383c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search or create customer"
                  className="w-full pl-9 sm:pl-10 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[12px] sm:text-[13px] text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[12px] sm:text-[13px] font-semibold text-[#303030]">Notes</h3>
                <button
                  onClick={() => setIsEditingNotes(!isEditingNotes)}
                  className="text-[#6d7175] hover:text-[#303030]"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M13.655 2.344a2.694 2.694 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.009.01-5.88 5.88a2.75 2.75 0 0 0-.806 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.54a2.694 2.694 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88zm2.75.629.599-.599a1.196 1.196 0 0 0-1.69-1.69l-.598.6z"></path>
                  </svg>
                </button>
              </div>
              {isEditingNotes ? (
                <div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[12px] sm:text-[13px] text-[#303030] focus:outline-none focus:ring-2 focus:ring-[#005bd3] resize-none mb-3"
                    rows={4}
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 py-1.5 bg-[#303030] text-white text-[11px] sm:text-[12px] font-medium rounded-lg hover:bg-[#1a1a1a] transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingNotes(false);
                        setNotes(giftCard.notes || '');
                      }}
                      className="px-3 py-1.5 border border-[#c9cccf] text-[#303030] text-[11px] sm:text-[12px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[12px] sm:text-[13px] text-[#6d7175]">
                  {giftCard.notes || 'No notes'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Expiration Date Modal */}
      {isEditingExpiration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={handleCancelExpiration}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[500px] max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#e3e4e5]">
              <h2 className="text-[14px] sm:text-[16px] font-semibold text-[#303030]">Edit expiration date</h2>
              <button
                onClick={handleCancelExpiration}
                className="text-[#6d7175] hover:text-[#303030] p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11.97 13.03a.749.749 0 1 0 1.06-1.06l-3.97-3.97 3.97-3.97a.749.749 0 1 0-1.06-1.06l-3.97 3.97-3.97-3.97a.749.749 0 1 0-1.06 1.06l3.97 3.97-3.97 3.97a.749.749 0 1 0 1.06 1.06l3.97-3.97z"></path>
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 max-h-[calc(90vh-140px)] overflow-y-auto">
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
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-[#e3e4e5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#6d7175]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 4a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 .75-.75"></path>
                      <path d="M8 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
                      <path fillRule="evenodd" d="M1.5 6.25a4.75 4.75 0 0 1 4.75-4.75h3.5a4.75 4.75 0 0 1 4.75 4.75v2.5a4.75 4.75 0 0 1-4.573 4.747l-1.335 1.714a.75.75 0 0 1-1.189-.007l-1.3-1.706a4.75 4.75 0 0 1-4.603-4.748zm4.75-3.25a3.25 3.25 0 0 0-3.25 3.25v2.5a3.25 3.25 0 0 0 3.25 3.25h.226c.234 0 .455.11.597.296l.934 1.225.96-1.232a.75.75 0 0 1 .591-.289h.192a3.25 3.25 0 0 0 3.25-3.25v-2.5a3.25 3.25 0 0 0-3.25-3.25z"></path>
                    </svg>
                    <span className="text-[12px] sm:text-[13px] text-[#6d7175]">Unsaved changes</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCancelExpiration}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-[#c9cccf] text-[#303030] text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveExpiration}
                  disabled={!hasUnsavedChanges}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-[#303030] text-white text-[12px] sm:text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

