import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, Sparkles, Calendar, BookOpen, ArrowRight, User, Instagram, Mail, Filter, Star, Film, Tv, Plus, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';
import AddReviewModal from '@/components/AddReviewModal';
import ProfileEditModal from '@/components/ProfileEditModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import ReviewDetailModal from '@/components/ReviewDetailModal';

interface Review {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  likes: number;
  readTime: string;
  featured?: boolean;
  rating: number;
  type: 'anime' | 'movie' | 'book';
  tags: string[];
  review?: string;
}

const mockReviews: Review[] = [
  {
    id: '1',
    slug: 'attack-on-titan-final-season',
    title: 'Attack on Titan: The Final Season',
    excerpt: 'An epic conclusion to one of the greatest anime series ever made. The animation, storytelling, and emotional depth reached new heights.',
    category: 'Anime',
    date: 'March 15, 2024',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    likes: 347,
    readTime: '8 min read',
    featured: true,
    rating: 5,
    type: 'anime',
    tags: ['action', 'drama', 'military'],
    review: 'Attack on Titan\'s final season delivers an epic conclusion that lives up to the hype. The animation quality has reached new heights, with stunning action sequences that showcase the brutal reality of war. The character development, particularly Eren\'s transformation, is masterfully executed. The political intrigue and moral complexity of the story make this more than just an action anime - it\'s a profound meditation on freedom, revenge, and the cycle of hatred. Every episode leaves you questioning the nature of heroism and villainy. The emotional weight of the series culminates in moments that will stay with you long after watching.'
  },
  {
    id: '2',
    slug: 'oppenheimer-review',
    title: 'Oppenheimer: A Masterpiece of Cinema',
    excerpt: 'Christopher Nolan delivers another stunning film about the father of the atomic bomb. Brilliant performances and breathtaking cinematography.',
    category: 'Movies',
    date: 'March 12, 2024',
    image: 'https://images.unsplash.com/photo-1489599510726-e3275cdb5c0b?w=400',
    likes: 289,
    readTime: '7 min read',
    rating: 5,
    type: 'movie',
    tags: ['drama', 'biography', 'history'],
    review: 'Christopher Nolan has crafted another masterpiece with Oppenheimer. Cillian Murphy delivers a career-defining performance as the father of the atomic bomb, capturing both the brilliance and the burden of his creation. The film\'s non-linear structure serves the story perfectly, building tension toward the Trinity test. The cinematography is breathtaking, particularly the practical effects used for the bomb sequences. This isn\'t just a biography - it\'s a meditation on the responsibility of scientific discovery and the weight of changing the world forever.'
  },
  {
    id: '3',
    slug: 'fourth-wing-book-review',
    title: 'Fourth Wing: Dragon Riders and Romance',
    excerpt: 'Rebecca Yarros created an addictive fantasy world with dragons, war college, and swoon-worthy romance that kept me reading all night.',
    category: 'Books',
    date: 'March 10, 2024',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    likes: 256,
    readTime: '6 min read',
    rating: 4,
    type: 'book',
    tags: ['fantasy', 'romance', 'dragons'],
    review: 'Fourth Wing is an addictive fantasy that perfectly blends romance, dragons, and military academia. Rebecca Yarros creates a compelling world where dragon riders train in a deadly war college. The chemistry between Violet and Xaden is electric, building slowly with plenty of tension. The dragon bonding scenes are beautifully written and emotionally resonant. While some plot points are predictable, the pacing keeps you turning pages. The found family dynamics among the cadets add depth beyond the romance. Perfect for fans of dark academia meets fantasy romance.'
  },
  {
    id: '4',
    slug: 'demon-slayer-movie',
    title: 'Demon Slayer: Mugen Train',
    excerpt: 'Visually stunning and emotionally devastating. This movie perfectly captures what makes Demon Slayer special with incredible fight scenes.',
    category: 'Anime',
    date: 'March 8, 2024',
    image: 'https://images.unsplash.com/photo-1606041318043-73d37b0b4e5e?w=400',
    likes: 203,
    readTime: '5 min read',
    rating: 5,
    type: 'anime',
    tags: ['action', 'supernatural', 'movie'],
    review: 'Demon Slayer: Mugen Train is a visual masterpiece that elevates anime film to new heights. The animation during fight sequences is absolutely breathtaking, with fluid movements and stunning special effects. Rengoku\'s character development and sacrifice hit incredibly hard emotionally. The film perfectly captures the essence of what makes Demon Slayer special - the balance between intense action and heartfelt character moments. The train setting creates a unique claustrophobic atmosphere that heightens the tension. This movie proves that anime films can compete with any blockbuster.'
  },
  {
    id: '5',
    slug: 'barbie-movie-review',
    title: 'Barbie: Pink Perfection and Social Commentary',
    excerpt: 'Greta Gerwig created something truly special - a film that\'s both hilariously entertaining and surprisingly deep about society and identity.',
    category: 'Movies',
    date: 'March 5, 2024',
    image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400',
    likes: 412,
    readTime: '6 min read',
    rating: 4,
    type: 'movie',
    tags: ['comedy', 'drama', 'pink'],
    review: 'Greta Gerwig\'s Barbie is a brilliant subversion that works on multiple levels. What could have been a simple cash grab becomes a smart commentary on femininity, society, and identity. Margot Robbie and Ryan Gosling have perfect chemistry, bringing depth to iconic characters. The production design is incredibly detailed, creating a world that\'s both fantastical and grounded. The film balances humor with genuine emotional moments, never talking down to its audience. While the third act gets a bit heavy-handed with its messaging, the overall experience is joyful and thought-provoking.'
  },
  {
    id: '6',
    slug: 'tomorrow-x-together-book',
    title: 'The Seven Moons of Maali Almeida',
    excerpt: 'A darkly comic fantasy about a photographer who must solve his own murder from the afterlife. Shehan Karunatilaka\'s prose is absolutely brilliant.',
    category: 'Books',
    date: 'March 3, 2024',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    likes: 178,
    readTime: '7 min read',
    rating: 4,
    type: 'book',
    tags: ['fantasy', 'mystery', 'dark comedy'],
    review: 'Shehan Karunatilaka\'s novel is a darkly comic masterpiece that blends fantasy with political satire. The concept of a photographer solving his own murder from the afterlife is brilliantly executed. The prose is sharp and witty, with cultural references that add authenticity to the Sri Lankan setting. The mystery unfolds at a perfect pace, keeping readers guessing while exploring themes of war, corruption, and redemption. The afterlife world-building is creative and engaging. This book proves that genre fiction can tackle serious subjects with both humor and respect.'
  }
];

