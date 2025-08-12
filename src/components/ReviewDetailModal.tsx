import React from 'react';
import { X, Calendar, Clock, Heart, Star, Tag } from 'lucide-react';

interface Review {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  likes: number;
  readTime: string;
  rating: number;
  type: 'anime' | 'movie' | 'book';
  tags: string[];
  review?: string;
}

interface ReviewDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
}

const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({ isOpen, onClose, review }) => {
  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Header Image */}
          <div className="relative h-64 md:h-80">
            <img
              src={review.image}
              alt={review.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-opacity-30 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {review.category.toUpperCase()}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
                      }`} 
                    />
                  ))}
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{review.title}</h1>
              <div className="flex items-center gap-4 text-white text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{review.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{review.readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{review.likes} likes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Tags */}
            <div className="flex items-center gap-3 mb-6">
              <Tag className="w-5 h-5 text-pink-500" />
              <div className="flex flex-wrap gap-2">
                {review.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Review Content */}
            <div className="prose prose-pink max-w-none">
              {review.review ? (
                <div className="text-pink-900 leading-relaxed whitespace-pre-wrap">
                  {review.review}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-pink-400" />
                  </div>
                  <p className="text-pink-600 text-lg">This review is still being written...</p>
                  <p className="text-pink-500 text-sm mt-2">Check back soon for the full review!</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-pink-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50"
                    alt="Ronel"
                    className="w-12 h-12 rounded-full border-2 border-pink-200"
                  />
                  <div>
                    <p className="font-semibold text-pink-800">Ronel</p>
                    <p className="text-pink-600 text-sm">Review Enthusiast</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailModal;
