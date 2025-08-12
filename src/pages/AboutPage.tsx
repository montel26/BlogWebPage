import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Calendar, Instagram, Mail, Camera, Quote, ArrowRight, Coffee, MapPin, User, LogOut, Edit, Save, X, Plus, Trash2, ExternalLink, Monitor } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';
import ProfileEditModal from '@/components/ProfileEditModal';

export default function AboutPage() {
  const { isAuthenticated, login, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [authError, setAuthError] = useState('');
  const [userProfile, setUserProfile] = useLocalStorage('userProfile', {
    name: 'Ronel',
    bio: "Welcome to my review universe! I'm passionate about anime, movies, and books. Join me as I explore amazing stories and share honest opinions.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    location: 'South Africa',
    tagline: 'Powered by a nerd',
    blogStartYear: '2022',
    fullBio: "My reviewing journey started during the pandemic when I had more time to dive deep into the worlds of anime, movies, and books. What began as personal notes and recommendations to friends evolved into a full-fledged review blog dedicated to sharing honest opinions about great stories.",
    philosophy: "Every story has the power to change someone's world.",
    interests: ['Anime Series', 'Movie Releases', 'Fantasy Books', 'Cozy Reading', 'Story Photography'],
    stats: {
      animeWatched: '200+',
      movieWatchlist: '500+',
      booksRead: '150+',
      reviewsWritten: '75+'
    },
    socialLinks: {
      instagram: '',
      youtube: '',
      letterboxd: '',
      email: ''
    },
    favoriteGenres: {
      anime: ['Slice of Life', 'Fantasy', 'Romance'],
      movies: ['Indie Films', 'Sci-Fi', 'Drama'],
      books: ['Fantasy', 'Young Adult', 'Contemporary']
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [newInterest, setNewInterest] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save functionality - save changes to localStorage immediately
  useEffect(() => {
    if (editedProfile !== userProfile && hasUnsavedChanges) {
      const timeoutId = setTimeout(() => {
        try {
          setUserProfile(editedProfile);
          window.dispatchEvent(new CustomEvent('profileUpdated', { detail: editedProfile }));
          setHasUnsavedChanges(false);
          console.log('Profile auto-saved to localStorage');
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [editedProfile, userProfile, hasUnsavedChanges, setUserProfile]);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      setUserProfile(event.detail);
      setEditedProfile(event.detail);
    };
    window.addEventListener('profileUpdated', handleProfileUpdate as (event: Event) => void);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as (event: Event) => void);
    };
  }, [setUserProfile]);

  // Update edited profile when user profile changes
  useEffect(() => {
    setEditedProfile(userProfile);
    setHasUnsavedChanges(false);
  }, [userProfile]);

  // Track changes to edited profile
  useEffect(() => {
    const hasChanges = JSON.stringify(editedProfile) !== JSON.stringify(userProfile);
    setHasUnsavedChanges(hasChanges);
  }, [editedProfile, userProfile]);

  const handleAuthenticate = (password: string) => {
    if (login(password)) {
      setShowAuthModal(false);
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  const handleSignOut = () => {
    logout();
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      try {
        // Validate required fields
        if (!editedProfile.name?.trim()) {
          alert('Name is required');
          return;
        }
        if (!editedProfile.bio?.trim()) {
          alert('Bio is required');
          return;
        }
        
        // Save changes immediately to localStorage
        const updatedProfile = { ...editedProfile };
        setUserProfile(updatedProfile);
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedProfile }));
        setHasUnsavedChanges(false);
        
        // Show success message
        console.log('Profile saved successfully to localStorage');
      } catch (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile. Please try again.');
        return;
      }
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes. Are you sure you want to discard them?');
      if (!confirmDiscard) return;
    }
    setEditedProfile(userProfile);
    setIsEditing(false);
    setActiveSection('');
    setHasUnsavedChanges(false);
  };

  const updateEditedProfile = (field: string, value: string | string[] | Record<string, string>) => {
    setEditedProfile(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Auto-save simple text fields immediately
      if (typeof value === 'string' && !isEditing) {
        setTimeout(() => {
          setUserProfile(updated);
          window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updated }));
        }, 500);
      }
      
      return updated;
    });
  };

  const updateNestedField = (section: string, field: string, value: string | string[]) => {
    setEditedProfile(prev => {
      const updated = {
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [field]: value
        }
      };
      
      // Auto-save nested fields
      setTimeout(() => {
        setUserProfile(updated);
        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updated }));
      }, 500);
      
      return updated;
    });
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      updateEditedProfile('interests', [...(editedProfile.interests || []), newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (index: number) => {
    updateEditedProfile('interests', (editedProfile.interests || []).filter((_, i) => i !== index));
  };

  const addGenre = (type: 'anime' | 'movies' | 'books', genre: string) => {
    if (genre.trim()) {
      updateNestedField('favoriteGenres', type, [...(editedProfile.favoriteGenres?.[type] || []), genre.trim()]);
    }
  };

  const removeGenre = (type: 'anime' | 'movies' | 'books', index: number) => {
    updateNestedField('favoriteGenres', type, (editedProfile.favoriteGenres?.[type] || []).filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <Header 
        isAuthenticated={isAuthenticated}
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
        onEditProfile={() => setShowProfileEditModal(true)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setAuthError('');
        }}
        onAuthenticate={handleAuthenticate}
        error={authError}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
      />

      <div className="max-w-5xl mx-auto px-6 pb-12">
        {/* Edit Mode Toggle */}
        {isAuthenticated && (
          <div className="flex justify-end mb-6">
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel {hasUnsavedChanges && '•'}
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-full transition-colors ${
                      hasUnsavedChanges 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!hasUnsavedChanges}
                  >
                    <Save className="w-4 h-4" />
                    Save Changes {hasUnsavedChanges && '•'}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-pink-200 mb-12">
          <div className="relative h-96 bg-gradient-to-br from-pink-300 via-rose-300 to-purple-400">
            <div className="absolute inset-0 bg-white bg-opacity-20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 bg-white rounded-full shadow-xl flex items-center justify-center relative">
                {isEditing ? (
                  <div className="relative group">
                    <img 
                      src={editedProfile.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                      alt={`About ${editedProfile.name}`}
                      className="w-44 h-44 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <div className="text-center p-4">
                        <input
                          type="url"
                          value={editedProfile.avatar || ''}
                          onChange={(e) => updateEditedProfile('avatar', e.target.value)}
                          placeholder="Enter avatar URL"
                          className="w-full p-2 text-xs border rounded text-black mb-2"
                        />
                        <div className="text-white text-xs">Click to edit avatar</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={userProfile.avatar}
                    alt={`About ${userProfile.name}`}
                    className="w-44 h-44 rounded-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="absolute top-6 right-6">
              <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                MY REVIEW
              </span>
            </div>
          </div>
          <div className="p-8 text-center">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => updateEditedProfile('name', e.target.value)}
                  className="text-4xl font-bold text-pink-800 mb-4 bg-transparent border-b-2 border-pink-300 text-center w-full focus:outline-none focus:border-pink-500"
                />
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => updateEditedProfile('bio', e.target.value)}
                  className="text-xl text-pink-600 mb-6 bg-transparent border border-pink-300 rounded-lg p-3 w-full focus:outline-none focus:border-pink-500 resize-none"
                  rows={3}
                />
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-pink-800 mb-4">Hi! I'm {userProfile.name} ✨</h1>
                <p className="text-xl text-pink-600 mb-6">{userProfile.bio}</p>
              </>
            )}
            <div className="flex items-center justify-center gap-6 text-pink-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => updateEditedProfile('location', e.target.value)}
                    className="text-sm bg-transparent border-b border-pink-300 focus:outline-none focus:border-pink-500"
                  />
                ) : (
                  <span className="text-sm">{userProfile.location}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.tagline}
                    onChange={(e) => updateEditedProfile('tagline', e.target.value)}
                    className="text-sm bg-transparent border-b border-pink-300 focus:outline-none focus:border-pink-500"
                  />
                ) : (
                  <span className="text-sm">{userProfile.tagline}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <span className="text-sm">Blogging since</span>
                    <input
                      type="text"
                      value={editedProfile.blogStartYear}
                      onChange={(e) => updateEditedProfile('blogStartYear', e.target.value)}
                      className="text-sm bg-transparent border-b border-pink-300 focus:outline-none focus:border-pink-500 w-16"
                    />
                  </div>
                ) : (
                  <span className="text-sm">Blogging since {userProfile.blogStartYear}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Meet Me Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-pink-500" />
                  <h2 className="text-2xl font-semibold text-pink-700">Meet Me</h2>
                </div>
                {isAuthenticated && !isEditing && (
                  <button
                    onClick={() => setActiveSection('meetMe')}
                    className="text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {isEditing || activeSection === 'meetMe' ? (
                    <div className="space-y-4">
                      <textarea
                        value={editedProfile.fullBio}
                        onChange={(e) => updateEditedProfile('fullBio', e.target.value)}
                        className="w-full p-3 border border-pink-300 rounded-lg text-pink-900 leading-relaxed focus:outline-none focus:border-pink-500 resize-none"
                        rows={6}
                        placeholder="Tell your story..."
                      />
                      <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
                        <Quote className="w-5 h-5 text-pink-400 mb-2" />
                        <textarea
                          value={editedProfile.philosophy}
                          onChange={(e) => updateEditedProfile('philosophy', e.target.value)}
                          className="w-full bg-transparent text-pink-700 italic text-sm focus:outline-none resize-none"
                          rows={2}
                          placeholder="Your reviewing philosophy..."
                        />
                        <p className="text-pink-600 text-xs mt-1">- My reviewing philosophy</p>
                      </div>
                      {activeSection === 'meetMe' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              try {
                                if (!editedProfile.fullBio?.trim()) {
                                  alert('Bio cannot be empty');
                                  return;
                                }
                                setUserProfile(editedProfile);
                                window.dispatchEvent(new CustomEvent('profileUpdated', { detail: editedProfile }));
                                setActiveSection('');
                                setHasUnsavedChanges(false);
                              } catch (error) {
                                console.error('Error saving:', error);
                                alert('Error saving changes');
                              }
                            }}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              if (hasUnsavedChanges) {
                                const confirm = window.confirm('Discard changes?');
                                if (!confirm) return;
                              }
                              setEditedProfile(userProfile);
                              setActiveSection('');
                              setHasUnsavedChanges(false);
                            }}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className="text-pink-900 leading-relaxed mb-4">
                        Welcome to my review paradise! I'm {userProfile.name}, a content creator who believes that great stories deserve to be shared and discussed with passion.
                      </p>
                      <p className="text-pink-900 leading-relaxed mb-4">
                        {userProfile.fullBio}
                      </p>
                      <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
                        <Quote className="w-5 h-5 text-pink-400 mb-2" />
                        <p className="text-pink-700 italic text-sm">
                          "{userProfile.philosophy}" - My reviewing philosophy
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" 
                    alt="Anime" 
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <img 
                      src="https://images.unsplash.com/photo-1489599510726-e3275cdb5c0b?w=200&h=150&fit=crop" 
                      alt="Movies" 
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=150&fit=crop" 
                      alt="Books" 
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* My Interests & Stats Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Camera className="w-6 h-6 text-pink-500" />
                  <h2 className="text-2xl font-semibold text-pink-700">My Interests & Stats</h2>
                </div>
                {isAuthenticated && !isEditing && (
                  <button
                    onClick={() => setActiveSection('interests')}
                    className="text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Interests */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-pink-800 mb-3">What I Love:</h3>
                {isEditing || activeSection === 'interests' ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(editedProfile.interests || []).map((interest, index) => (
                        <div key={index} className="flex items-center gap-1 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                          <span>{interest}</span>
                          <button
                            onClick={() => removeInterest(index)}
                            className="text-pink-500 hover:text-pink-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add new interest"
                        className="flex-1 p-2 border border-pink-300 rounded-lg focus:outline-none focus:border-pink-500"
                        onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                      />
                      <button
                        onClick={addInterest}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {activeSection === 'interests' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            try {
                              setUserProfile(editedProfile);
                              window.dispatchEvent(new CustomEvent('profileUpdated', { detail: editedProfile }));
                              setActiveSection('');
                              setHasUnsavedChanges(false);
                            } catch (error) {
                              console.error('Error saving:', error);
                              alert('Error saving changes');
                            }
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            if (hasUnsavedChanges) {
                              const confirm = window.confirm('Discard changes?');
                              if (!confirm) return;
                            }
                            setEditedProfile(userProfile);
                            setActiveSection('');
                            setHasUnsavedChanges(false);
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(userProfile.interests || []).map((interest, index) => (
                      <span key={index} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-pink-800">My Review Stats:</h3>
                  {isAuthenticated && !isEditing && (
                    <button
                      onClick={() => setActiveSection('stats')}
                      className="text-pink-500 hover:text-pink-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {isEditing || activeSection === 'stats' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(editedProfile.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateNestedField('stats', key, e.target.value)}
                          className="w-full text-center text-lg font-bold text-pink-800 bg-transparent border-b border-pink-300 focus:outline-none focus:border-pink-500"
                        />
                        <p className="text-pink-600 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      </div>
                    ))}
                    {activeSection === 'stats' && (
                      <div className="col-span-full flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            setUserProfile(editedProfile);
                            setActiveSection('');
                          }}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditedProfile(userProfile);
                            setActiveSection('');
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-pink-800">{userProfile.stats.animeWatched}</div>
                      <p className="text-pink-600 text-sm">Anime Watched</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-800">{userProfile.stats.movieWatchlist}</div>
                      <p className="text-pink-600 text-sm">Movie Watchlist</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-800">{userProfile.stats.booksRead}</div>
                      <p className="text-pink-600 text-sm">Books Read</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-800">{userProfile.stats.reviewsWritten}</div>
                      <p className="text-pink-600 text-sm">Reviews Written</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Favorite Genres Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-pink-500" />
                  <h2 className="text-2xl font-semibold text-pink-700">Favorite Genres</h2>
                </div>
                {isAuthenticated && !isEditing && (
                  <button
                    onClick={() => setActiveSection('genres')}
                    className="text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {(['anime', 'movies', 'books'] as const).map((type) => (
                  <div key={type} className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-100">
                    <h4 className="font-semibold text-pink-800 mb-3 capitalize flex items-center gap-2">
                      {type === 'anime' && <Monitor className="w-4 h-4" />}
                      {type === 'movies' && <Camera className="w-4 h-4" />}
                      {type === 'books' && <Heart className="w-4 h-4" />}
                      {type}
                    </h4>
                    {isEditing || activeSection === 'genres' ? (
                      <div className="space-y-2">
                        {(editedProfile.favoriteGenres?.[type] || []).map((genre, index) => (
                          <div key={index} className="flex items-center justify-between bg-white px-3 py-1 rounded-full">
                            <span className="text-pink-700 text-sm">{genre}</span>
                            <button
                              onClick={() => removeGenre(type, index)}
                              className="text-pink-500 hover:text-pink-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        <div className="flex gap-1">
                          <input
                            type="text"
                            placeholder={`Add ${type} genre`}
                            className="flex-1 p-1 text-xs border border-pink-300 rounded focus:outline-none focus:border-pink-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addGenre(type, (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {(userProfile.favoriteGenres?.[type] || []).map((genre, index) => (
                          <span key={index} className="inline-block bg-white text-pink-700 px-3 py-1 rounded-full text-sm mr-1 mb-1">
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {activeSection === 'genres' && (
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => {
                      try {
                        const updatedProfile = { ...editedProfile };
                        setUserProfile(updatedProfile);
                        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                        window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedProfile }));
                        setActiveSection('');
                        setHasUnsavedChanges(false);
                        console.log('Genres section saved to localStorage');
                      } catch (error) {
                        console.error('Error saving:', error);
                        alert('Error saving changes');
                      }
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      if (hasUnsavedChanges) {
                        const confirm = window.confirm('Discard changes?');
                        if (!confirm) return;
                      }
                      setEditedProfile(userProfile);
                      setActiveSection('');
                      setHasUnsavedChanges(false);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* What You'll Find Here */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-200">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-pink-500" />
                <h2 className="text-2xl font-semibold text-pink-700">What You'll Find Here</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
                    <h4 className="font-semibold text-pink-800 mb-2">📺 Anime Reviews</h4>
                    <p className="text-pink-700 text-sm">In-depth reviews of anime series and movies, from shounen adventures to slice-of-life gems.</p>
                  </div>
                  <div className="bg-rose-50 p-4 rounded-xl border border-rose-200">
                    <h4 className="font-semibold text-rose-800 mb-2">🎬 Movie Reviews</h4>
                    <p className="text-rose-700 text-sm">Honest takes on the latest releases, indie films, and timeless classics worth watching.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">📚 Book Reviews</h4>
                    <p className="text-purple-700 text-sm">Thoughtful reviews of novels, manga, and graphic novels across all genres.</p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-xl border border-pink-200">
                    <h4 className="font-semibold text-pink-800 mb-2">✨ Recommendations</h4>
                    <p className="text-pink-700 text-sm">Curated lists and seasonal recommendations to help you discover your next favorite story.</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-full transition-colors shadow-lg"
                >
                  <Heart className="w-4 h-4" />
                  Explore My Latest Reviews
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Let's Connect */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-pink-700 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Let's Connect
                </h3>
                {isAuthenticated && !isEditing && (
                  <button
                    onClick={() => setActiveSection('social')}
                    className="text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <p className="text-pink-900 text-sm mb-4">
                I love connecting with fellow story enthusiasts! Follow me on social media for daily reviews and recommendations.
              </p>
              
              {isEditing || activeSection === 'social' ? (
                <div className="space-y-3">
                  {Object.entries(editedProfile.socialLinks).map(([platform, handle]) => (
                    <div key={platform} className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl">
                      {platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-500" />}
                      {platform === 'youtube' && <Camera className="w-5 h-5 text-red-500" />}
                      {platform === 'letterboxd' && <Heart className="w-5 h-5 text-green-500" />}
                      {platform === 'email' && <Mail className="w-5 h-5 text-blue-500" />}
                      <div className="flex-1">
                        <div className="font-medium text-pink-800 capitalize">{platform}</div>
                        <input
                          type="text"
                          value={handle}
                          onChange={(e) => updateNestedField('socialLinks', platform, e.target.value)}
                          className="text-xs text-pink-600 bg-transparent border-b border-pink-300 focus:outline-none focus:border-pink-500 w-full"
                        />
                      </div>
                    </div>
                  ))}
                  
                  {activeSection === 'social' && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          const updatedProfile = { ...editedProfile };
                          setUserProfile(updatedProfile);
                          localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                          window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedProfile }));
                          setActiveSection('');
                          console.log('Social links saved to localStorage');
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditedProfile(userProfile);
                          setActiveSection('');
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <a 
                    href={`https://instagram.com/${userProfile.socialLinks.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors group"
                  >
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <div>
                      <div className="font-medium text-pink-800">{userProfile.socialLinks.instagram}</div>
                      <div className="text-xs text-pink-600">Daily reviews & recommendations</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-pink-400 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a 
                    href={`mailto:${userProfile.socialLinks.email}`}
                    className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors group"
                  >
                    <Mail className="w-5 h-5 text-rose-500" />
                    <div>
                      <div className="font-medium text-rose-800">Email Me</div>
                      <div className="text-xs text-rose-600">{userProfile.socialLinks.email}</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-rose-400 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a 
                    href={`https://letterboxd.com/${userProfile.socialLinks.letterboxd}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
                  >
                    <Camera className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium text-purple-800">{userProfile.socialLinks.letterboxd}</div>
                      <div className="text-xs text-purple-600">Movie reviews & ratings</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-purple-400 ml-auto group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              )}
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Join the Review Squad
              </h3>
              <p className="text-pink-100 text-sm mb-4">
                Get weekly doses of anime recommendations, movie insights, and book discoveries delivered to your inbox!
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-2 rounded-full text-pink-900 placeholder-pink-400 border-none focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="w-full bg-white text-pink-500 font-semibold py-2 px-4 rounded-full hover:bg-pink-50 transition-colors">
                  Subscribe Now
                </button>
              </div>
            </div>

            {/* Quote Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
              <div className="flex items-center justify-between mb-3">
                <Quote className="w-8 h-8 text-pink-400" />
                {isAuthenticated && !isEditing && (
                  <button
                    onClick={() => setActiveSection('quote')}
                    className="text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isEditing || activeSection === 'quote' ? (
                <div className="space-y-3">
                  <textarea
                    value={editedProfile.philosophy}
                    onChange={(e) => updateEditedProfile('philosophy', e.target.value)}
                    className="w-full p-3 border border-pink-300 rounded-lg text-pink-800 font-medium italic focus:outline-none focus:border-pink-500 resize-none"
                    rows={3}
                    placeholder="Your review philosophy..."
                  />
                  <p className="text-pink-600 text-sm">- {editedProfile.name}'s Review Philosophy</p>
                  
                  {activeSection === 'quote' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const updatedProfile = { ...editedProfile };
                          setUserProfile(updatedProfile);
                          localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                          window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updatedProfile }));
                          setActiveSection('');
                          console.log('Social links saved to localStorage');
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditedProfile(userProfile);
                          setActiveSection('');
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-pink-800 font-medium italic mb-3">
                    "{userProfile.philosophy}"
                  </p>
                  <p className="text-pink-600 text-sm">- {userProfile.name}'s Review Philosophy</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
