import React, { useState, useEffect, useRef } from 'react';
import { Heart, MapPin, MessageCircle, Search, Star, ThumbsUp, ThumbsDown, Home, Navigation, Bookmark, User, Loader } from 'lucide-react';

const MamaMapsZW = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedListing, setSelectedListing] = useState(null);
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});

  const SHEET_ID = '1aVOYA1EvDdgvx1Wn5qsSseh_4uI2ejzmbyiwlrHUTfw';
  const API_KEY = 'AIzaSyAcsSXWKoMbQHSzkOrPijFk31wRLJxzo18';

  // Fetch data from Google Sheets
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const range = 'Sheet1!A:Z';
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.values && data.values.length > 1) {
          const headers = data.values[0];
          const rows = data.values.slice(1);

          const formattedListings = rows
            .filter(row => row[23] === 'active') // status = active
            .map((row, idx) => ({
              id: row[0] || `mm_${idx}`,
              name: row[1] || '',
              category: row[2] || '',
              subcategory: row[3] || '',
              location: row[4] || '',
              tags: row[5] ? row[5].split(',').map(t => t.trim()) : [],
              whatsapp: row[6] || '',
              description: row[7] || '',
              imageUrl: row[8] || 'https://via.placeholder.com/300x200?text=MamaMaps',
              verified: row[9] === 'TRUE',
              helpfulVotes: parseInt(row[10]) || 0,
              notHelpfulVotes: parseInt(row[11]) || 0,
              ratingPercentage: row[12] || '0%',
              topReviews: row[13] ? row[13].split(',').map(r => r.trim()) : [],
              featured: row[14] === 'TRUE',
              topPick: row[15] === 'TRUE',
              priorityScore: parseInt(row[16]) || 5,
              deals: row[17] || '',
              hoursStatus: row[18] || 'open',
            }));

          setListings(formattedListings);
          setFilteredListings(formattedListings);

          // Load saved listings from localStorage
          const saved = JSON.parse(localStorage.getItem('savedListings') || '[]');
          setSavedListings(saved);

          // Initialize ratings
          const initialRatings = {};
          formattedListings.forEach(listing => {
            initialRatings[listing.id] = {
              helpful: listing.helpfulVotes,
              notHelpful: listing.notHelpfulVotes,
            };
          });
          setRatings(initialRatings);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => console.log('Location access denied')
      );
    }
  }, []);

  // Calculate distance (rough estimate)
  const calculateDistance = (lat, lng) => {
    if (!userLocation) return null;
    const R = 6371; // Earth radius in km
    const dLat = (lat - userLocation.lat) * (Math.PI / 180);
    const dLng = (lng - userLocation.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLocation.lat * (Math.PI / 180)) *
        Math.cos(lat * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance < 100 ? distance.toFixed(1) : null; // Only show if < 100km
  };

  // Filter and sort listings
  useEffect(() => {
    let filtered = listings;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((listing) =>
        listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((listing) =>
        listing.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort: featured first, then by priority score, then by rating
    filtered.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.priorityScore !== b.priorityScore) return b.priorityScore - a.priorityScore;
      const aRating = a.helpfulVotes / (a.helpfulVotes + a.notHelpfulVotes || 1);
      const bRating = b.helpfulVotes / (b.helpfulVotes + b.notHelpfulVotes || 1);
      return bRating - aRating;
    });

    setFilteredListings(filtered);
  }, [searchQuery, selectedCategory, listings]);

  // WhatsApp handler
  const handleWhatsApp = (listing) => {
    const message = `Hi, I found you on MamaMaps ZW. Do you have ${listing.subcategory}? 👶`;
    const whatsappUrl = `https://wa.me/${listing.whatsapp.replace(/[^\d+]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Save/unsave listing
  const toggleSave = (listing) => {
    const updated = savedListings.includes(listing.id)
      ? savedListings.filter(id => id !== listing.id)
      : [...savedListings, listing.id];
    setSavedListings(updated);
    localStorage.setItem('savedListings', JSON.stringify(updated));
  };

  // Handle ratings
  const handleRating = (listingId, type) => {
    setRatings(prev => ({
      ...prev,
      [listingId]: {
        ...prev[listingId],
        [type]: prev[listingId][type] + 1,
      },
    }));
  };

  // Categories with icons and use cases
  const categories = [
    { value: 'diapers', label: 'Diapers', emoji: '👶' },
    { value: 'formula', label: 'Formula', emoji: '🍼' },
    { value: 'clinics', label: 'Clinics', emoji: '🏥' },
    { value: 'clothes', label: 'Clothes', emoji: '👕' },
    { value: 'cakes', label: 'Cakes', emoji: '🎂' },
    { value: 'schools', label: 'Schools', emoji: '🏫' },
  ];

  const useCases = [
    '💚 Where to buy affordable diapers?',
    '🏥 Emergency baby clinics open now',
    '🍼 Best baby formula in Harare',
    '👶 Safe baby clothes nearby',
  ];

  // Featured listings (top picks)
  const topPicks = filteredListings.filter(l => l.featured || l.topPick).slice(0, 3);
  const nearbyListings = filteredListings.filter(l => calculateDistance(0, 0) !== null).slice(0, 4);

  if (loading) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #FEE4E1 0%, #FCE4EC 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader size={48} style={{ animation: 'spin 1s linear infinite', marginBottom: '16px', color: '#C2185B' }} />
          <p style={{ fontSize: '16px', color: '#C2185B', fontWeight: '500' }}>Loading trusted places for your baby...</p>
        </div>
      </div>
    );
  }

  const activeListings = activeTab === 'saved' ? filteredListings.filter(l => savedListings.includes(l.id)) : filteredListings;

  return (
    <div style={{ background: '#FFFAF8', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#2C2C2A' }}>
      {/* Header */}
      {activeTab === 'home' && (
        <>
          <div style={{ background: 'linear-gradient(135deg, #FEE4E1 0%, #F8D7DA 100%)', padding: '20px 16px 24px', borderBottom: '1px solid #FFD4D8' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <Heart size={32} fill="#D4537E" color="#D4537E" />
                <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#5C3D5C' }}>MamaMaps ZW</h1>
              </div>
              <p style={{ fontSize: '14px', color: '#7C5A7C', margin: '0 0 16px 0', fontWeight: '500' }}>Where moms go, not guess.</p>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={20} style={{ position: 'absolute', left: '12px', top: '10px', color: '#D4537E' }} />
                <input
                  type="text"
                  placeholder="Search diapers, clinics, formula..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    borderRadius: '20px',
                    border: '1px solid #FFB6C6',
                    fontSize: '14px',
                    background: '#FFF9F7',
                  }}
                />
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(selectedCategory === cat.value ? '' : cat.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '16px',
                      border: 'none',
                      background: selectedCategory === cat.value ? '#D4537E' : '#FFF0F5',
                      color: selectedCategory === cat.value ? '#FFF' : '#5C3D5C',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Use Cases Section */}
          <div style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#5C3D5C', marginBottom: '12px' }}>Moms are searching for:</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {useCases.map((useCase, idx) => (
                <div
                  key={idx}
                  onClick={() => setSearchQuery(useCase.split(' ').slice(1).join(' '))}
                  style={{
                    padding: '12px 16px',
                    background: '#FEF4F1',
                    borderRadius: '8px',
                    border: '1px solid #FFD4D8',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: '#3C3489',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FFE8EC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#FEF4F1')}
                >
                  {useCase}
                  <span style={{ fontSize: '18px' }}>→</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
        {/* Top Picks Section (Home tab only) */}
        {activeTab === 'home' && topPicks.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#5C3D5C', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ⭐ Top Picks by Moms
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {topPicks.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onSave={toggleSave} isSaved={savedListings.includes(listing.id)} onWhatsApp={handleWhatsApp} ratings={ratings} onRate={handleRating} />
              ))}
            </div>
          </div>
        )}

        {/* Filtered Results */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#5C3D5C', marginBottom: '12px' }}>
            {activeTab === 'saved' ? 'Saved Places' : searchQuery || selectedCategory ? 'Results' : 'All Places'}
          </h2>
          {activeListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888780' }}>
              <Heart size={48} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontSize: '14px' }}>No places found. Try a different search.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {activeListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} onSave={toggleSave} isSaved={savedListings.includes(listing.id)} onWhatsApp={handleWhatsApp} ratings={ratings} onRate={handleRating} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#FFF',
        borderTop: '1px solid #FFD4D8',
        display: 'flex',
        justifyContent: 'space-around',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'search', icon: Search, label: 'Search' },
          { id: 'saved', icon: Bookmark, label: 'Saved' },
          { id: 'profile', icon: User, label: 'Profile' },
        ].map((nav) => (
          <button
            key={nav.id}
            onClick={() => setActiveTab(nav.id)}
            style={{
              flex: 1,
              padding: '12px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === nav.id ? '#D4537E' : '#888780',
              fontSize: '12px',
              fontWeight: activeTab === nav.id ? '600' : '400',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s',
            }}
          >
            <nav.icon size={20} />
            {nav.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Listing Card Component
const ListingCard = ({ listing, onSave, isSaved, onWhatsApp, ratings, onRate }) => {
  const ratingData = ratings[listing.id] || { helpful: 0, notHelpful: 0 };
  const totalVotes = ratingData.helpful + ratingData.notHelpful;
  const percentage = totalVotes > 0 ? Math.round((ratingData.helpful / totalVotes) * 100) : 0;

  return (
    <div style={{
      background: '#FFF',
      borderRadius: '12px',
      border: '1px solid #FFD4D8',
      overflow: 'hidden',
      transition: 'all 0.2s',
    }}>
      {/* Image */}
      <div style={{ position: 'relative', height: '120px', background: '#FEF4F1', overflow: 'hidden' }}>
        <img src={listing.imageUrl} alt={listing.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <button
          onClick={() => onSave(listing)}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: isSaved ? '#D4537E' : '#FFF',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Heart size={18} fill={isSaved ? '#FFF' : '#D4537E'} color={isSaved ? '#FFF' : '#D4537E'} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '12px 14px' }}>
        {/* Header */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', margin: 0, color: '#2C2C2A', flex: 1 }}>{listing.name}</h3>
            {listing.featured && <span style={{ background: '#FFD700', color: '#5C3D5C', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>Featured</span>}
            {listing.topPick && <span style={{ background: '#E1D5F7', color: '#3C3489', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>Top Pick</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#888780', marginBottom: '4px' }}>
            <MapPin size={14} />
            {listing.location}
          </div>
          {listing.deals && (
            <div style={{ fontSize: '12px', color: '#D4537E', fontWeight: '500', marginBottom: '4px' }}>
              🎉 {listing.deals}
            </div>
          )}
        </div>

        {/* Description */}
        <p style={{ fontSize: '13px', color: '#5C3D5C', margin: '0 0 8px 0', lineHeight: '1.4' }}>{listing.description}</p>

        {/* Trust Signals */}
        {listing.verified && (
          <div style={{ fontSize: '12px', color: '#1D9E75', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            ✅ Verified by MamaMaps
          </div>
        )}

        {/* Rating */}
        {totalVotes > 0 && (
          <div style={{ fontSize: '12px', color: '#888780', marginBottom: '8px' }}>
            ⭐ {percentage}% helpful ({totalVotes} moms voted)
          </div>
        )}

        {/* Top Reviews */}
        {listing.topReviews.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {listing.topReviews.slice(0, 2).map((review, idx) => (
              <span key={idx} style={{ fontSize: '11px', background: '#FEF4F1', color: '#5C3D5C', padding: '3px 8px', borderRadius: '12px' }}>
                "{review}"
              </span>
            ))}
          </div>
        )}

        {/* Rating Buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <button
            onClick={() => onRate(listing.id, 'helpful')}
            style={{
              flex: 1,
              padding: '6px 8px',
              background: '#FEF4F1',
              border: '1px solid #FFD4D8',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#5C3D5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              fontWeight: '500',
            }}
          >
            👍 {ratingData.helpful > 0 ? ratingData.helpful : 'Helpful'}
          </button>
          <button
            onClick={() => onRate(listing.id, 'notHelpful')}
            style={{
              flex: 1,
              padding: '6px 8px',
              background: '#FEF4F1',
              border: '1px solid #FFD4D8',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#5C3D5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              fontWeight: '500',
            }}
          >
            👎 {ratingData.notHelpful > 0 ? ratingData.notHelpful : 'Not helpful'}
          </button>
        </div>

        {/* WhatsApp Button */}
        <button
          onClick={() => onWhatsApp(listing)}
          style={{
            width: '100%',
            padding: '10px 12px',
            background: '#25D366',
            color: '#FFF',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#1FAE56')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#25D366')}
        >
          <MessageCircle size={16} />
          Chat on WhatsApp
        </button>
      </div>
    </div>
  );
};

export default MamaMapsZW;
