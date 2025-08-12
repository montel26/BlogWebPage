import React, { useState } from 'react';
import { X, Upload, Star, Film, Tv, BookOpen } from 'lucide-react';

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
  review: string;
}

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

export default function AddReviewModal({ isOpen, onClose, onAddReview }: AddReviewModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'anime' as 'anime' | 'movie' | 'book',
    rating: 5,
    review: '',
    image: '',
    tags: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate upload delay
    setTimeout(() => {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      onAddReview({
        title: formData.title,
        type: formData.type,
        rating: formData.rating,
        review: formData.review,
        image: formData.image || getPlaceholderImage(formData.type),
        tags: tagsArray
      });

      // Reset form
      setFormData({
        title: '',
        type: 'anime',
        rating: 5,
        review: '',
        image: '',
        tags: ''
      });
      setImagePreview('');
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  const getPlaceholderImage = (type: string) => {
    const placeholders = {
      anime: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      movie: 'https://images.unsplash.com/photo-1489599510726-e3275cdb5c0b?w=400',
      book: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
    };
    return placeholders[type as keyof typeof placeholders];
  };

  const handleClose = () => {
    setFormData({
      title: '',
      type: 'anime',
      rating: 5,
      review: '',
      image: '',
      tags: ''
    });
    setImagePreview('');
    onClose();
  };

  const typeIcons = {
    anime: Tv,
    movie: Film,
    book: BookOpen
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-pink-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-pink-800">Add New Review</h2>
            <button
              onClick={handleClose}
              className="text-pink-400 hover:text-pink-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter the title..."
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 text-pink-900 placeholder-pink-400"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-2">
              Type *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['anime', 'movie', 'book'] as const).map(type => {
                const Icon = typeIcons[type];
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type }))}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                      formData.type === type
                        ? 'bg-pink-500 text-white'
                        : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-2">
              Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className={`transition-colors ${
                    star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="w-8 h-8 fill-current" />
                </button>
              ))}
              <span className="ml-2 text-pink-700 font-medium">
                {formData.rating}/5 stars
              </span>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-2">
              Cover Image
            </label>
            <div className="border-2 border-dashed border-pink-200 rounded-xl p-6 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-48 object-cover rounded-lg mx-auto mb-4"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, image: '' }));
                    }}
                    className="text-pink-500 hover:text-pink-600 font-medium"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-pink-300 mx-auto mb-4" />
                  <p className="text-pink-600 mb-2">Upload a cover image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    Choose Image
                  </label>
                  <p className="text-xs text-pink-400 mt-2">
                    Or we'll use a placeholder based on type
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Review */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-2">
              Review *
            </label>
            <textarea
              value={formData.review}
              onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
              placeholder="Write your review..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 text-pink-900 placeholder-pink-400 resize-none"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-pink-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Enter tags separated by commas (e.g., action, romance, fantasy)"
              className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 text-pink-900 placeholder-pink-400"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.review}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Review...
                </div>
              ) : (
                'Add Review'
              )}
            </button>
            
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-pink-600 hover:text-pink-700 font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
