import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MessageSquare,
  Heart,
  Share2,
  Send,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Users,
  Clock,
  Award,
  BookOpen,
  Briefcase,
  Target,
  User,
  MoreHorizontal,
  Bookmark,
  ExternalLink,
  X,
  Upload,
  Hash,
  Zap,
  Star,
  ChevronUp,
  ChevronDown,
  Eye,
  Loader
} from 'lucide-react';
import PostHeader from '../Components/PostHeader';
import { useUser } from '@clerk/clerk-react';

// API configuration
const API_BASE_URL = 'http://localhost:4000/api/home';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// API functions using axios and promises
const postAPI = {
  createPost: (postData) => {
    return new Promise((resolve, reject) => {
      apiClient.post('/create-post', postData)
        .then(response => {
          console.log('Post created successfully:', response.data);
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error creating post:', error.response?.data || error.message);
          reject(error.response?.data || { message: 'Failed to create post' });
        });
    });
  },

  fetchPosts: () => {
    return new Promise((resolve, reject) => {
      apiClient.get('/fetch-posts')
        .then(response => {
          console.log('Posts fetched successfully:', response.data);
          resolve(response.data.posts || []);
        })
        .catch(error => {
          console.error('Error fetching posts:', error.response?.data || error.message);
          reject(error.response?.data || { message: 'Failed to fetch posts' });
        });
    });
  },

  // Enhanced like functionality
  toggleLike: (postId, userId, userName) => {
    return new Promise((resolve, reject) => {
      apiClient.post(`/like-post/${postId}`, { userId, userName })
        .then(response => {
          console.log('Like toggled successfully:', response.data);
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error toggling like:', error.response?.data || error.message);
          reject(error.response?.data || { message: 'Failed to toggle like' });
        });
    });
  },

  // Enhanced comment functionality
  addComment: (postId, commentData) => {
    return new Promise((resolve, reject) => {
      apiClient.post(`/add-comment/${postId}`, commentData)
        .then(response => {
          console.log('Comment added successfully:', response.data);
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error adding comment:', error.response?.data || error.message);
          reject(error.response?.data || { message: 'Failed to add comment' });
        });
    });
  },

  // Delete comment functionality
  deleteComment: (postId, commentId, userId) => {
    return new Promise((resolve, reject) => {
      apiClient.delete(`/delete-comment/${postId}/${commentId}`, { 
        data: { userId } 
      })
        .then(response => {
          console.log('Comment deleted successfully:', response.data);
          resolve(response.data);
        })
        .catch(error => {
          console.error('Error deleting comment:', error.response?.data || error.message);
          reject(error.response?.data || { message: 'Failed to delete comment' });
        });
    });
  },

  // Get detailed post info
  getPostDetails: (postId, userId) => {
    return new Promise((resolve, reject) => {
      apiClient.get(`/post-details/${postId}?userId=${userId}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error.response?.data || { message: 'Failed to fetch post details' });
        });
    });
  },

  // Additional API methods for future use
  updatePost: (postId, updateData) => {
    return new Promise((resolve, reject) => {
      apiClient.put(`/update-post/${postId}`, updateData)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error.response?.data || { message: 'Failed to update post' });
        });
    });
  },

  deletePost: (postId) => {
    return new Promise((resolve, reject) => {
      apiClient.delete(`/delete-post/${postId}`)
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error.response?.data || { message: 'Failed to delete post' });
        });
    });
  }
};

// Utility function to format time ago
const formatTimeAgo = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2629746000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  return `${months} month${months > 1 ? 's' : ''} ago`;
};

// Transform backend post to frontend format
const transformPost = (backendPost, currentUserId = null) => ({
  id: backendPost._id,
  author: backendPost.userName,
  authorImg: backendPost.imgUrl,
  authorId: backendPost.userId,
  category: backendPost.category,
  title: backendPost.title,
  content: backendPost.content,
  timeAgo: formatTimeAgo(backendPost.time),
  views: backendPost.Views || Math.floor(Math.random() * 5000) + 100,
  likes: backendPost.Likes,
  isLiked: currentUserId ? (backendPost.LikedBy || []).includes(currentUserId) : false,
  isBookmarked: false, // This would need separate implementation
  engagement: `${(Math.random() * 10 + 1).toFixed(1)}%`, // Placeholder calculation
  tags: backendPost.tags || [],
  comments: backendPost.Comments?.map(comment => ({
    id: comment._id,
    author: comment.by,
    content: comment.comment,
    timeAgo: formatTimeAgo(parseInt(comment.time)),
    authorImg: comment.byimg
  })) || [],
  likedBy: backendPost.LikedBy || []
});

// Sparkle component for background effects
const Sparkle = ({ delay = 0, size = "w-1 h-1" }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({
      x: Math.random() * 100,
      y: Math.random() * 100,
    });
  }, []);

  return (
    <div
      className={`absolute ${size} bg-white rounded-full opacity-0 animate-sparkle pointer-events-none`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

// Post component with like, comment, share functionality
const ForumPost = ({ post, onLike, onComment, onShare, onBookmark, onDeleteComment, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likes, setLikes] = useState(post.likes);
  const [commentLoading, setCommentLoading] = useState(false);
  const [likePulse, setLikePulse] = useState(false);

  // Update local state when prop changes (for real-time updates)
  useEffect(() => {
    setIsLiked(post.isLiked);
    setLikes(post.likes);
  }, [post.isLiked, post.likes]);

  const handleLike = () => {
    if (!currentUser) return;
    
    // Visual feedback
    setLikePulse(true);
    setTimeout(() => setLikePulse(false), 300);
    
    // Update local state immediately for smooth UX
    const newLikedState = !isLiked;
    const newLikesCount = newLikedState ? likes + 1 : likes - 1;
    
    setIsLiked(newLikedState);
    setLikes(newLikesCount);
    
    // Call parent handler
    onLike(post.id, currentUser.id);
  };

  const handleComment = () => {
    if (!currentUser) return;
    
    if (newComment.trim()) {
      setCommentLoading(true);
      
      const commentData = {
        by: currentUser.fullName || 'Anonymous',
        byimg: currentUser.imageUrl || '',
        comment: newComment.trim()
      };

      onComment(post.id, commentData)
        .then(() => {
          setNewComment('');
        })
        .catch(error => {
          console.error('Error adding comment:', error);
        })
        .finally(() => {
          setCommentLoading(false);
        });
    }
  };

  const handleDeleteComment = (commentId) => {
    if (!currentUser || !onDeleteComment) return;
    
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDeleteComment(post.id, commentId, currentUser.id);
    }
  };
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Career Advice': return <Briefcase className="w-4 h-4" />;
      case 'Interview Tips': return <Target className="w-4 h-4" />;
      case 'Learning Resources': return <BookOpen className="w-4 h-4" />;
      case 'Success Stories': return <Award className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Career Advice': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Interview Tips': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Learning Resources': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Success Stories': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 flex items-center justify-center overflow-hidden">
              {post.authorImg ? (
                <img src={post.authorImg} alt={post.author} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-white">{post.author}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border flex items-center space-x-1 ${getCategoryColor(post.category)}`}>
                  {getCategoryIcon(post.category)}
                  <span>{post.category}</span>
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {post.timeAgo}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all duration-300">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {post.content}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, index) => (
                <span key={index} className="text-xs bg-gray-800/60 text-blue-300 px-3 py-1 rounded-full border border-gray-700 flex items-center">
                  <Hash className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-700/50 pt-4">
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
              } ${likePulse ? 'animate-pulse scale-110' : ''}`}
              disabled={!currentUser}
            >
              <Heart className={`w-5 h-5 transition-all duration-200 ${isLiked ? 'fill-red-400 scale-110' : ''}`} />
              <span className="font-semibold">{likes}</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center space-x-2 text-sm font-medium transition-all duration-300 ${
                showComments ? 'text-blue-400' : 'text-gray-400 hover:text-blue-400'
              }`}
            >
              <MessageSquare className={`w-5 h-5 ${showComments ? 'fill-blue-400/20' : ''}`} />
              <span>{post.comments.length}</span>
            </button>
            <button 
              onClick={() => onShare(post.id)}
              className="flex items-center space-x-2 text-sm font-medium text-gray-400 hover:text-green-400 transition-all duration-300"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 border-t border-gray-700/50 pt-6 space-y-4">
            {post.comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              post.comments.map((comment, index) => (
                <div key={comment.id || index} className="flex items-start space-x-3 group/comment">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {comment.authorImg ? (
                      <img src={comment.authorImg} alt={comment.author} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1 bg-gray-800/50 rounded-xl p-3 hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.timeAgo}</span>
                      </div>
                      {currentUser && (comment.author === (currentUser.fullName || 'Anonymous') || post.authorId === currentUser.id) && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="opacity-0 group-hover/comment:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all duration-200"
                          title="Delete comment"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
            
            {/* Add Comment */}
            {currentUser && (
              <div className="flex items-center space-x-3 mt-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {currentUser.imageUrl ? (
                    <img src={currentUser.imageUrl} alt={currentUser.fullName || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-blue-400" />
                  )}
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-gray-800/70 transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && !commentLoading && handleComment()}
                    disabled={commentLoading}
                    maxLength={500}
                  />
                  <button 
                    onClick={handleComment}
                    className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                    disabled={commentLoading || !newComment.trim()}
                    title={newComment.trim() ? 'Send comment' : 'Write a comment first'}
                  >
                    {commentLoading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {/* Character count for comment */}
            {newComment.length > 400 && (
              <div className="text-xs text-gray-500 text-right mt-1">
                {newComment.length}/500 characters
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Create Post Modal
const CreatePostModal = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    category: 'Career Advice',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    if (postData.title && postData.content) {
      setLoading(true);
      setError(null);
      
      const processedPostData = {
        ...postData,
        tags: postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      onSubmit(processedPostData)
        .then(() => {
          setPostData({ title: '', content: '', category: 'Career Advice', tags: '' });
          onClose();
        })
        .catch(error => {
          console.error('Error creating post:', error);
          setError(error.message || 'Failed to create post. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl border border-gray-700/50 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-xl transition-colors disabled:opacity-50"
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 flex items-center justify-center">
            <Plus className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Create New Post</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={postData.category}
              onChange={(e) => setPostData({...postData, category: e.target.value})}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <option value="Career Advice">Career Advice</option>
              <option value="Interview Tips">Interview Tips</option>
              <option value="Learning Resources">Learning Resources</option>
              <option value="Success Stories">Success Stories</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <input
              type="text"
              value={postData.title}
              onChange={(e) => setPostData({...postData, title: e.target.value})}
              placeholder="What's your post about?"
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
            <textarea
              value={postData.content}
              onChange={(e) => setPostData({...postData, content: e.target.value})}
              placeholder="Share your thoughts, experiences, or questions..."
              rows={6}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors resize-none disabled:opacity-50"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              value={postData.tags}
              onChange={(e) => setPostData({...postData, tags: e.target.value})}
              placeholder="frontend, react, career, tips..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50"
              disabled={loading}
            />
          </div>

          <div className="flex items-center space-x-4 pt-6 border-t border-gray-700/50">
            <button
              type="button"
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <Upload className="w-4 h-4" />
              <span>Add Image</span>
            </button>
            <button
              type="button"
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Add Link</span>
            </button>
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading || !postData.title.trim() || !postData.content.trim()}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post to Community'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Forum Component
const CommunityForum = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recent');

  const categories = ['All', 'Career Advice', 'Interview Tips', 'Learning Resources', 'Success Stories'];

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setLoading(true);
    
    postAPI.fetchPosts()
      .then(fetchedPosts => {
        const transformedPosts = fetchedPosts.map(post => transformPost(post, user?.id));
        setPosts(transformedPosts);
        setError(null);
      })
      .catch(err => {
        setError(err.message || 'Failed to load posts. Please try again.');
        console.error('Error loading posts:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLike = (postId, userId) => {
    if (!user) return;
    
    // Find the current post
    const currentPost = posts.find(post => post.id === postId);
    if (!currentPost) return;

    // Optimistic update
    const wasLiked = currentPost.isLiked;
    const newLikesCount = wasLiked ? currentPost.likes - 1 : currentPost.likes + 1;

    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: newLikesCount,
            isLiked: !wasLiked,
            likedBy: wasLiked 
              ? post.likedBy.filter(id => id !== userId)
              : [...post.likedBy, userId]
          }
        : post
    ));

    // Make API call
    postAPI.toggleLike(postId, userId, user?.fullName || 'Anonymous')
      .then(response => {
        // Update with server response to ensure consistency
        setPosts(prevPosts => prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes: response.totalLikes,
                isLiked: response.isLiked
              }
            : post
        ));
      })
      .catch(error => {
        console.error('Error toggling like:', error);
        // Revert optimistic update on error
        setPosts(prevPosts => prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes: currentPost.likes,
                isLiked: currentPost.isLiked,
                likedBy: currentPost.likedBy
              }
            : post
        ));
      });
  };

  const handleComment = (postId, commentData) => {
    if (!user) return Promise.reject('User not authenticated');
    
    return new Promise((resolve, reject) => {
      postAPI.addComment(postId, commentData)
        .then(response => {
          // Update local state with new comment
          setPosts(prevPosts => prevPosts.map(post =>
            post.id === postId
              ? { 
                  ...post, 
                  comments: [...post.comments, {
                    id: response.comment._id,
                    author: commentData.by,
                    content: commentData.comment,
                    timeAgo: 'Just now',
                    authorImg: commentData.byimg
                  }]
                }
              : post
          ));
          resolve(response);
        })
        .catch(error => {
          console.error('Error adding comment:', error);
          reject(error);
        });
    });
  };

  const handleDeleteComment = (postId, commentId, userId) => {
    if (!user) return;
    
    // Optimistic update - remove comment immediately
    const originalPosts = [...posts];
    setPosts(prevPosts => prevPosts.map(post =>
      post.id === postId
        ? { 
            ...post, 
            comments: post.comments.filter(comment => comment.id !== commentId)
          }
        : post
    ));

    // Make API call
    postAPI.deleteComment(postId, commentId, userId)
      .then(response => {
        console.log('Comment deleted successfully:', response);
      })
      .catch(error => {
        console.error('Error deleting comment:', error);
        // Revert optimistic update on error
        setPosts(originalPosts);
      });
  };

  const handleShare = (postId) => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'NexusPro Community Post',
        url: shareUrl
      }).catch(error => {
        console.error('Error sharing:', error);
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
      });
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          // You could show a toast notification here
          console.log('Link copied to clipboard');
        })
        .catch(error => {
          console.error('Error copying to clipboard:', error);
        });
    }
  };

  const handleBookmark = (postId) => {
    setPosts(prevPosts => prevPosts.map(post =>
      post.id === postId
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
    
    // Here you could make an API call to save bookmark to backend
    // postAPI.bookmarkPost(postId, user.id)
  };

  const handleCreatePost = (newPostData) => {
    if (!user) return Promise.reject('User not authenticated');
    
    return new Promise((resolve, reject) => {
      const postPayload = {
        userId: user.id,
        userName: user.fullName || 'Anonymous',
        imgUrl: user.imageUrl || '',
        category: newPostData.category,
        title: newPostData.title,
        content: newPostData.content,
        tags: newPostData.tags,
        Comments: [],
        Likes: 0,
        time: Date.now()
      };

      postAPI.createPost(postPayload)
        .then(response => {
          // Add the new post to the local state
          const newPost = {
            id: response.post._id || Date.now().toString(),
            author: user.fullName || 'Anonymous',
            authorImg: user.imageUrl,
            authorId: user.id,
            category: newPostData.category,
            title: newPostData.title,
            content: newPostData.content,
            tags: newPostData.tags,
            timeAgo: 'Just now',
            likes: 0,
            isLiked: false,
            comments: []
          };
          setPosts(prevPosts => [newPost, ...prevPosts]);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort posts with improved logic
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'Popular':
        return b.views - a.views;
      case 'Most Liked':
        return b.likes - a.likes;
      case 'Recent':
      default:
        // Sort by timestamp for proper recent ordering
        const aTime = a.timeAgo === 'Just now' ? Date.now() : 0;
        const bTime = b.timeAgo === 'Just now' ? Date.now() : 0;
        return bTime - aTime;
    }
  });

  if (loading) {
    return (
      <div className="bg-[#0a0a0c] text-white font-sans min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-12 h-12 animate-spin text-blue-400" />
          <span className="text-xl">Loading community posts...</span>
          <p className="text-gray-400 text-center max-w-md">
            Connecting to the community forum and fetching the latest discussions
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#0a0a0c] text-white font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to access the community</h2>
          <p className="text-gray-400">You need to be authenticated to view and participate in discussions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0c] text-white font-sans min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div
        className="absolute inset-0 bg-cover bg-fixed opacity-10"
        style={{
          backgroundImage: 'url("/images/space.png")',
          backgroundPosition: "center top",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-blue-900/10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none z-0" />

      {/* Sparkles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <Sparkle
          key={i}
          delay={i * 0.3}
          size={Math.random() > 0.9 ? "w-2 h-2" : "w-1 h-1"}
        />
      ))}

      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-6">
        <PostHeader/>
        <main className="text-center py-20 lg:py-32 relative mb-20">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute w-[400px] h-[400px] border-2 border-blue-500/20 rounded-full animate-spin-slow"></div>
            <div className="absolute w-[500px] h-[500px] border border-blue-500/10 rounded-full animate-spin-slower"></div>
            <div className="absolute w-[250px] h-[250px] bg-blue-900/40 rounded-full shadow-2xl shadow-blue-500/50 animate-glow"></div>
            <div className="absolute w-[150px] h-[150px] bg-blue-500/60 rounded-full blur-xl animate-float-fade"></div>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-up">
            NexusPro Community
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with like-minded professionals, share experiences, and grow together in your career journey
          </p>
        </main>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Connection Error</h3>
                <p>{error}</p>
              </div>
              <button 
                onClick={loadPosts}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Controls Bar */}
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 flex-1 w-full">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors w-full sm:w-auto"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors w-full sm:w-auto"
              >
                <option value="Recent">Recent</option>
                <option value="Popular">Popular</option>
                <option value="Most Liked">Most Liked</option>
              </select>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30 flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <Plus className="w-5 h-5" />
              <span>Create Post</span>
            </button>
          </div>
        </div>
        {/* Posts Feed */}
        <div className="space-y-8">
          {sortedPosts.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">
                {loading ? 'Loading posts...' : 'No posts found'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filters, or create a new post to get the conversation started!' 
                  : 'Be the first to start a discussion in our community!'}
              </p>
              {!loading && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Create First Post
                </button>
              )}
            </div>
          ) : (
            sortedPosts.map(post => (
              <ForumPost
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onBookmark={handleBookmark}
                onDeleteComment={handleDeleteComment}
                currentUser={user}
              />
            ))
          )}
        </div>

        {/* Load More Button */}
        {posts.length > 0 && !error && (
          <div className="text-center mt-12">
            <button
              onClick={loadPosts}
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors border border-gray-600 hover:border-gray-500 flex items-center space-x-2 mx-auto"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" />
                  <span>Refresh Posts</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
          currentUser={user}
        />
      </div>
    </div>
  );
};

export default CommunityForum;