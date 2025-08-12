import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Heart, BookOpen, Film, Tv, User, LogOut } from 'lucide-react';

interface HeaderProps {
  onCategoryFilter?: (category: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  isAuthenticated?: boolean;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onEditProfile?: () => void;
}

export default function Header({ 
  onCategoryFilter, 
  searchTerm = '', 
  onSearchChange, 
  isAuthenticated = false,
  onSignIn,
  onSignOut,
  onEditProfile
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const categories = ['All', 'Anime', 'Movies', 'Books'];

  const handleCategoryClick = (category: string) => {
    if (onCategoryFilter) {
      onCategoryFilter(category);
    }
    setIsMenuOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <header className="bg-white shadow-lg border-b-4 border-pink-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Ronel's Reviews
              </h1>
              <p className="text-sm text-pink-500">Anime • Movies • Books</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`font-medium transition-colors ${
                location.pathname === '/' || location.pathname === '/home'
                  ? 'text-pink-600 border-b-2 border-pink-600 pb-1'
                  : 'text-pink-700 hover:text-pink-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`font-medium transition-colors ${
                location.pathname === '/about'
                  ? 'text-pink-600 border-b-2 border-pink-600 pb-1'
                  : 'text-pink-700 hover:text-pink-600'
              }`}
            >
              About Ronel
            </Link>
          </nav>

          {/* Auth & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Authentication */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-pink-700">Welcome, Ronel!</span>
                <button
                  onClick={onEditProfile}
                  className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={onSignOut}
                  className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="hidden md:flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors"
              >
                <User className="w-4 h-4" />
                Admin Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-pink-600 hover:text-pink-700 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pb-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-400 text-pink-900 placeholder-pink-400"
            />
          </div>
        </div>

        {/* Category Filter */}
        {location.pathname === '/' || location.pathname === '/home' ? (
          <div className="hidden md:flex justify-center pb-4">
            <div className="flex gap-2">
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
                    onClick={() => handleCategoryClick(category)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all bg-pink-100 text-pink-700 hover:bg-pink-200 hover:text-pink-800"
                  >
                    <Icon className="w-4 h-4" />
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-pink-200">
          <div className="px-6 py-4 space-y-4">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-pink-700 hover:text-pink-600 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMenuOpen(false)}
              className="block text-pink-700 hover:text-pink-600 font-medium"
            >
              About Ronel
            </Link>

            {/* Mobile Category Filter */}
            <div className="border-t border-pink-200 pt-4">
              <p className="text-sm font-semibold text-pink-800 mb-2">Categories:</p>
              <div className="grid grid-cols-2 gap-2">
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
                      onClick={() => handleCategoryClick(category)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-pink-100 text-pink-700 hover:bg-pink-200"
                    >
                      <Icon className="w-4 h-4" />
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Auth */}
            <div className="border-t border-pink-200 pt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-sm text-pink-700">Welcome, Ronel!</p>
                  <button
                    onClick={() => {
                      if (onEditProfile) onEditProfile();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      if (onSignOut) onSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (onSignIn) onSignIn();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                  <User className="w-4 h-4" />
                  Admin Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