const categories = ['All', 'Anime', 'Movies', 'Books'];

export default function HomePage() {
  const { isAuthenticated, login, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReviewDetail, setShowReviewDetail] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [authError, setAuthError] = useState('');
  const [reviews, setReviews] = useLocalStorage<Review[]>('reviews', mockReviews);
  const [userProfile, setUserProfile] = useLocalStorage('userProfile', {
    name: 'Ronel',
    bio: "Welcome to my review universe! I'm passionate about anime, movies, and books. Join me as I explore amazing stories and share honest opinions.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  });

  // Handle URL category parameter
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.includes(category)) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

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
  };

  // Listen for profile updates and force re-render
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      const newProfile = event.detail;
      setUserProfile(newProfile);
      // Force component re-render by updating state
      setSelectedCategory(prev => prev); // Trigger re-render
    };
    
    const handleReviewUpdate = () => {
      // Force re-render when reviews are updated
      setSelectedCategory(prev => prev);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate as (event: Event) => void);
    window.addEventListener('reviewsUpdated', handleReviewUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as (event: Event) => void);
      window.removeEventListener('reviewsUpdated', handleReviewUpdate);
    };
  }, [setUserProfile]);

  const handleAddReview = (newReview: Omit<Review, 'id' | 'date'>) => {
    const review: Review = {
      ...newReview,
      id: Date.now().toString(),
      slug: newReview.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      likes: 0,
      readTime: '5 min read',
      category: newReview.type.charAt(0).toUpperCase() + newReview.type.slice(1),
      excerpt: newReview.review.substring(0, 150) + '...'
    };
    
    setReviews(prev => {
      const updated = [review, ...prev];
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('reviewsUpdated', { detail: updated }));
      return updated;
    });
    setShowAddReviewModal(false);
  };

  const handleDeleteReview = (review: Review) => {
    setReviewToDelete(review);
    setShowDeleteModal(true);
  };

  const confirmDeleteReview = () => {
    if (reviewToDelete) {
      setReviews(prev => {
        const updated = prev.filter(r => r.id !== reviewToDelete.id);
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('reviewsUpdated', { detail: updated }));
        return updated;
      });
      setShowDeleteModal(false);
      setReviewToDelete(null);
      // Close review detail modal if the deleted review was being viewed
      if (selectedReview?.id === reviewToDelete.id) {
        setShowReviewDetail(false);
        setSelectedReview(null);
      }
    }
  };

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    setShowReviewDetail(true);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesCategory = selectedCategory === 'All' || review.category === selectedCategory;
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredReview = reviews.find(review => review.featured);
  const regularReviews = filteredReviews.filter(review => !review.featured);

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <Header 
        onCategoryFilter={handleCategoryFilter}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
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

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={showAddReviewModal}
        onClose={() => setShowAddReviewModal(false)}
        onAddReview={handleAddReview}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setReviewToDelete(null);
        }}
        onConfirm={confirmDeleteReview}
        reviewTitle={reviewToDelete?.title || ''}
      />

      {/* Review Detail Modal */}
      <ReviewDetailModal
        isOpen={showReviewDetail}
        onClose={() => {
          setShowReviewDetail(false);
          setSelectedReview(null);
        }}
        review={selectedReview}
      />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
            <section className="mb-12">
              <div className="bg-gradient-to-br from-pink-300 to-rose-400 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white bg-opacity-20"></div>
                <div className="relative z-10 max-w-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={userProfile.avatar}
                      alt={`${userProfile.name}'s Profile`}
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    <div key={`hero-${userProfile.name}-${userProfile.avatar}`}>
                      <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome to {userProfile.name}'s Reviews!</h1>
                      <p className="text-xl opacity-90">Anime • Movies • Books ✨</p>
                    </div>
                  </div>
                  <p className="text-lg mb-6 opacity-95">
                    Join me as I dive into the worlds of anime, cinema, and literature. Honest reviews, passionate discussions, and all the feels!
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="bg-white text-pink-600 font-semibold py-3 px-6 rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-lg">
                      <Heart className="w-4 h-4" />
                      Subscribe for Reviews
                    </button>
                    <button className="bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded-full flex items-center gap-2 transition-all hover:bg-white hover:text-pink-600">
                      <Instagram className="w-4 h-4" />
                      Follow My Journey
                    </button>
                  </div>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex gap-2">
                    <Film className="w-8 h-8 text-white opacity-30" />
                    <Tv className="w-8 h-8 text-white opacity-30" />
                    <BookOpen className="w-8 h-8 text-white opacity-30" />
                  </div>
                </div>
              </div>
            </section>

            {/* Category Filter & Add Review */}
            <section className="mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-pink-600" />
                    <span className="font-semibold text-pink-800">Categories:</span>
                  </div>
                  {categories.map(category => {
                    const icons = {
                      All: Heart,
                      Anime: Tv,
                      Movies: Film,
                      Books: BookOpen
                    };
                    const Icon = icons[category as keyof typeof icons];
                    
                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryFilter(category)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                          selectedCategory === category
                            ? 'bg-pink-500 text-white shadow-lg'
                            : 'bg-white text-pink-600 border border-pink-200 hover:border-pink-400 hover:text-pink-700'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {category}
                      </button>
                    );
                  })}
                </div>
                
                {/* Add Review Button */}
                {isAuthenticated && (
                  <button
                    onClick={() => setShowAddReviewModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Add Review
                  </button>
                )}
              </div>
            </section>

            {/* Featured Review */}
            {featuredReview && selectedCategory === 'All' && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-pink-500" />
                  Featured Review
                </h2>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-pink-200">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img
                        src={featuredReview.image}
                        alt={featuredReview.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-1/2 p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            FEATURED
                          </span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < featuredReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-pink-400 fill-current" />
                          <span className="text-pink-600 text-sm">{featuredReview.likes}</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-pink-800 mb-3">{featuredReview.title}</h3>
                      <p className="text-pink-500 text-sm mb-3">{featuredReview.category} • {featuredReview.readTime}</p>
                      <p className="text-pink-900 mb-4">{featuredReview.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {featuredReview.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-pink-400" />
                          <span className="text-pink-600 text-sm">{featuredReview.date}</span>
                        </div>
                        <Link
                          to={`/post/${featuredReview.slug}`}
                          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-full flex items-center gap-2 transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                          Read Review
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Reviews Grid */}
            <section>
              <h2 className="text-2xl font-bold text-pink-800 mb-6">
                {selectedCategory === 'All' ? 'Latest Reviews' : `${selectedCategory} Reviews`}
                {filteredReviews.length > 0 && (
                  <span className="text-sm font-normal text-pink-600 ml-2">({filteredReviews.length} reviews)</span>
                )}
              </h2>
              
              {regularReviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-pink-800 mb-2">No reviews found</h3>
                  <p className="text-pink-600 mb-4">
                    {searchTerm ? 
                      `No reviews match "${searchTerm}"` : 
                      `No ${selectedCategory.toLowerCase()} reviews yet`
                    }
                  </p>
                  {isAuthenticated && (
                    <button
                      onClick={() => setShowAddReviewModal(true)}
                      className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-full transition-colors"
                    >
                      Add First Review
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8" key={`reviews-grid-${regularReviews.length}`}>
                  {regularReviews.map(review => (
                    <div key={`review-card-${review.id}`} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-pink-200 hover:shadow-xl transition-all duration-300 relative group">
                      {/* Delete button for authenticated users */}
                      {isAuthenticated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReview(review);
                          }}
                          className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="relative cursor-pointer" onClick={() => handleReviewClick(review)}>
                        <img
                          src={review.image}
                          alt={review.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-rose-300 text-rose-900 px-3 py-1 rounded-full text-xs font-medium">
                            {review.category}
                          </span>
                        </div>
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center gap-1 bg-black bg-opacity-50 px-2 py-1 rounded-full">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-pink-800 hover:text-pink-600 transition-colors cursor-pointer"
                              onClick={() => handleReviewClick(review)}>
                            {review.title}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-pink-400 fill-current" />
                            <span className="text-pink-600 text-sm">{review.likes}</span>
                          </div>
                        </div>
                        <p className="text-pink-500 text-sm mb-3">{review.readTime}</p>
                        <p className="text-pink-900 text-sm mb-4">{review.excerpt}</p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {review.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-pink-400" />
                            <span className="text-pink-600 text-sm">{review.date}</span>
                          </div>
                          <button
                            onClick={() => handleReviewClick(review)}
                            className="text-pink-400 hover:text-pink-500 font-medium flex items-center gap-1 transition-colors"
                          >
                            Read Review
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* About Ronel Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200" key={`sidebar-${userProfile.name}-${userProfile.avatar}`}>
                <div className="text-center mb-4">
                  <img
                    key={`avatar-${userProfile.avatar}-${Date.now()}`}
                    src={userProfile.avatar}
                    alt={`About ${userProfile.name}`}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-pink-200 object-cover"
                    onLoad={() => {
                      // Force re-render when image loads
                      setSelectedCategory(prev => prev);
                    }}
                  />
                  <h3 className="text-xl font-bold text-pink-800">Hi, I'm {userProfile.name}! 🎬</h3>
                  <p className="text-pink-600 text-sm mb-4">
                    {userProfile.bio}
                  </p>
                  <Link
                    to="/about"
                    className="text-pink-400 hover:text-pink-500 font-medium flex items-center justify-center gap-1 transition-colors"
                  >
                    Learn More About {userProfile.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Popular Reviews */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Popular Reviews
                </h3>
                <div className="space-y-4">
                  {reviews.slice(0, 3).map(review => (
                    <div key={review.id} className="flex gap-3 cursor-pointer hover:bg-pink-50 p-2 rounded-lg transition-colors" onClick={() => handleReviewClick(review)}>
                      <img
                        src={review.image}
                        alt={review.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-pink-800 hover:text-pink-600 transition-colors line-clamp-2">
                          {review.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs text-pink-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>



              {/* Social Links */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
                <h3 className="text-xl font-bold text-pink-800 mb-4">Follow My Reviews!</h3>
                <div className="flex gap-3">
                  <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-3 rounded-full text-sm font-medium transition-colors">
                    Instagram
                  </button>
                  <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded-full text-sm font-medium transition-colors">
                    YouTube
                  </button>
                  {/* <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-full text-sm font-medium transition-colors">
                    Letterboxd
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
