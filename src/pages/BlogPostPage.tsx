import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Heart, Share2, ArrowLeft, BookOpen, User, Tag, MessageCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import AuthModal from '@/components/AuthModal';

const BlogPostPage = () => {
  const { slug } = useParams();
  const { isAuthenticated, login, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');

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

  // Mock blog post data - in a real app, this would come from an API
  const blogPost = {
    id: 1,
    title: "10 Must-Have Pink Lipsticks for Every Girly Girl",
    slug: "pink-lipsticks-girly-girl",
    excerpt: "Discover my favorite pink lip shades that will make you feel absolutely gorgeous! From soft baby pinks to bold fuchsias, I've got you covered.",
    content: `
      <p>Hey gorgeous girls! 💕 Today I'm sharing my ultimate guide to the most stunning pink lipsticks that every girly girl needs in her makeup collection. Pink lips are such a classic and feminine look that never goes out of style!</p>
      
      <h3>Why Pink Lipsticks Are Essential</h3>
      <p>Pink lipsticks are incredibly versatile and flattering on all skin tones. Whether you're going for a soft, natural look or want to make a bold statement, there's a perfect pink shade for every occasion and mood.</p>
      
      <h3>My Top 10 Pink Lipstick Picks</h3>
      <p>After testing countless pink shades, these are the ones that have earned a permanent spot in my makeup bag:</p>
      
      <ol>
        <li><strong>Soft Baby Pink</strong> - Perfect for everyday wear and that effortless girly vibe</li>
        <li><strong>Rose Gold Pink</strong> - Adds warmth and sophistication to any look</li>
        <li><strong>Hot Fuchsia</strong> - For when you want to make a bold, confident statement</li>
        <li><strong>Dusty Rose</strong> - A muted pink that's perfect for professional settings</li>
        <li><strong>Coral Pink</strong> - Bright and cheerful, ideal for summer days</li>
      </ol>
      
      <p>Each of these shades brings something special to your makeup routine. I love experimenting with different pink tones depending on my outfit, mood, and the occasion!</p>
      
      <h3>Tips for Wearing Pink Lipstick</h3>
      <p>Here are my best tips for rocking pink lips like a true girly girl:</p>
      <ul>
        <li>Always prep your lips with a good lip balm first</li>
        <li>Use a lip liner to define your lips and make the color last longer</li>
        <li>Apply with a lip brush for the most precise application</li>
        <li>Blot with tissue and reapply for longer-lasting color</li>
      </ul>
      
      <p>Remember, confidence is the best accessory you can wear with any pink lipstick! Embrace your feminine side and let your personality shine through. ✨</p>
    `,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    author: {
      name: "Sophia Rose",
      bio: "Beauty enthusiast & girly lifestyle blogger",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1-5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    publishDate: "March 15, 2024",
    readTime: "5 min read",
    category: "Beauty",
    tags: ["makeup", "lipstick", "beauty tips", "pink", "girly"],
    likes: 247,
    comments: 23
  };

  const relatedPosts = [
    {
      id: 2,
      title: "Spring Skincare Routine for Glowing Skin",
      slug: "spring-skincare-routine",
      image: "https://images.unsplash.com/photo-1570194065650-d99c79cea412?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      category: "Skincare"
    },
    {
      id: 3,
      title: "Feminine Fashion Trends This Season",
      slug: "feminine-fashion-trends",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      category: "Fashion"
    },
    {
      id: 4,
      title: "Self-Care Sunday Rituals",
      slug: "self-care-sunday-rituals",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      category: "Lifestyle"
    }
  ];

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <Header 
        isAuthenticated={isAuthenticated}
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
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

      <div className="max-w-5xl mx-auto px-6 pb-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/" className="text-pink-400 hover:text-pink-500 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <span className="text-pink-300">/</span>
          <span className="text-pink-600">{blogPost.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative mb-8">
              <img 
                src={blogPost.image} 
                alt={blogPost.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {blogPost.category.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Post Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-pink-800 mb-4">{blogPost.title}</h1>
              
              <div className="flex items-center gap-6 text-pink-600 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{blogPost.publishDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{blogPost.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{blogPost.likes} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{blogPost.comments} comments</span>
                </div>
              </div>

              {/* Social Share */}
              <div className="flex items-center gap-4">
                <span className="text-pink-700 font-medium">Share:</span>
                <button className="text-pink-500 hover:text-pink-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                  Save Post
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-200 mb-8">
              <div 
                className="prose prose-pink max-w-none text-pink-900 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />
            </div>

            {/* Tags */}
            <div className="flex items-center gap-3 mb-8">
              <Tag className="w-5 h-5 text-pink-500" />
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200 mb-8">
              <div className="flex items-center gap-4">
                <img 
                  src={blogPost.author.avatar} 
                  alt={blogPost.author.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold text-pink-800">{blogPost.author.name}</h3>
                  <p className="text-pink-600 mb-2">{blogPost.author.bio}</p>
                  <Link to="/about" className="text-pink-400 hover:text-pink-500 font-medium flex items-center gap-1 transition-colors">
                    Learn more about me
                    <User className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
              <h3 className="text-2xl font-bold text-pink-800 mb-6">Comments ({blogPost.comments})</h3>
              <div className="space-y-4">
                {/* Sample comments */}
                <div className="border-b border-pink-100 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src="https://randomuser.me/api/portraits/women/1.jpg" 
                      alt="Commenter"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-pink-800">Emma Rose</span>
                    <span className="text-pink-500 text-sm">2 days ago</span>
                  </div>
                  <p className="text-pink-900">Love this post! Those pink shades are absolutely gorgeous. Can't wait to try them! 💕</p>
                </div>
                
                <div className="border-b border-pink-100 pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src="https://randomuser.me/api/portraits/women/2.jpg" 
                      alt="Commenter"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium text-pink-800">Isabella Grace</span>
                    <span className="text-pink-500 text-sm">1 day ago</span>
                  </div>
                  <p className="text-pink-900">Such helpful tips! I've been looking for the perfect pink lipstick and this guide is exactly what I needed ✨</p>
                </div>
              </div>
              
              <div className="mt-6">
                <textarea 
                  placeholder="Leave a comment..."
                  className="w-full p-4 border border-pink-200 rounded-xl focus:outline-none focus:border-pink-400 text-pink-900 resize-none"
                  rows={3}
                />
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full mt-3 transition-colors">
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Posts */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
              <h3 className="text-xl font-bold text-pink-800 mb-4">Related Posts</h3>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <Link 
                    key={post.id}
                    to={`/post/${post.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-3">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-pink-800 group-hover:text-pink-600 transition-colors text-sm mb-1">
                          {post.title}
                        </h4>
                        <span className="text-pink-500 text-xs">{post.category}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-pink-300 to-rose-400 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Stay Updated! 💕</h3>
              <p className="text-sm mb-4 opacity-90">
                Get the latest girly tips and beauty secrets delivered to your inbox!
              </p>
              <input 
                type="email" 
                placeholder="Your email address"
                className="w-full p-3 rounded-full text-pink-900 mb-3 focus:outline-none"
              />
              <button className="w-full bg-white text-pink-600 font-semibold py-3 rounded-full hover:bg-pink-50 transition-colors">
                Subscribe Now
              </button>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
              <h3 className="text-xl font-bold text-pink-800 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['beauty', 'makeup', 'skincare', 'fashion', 'lifestyle', 'pink', 'girly', 'self-care'].map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
