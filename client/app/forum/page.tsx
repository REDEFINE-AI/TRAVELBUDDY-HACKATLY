'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Types for our forum data
interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: 'hidden-gems' | 'cultural-activities' | 'main-attractions' | 'unique-experiences';
  author: {
    name: string;
    avatar: string;
  };
  location: {
    city: string;
    country: string;
  };
  likes: number;
  dislikes: number;
  createdAt: string;
  image?: string;
  isLiked?: boolean;
  isDisliked?: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface LocationSuggestion {
  formatted: string;
  city?: string;
  country?: string;
}

export default function ForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [dislikedPosts, setDislikedPosts] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'hidden-gems', name: 'Hidden Gems' },
    { id: 'cultural-activities', name: 'Cultural Activities' },
    { id: 'main-attractions', name: 'Main Attractions' },
    { id: 'unique-experiences', name: 'Unique Experiences' },
  ];

  // Modified useEffect with Kerala tourist spots
  useEffect(() => {
    // Try to get existing posts from localStorage
    const savedPosts = localStorage.getItem('forumPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
      return;
    }

    // If no saved posts, use dummy data
    const dummyPosts: ForumPost[] = [
      {
        id: '1',
        title: 'Magical Munnar Tea Gardens',
        content: `Just spent an incredible week in Munnar. The endless tea plantations stretching across rolling hills are a sight to behold. Don't miss the Kolukkumalai Tea Estate - it's the highest tea plantation in the world! Best time to visit is early morning when the mist creates a dreamy atmosphere.`,
        category: 'main-attractions',
        author: {
          name: 'Priya Kumar',
          avatar: 'https://i.pravatar.cc/150?img=5',
        },
        location: {
          city: 'Munnar',
          country: 'India',
        },
        likes: 234,
        dislikes: 0,
        createdAt: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80',
      },
      {
        id: '2',
        title: `Hidden Waterfall Trek in Vagamon`,
        content:
          "Discovered a secluded waterfall near Vagamon after a 2-hour trek through pine forests. The trail starts near the Pine Valley - I'll share the exact coordinates. The pristine surroundings and the sound of falling water make it a perfect meditation spot.",
        category: 'hidden-gems',
        author: {
          name: 'Alex Thomas',
          avatar: 'https://i.pravatar.cc/150?img=3',
        },
        location: {
          city: 'Vagamon',
          country: 'India',
        },
        likes: 156,
        dislikes: 0,
        createdAt: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1580100586938-02822d99c4a8?q=80',
      },
      {
        id: '3',
        title: 'Backwater Magic in Alleppey',
        content:
          'Spent two days on a traditional houseboat in Alleppey backwaters. The experience of watching village life, eating fresh karimeen, and sleeping under the stars was unforgettable. Pro tip: Book a smaller boat for a more authentic experience.',
        category: 'unique-experiences',
        author: {
          name: 'Sarah Wilson',
          avatar: 'https://i.pravatar.cc/150?img=4',
        },
        location: {
          city: 'Alappuzha',
          country: 'India',
        },
        likes: 189,
        dislikes: 0,
        createdAt: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80',
      },
      {
        id: '4',
        title: 'Traditional Kathakali Performance in Fort Kochi',
        content:
          'Witnessed a mesmerizing Kathakali performance at the Kerala Kathakali Centre. Arrived early to watch the performers apply their intricate makeup. The ancient storytelling through dance and expressions is simply spectacular.',
        category: 'cultural-activities',
        author: {
          name: 'James Chen',
          avatar: 'https://i.pravatar.cc/150?img=2',
        },
        location: {
          city: 'Kochi',
          country: 'India',
        },
        likes: 145,
        dislikes: 0,
        createdAt: new Date().toISOString(),
        image: 'https://images.unsplash.com/photo-1582646774882-c31c06ae4f9e?q=80',
      },
    ];
    setPosts(dummyPosts);
    // Save to localStorage
    localStorage.setItem('forumPosts', JSON.stringify(dummyPosts));
  }, []);

  // Modified handleCreatePost with localStorage update
  const handleCreatePost = (newPost: Omit<ForumPost, 'id' | 'likes' | 'createdAt'>) => {
    const post: ForumPost = {
      ...newPost,
      id: Date.now().toString(),
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
      isDisliked: false,
      author: {
        name: 'Anonymous User',
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      },
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    // Update localStorage
    localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
    setIsCreatePostModalOpen(false);
    toast.success('Post created successfully!');
  };

  // Modified like/dislike handlers with localStorage update
  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => {
        if (post.id === postId) {
          if (post.isLiked) {
            return {
              ...post,
              likes: post.likes - 1,
              isLiked: false,
            };
          } else {
            return {
              ...post,
              likes: post.likes + 1,
              dislikes: post.isDisliked ? post.dislikes - 1 : post.dislikes,
              isLiked: true,
              isDisliked: false,
            };
          }
        }
        return post;
      });
      // Update localStorage
      localStorage.setItem('forumPosts', JSON.stringify(updatedPosts));
      return updatedPosts;
    });
  };

  // Updated dislike handler
  const handleDislikePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          if (post.isDisliked) {
            // If already disliked, remove dislike
            return {
              ...post,
              dislikes: post.dislikes - 1,
              isDisliked: false,
            };
          } else {
            // If not disliked, add dislike and remove like if present
            return {
              ...post,
              dislikes: post.dislikes + 1,
              likes: post.isLiked ? post.likes - 1 : post.likes,
              isDisliked: true,
              isLiked: false,
            };
          }
        }
        return post;
      }),
    );
  };

  // Add location search function
  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          q: query,
          key: 'eff4152b754f41cdae480219c2bf84df',
          limit: 5,
          no_annotations: 1,
        },
      });
      const suggestions = response.data.results.map((result: any) => ({
        formatted: result.formatted,
        city: result.components.city || result.components.town,
        country: result.components.country,
      }));
      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocationSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[85rem] px-4 py-8 sm:px-6 lg:px-8 mx-auto">
        {/* Enhanced Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Discover & Share Travel Stories
          </h2>
          <p className="mt-4 text-gray-800 text-base md:text-lg">
            Join our community of passionate travelers sharing authentic experiences from around the
            world
          </p>
          <button
            onClick={() => setIsCreatePostModalOpen(true)}
            className="mt-6 inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-full text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Share Your Experience
          </button>
        </div>

        {/* Enhanced Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center">
          <div className="relative flex-1 max-w-xs">
            <select
              className="w-full appearance-none bg-white py-3 pl-4 pr-10 border border-gray-200 rounded-full focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 text-gray-900 text-sm shadow-sm"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search by location..."
              className="w-full bg-white py-3 pl-4 pr-10 border border-gray-200 rounded-full focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 text-gray-900 text-sm shadow-sm"
              onChange={e => {
                setSelectedLocation(e.target.value);
                fetchLocationSuggestions(e.target.value);
              }}
            />
            {locationSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                {locationSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex flex-col"
                    onClick={() => {
                      setSelectedLocation(suggestion.formatted);
                      setLocationSuggestions([]);
                    }}
                  >
                    <span className="font-medium text-gray-900">{suggestion.formatted}</span>
                    {suggestion.city && suggestion.country && (
                      <span className="text-sm text-gray-500">
                        {suggestion.city}, {suggestion.country}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <select className="appearance-none bg-gray-50 py-2.5 pl-4 pr-10 border border-gray-200 rounded-full focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-gray-900 text-sm">
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="commented">Most Commented</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Enhanced Posts Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map(post => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group flex flex-col h-full bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {post.image && (
                <div className="h-56 relative rounded-t-2xl overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}

              <div className="p-5 md:p-6 flex-1 flex flex-col">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-teal-50 text-teal-600">
                  {categories.find(c => c.id === post.category)?.name}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 mt-3 line-clamp-2 hover:text-teal-600 transition-colors">
                  {post.title}
                </h3>
                <div
                  className="mt-3 text-gray-800 text-sm leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-4 flex items-center gap-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full ring-2 ring-white"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{post.author.name}</h4>
                    <p className="text-xs text-gray-700">
                      {post.location.city}, {post.location.country}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm text-gray-700">
                  <button
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.isLiked ? 'text-teal-600' : 'hover:text-teal-600'
                    }`}
                    onClick={() => handleLikePost(post.id)}
                  >
                    <svg
                      className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                      />
                    </svg>
                    {post.likes}
                  </button>
                  <button
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.isDisliked ? 'text-red-600' : 'hover:text-red-600'
                    }`}
                    onClick={() => handleDislikePost(post.id)}
                  >
                    <svg
                      className={`w-4 h-4 ${post.isDisliked ? 'fill-current' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5 6h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2.5"
                      />
                    </svg>
                    {post.dislikes}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Create Post Modal */}
        {isCreatePostModalOpen && (
          <CreatePostModal
            onClose={() => setIsCreatePostModalOpen(false)}
            onSubmit={handleCreatePost}
            categories={categories}
          />
        )}
      </div>
    </div>
  );
}

// Enhanced Create Post Modal
function CreatePostModal({
  onClose,
  onSubmit,
  categories,
}: {
  onClose: () => void;
  onSubmit: (data: any) => void;
  categories: Category[];
}) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    location: '',
    image: '' as string | null,
    selectedLocation: null as LocationSuggestion | null,
  });
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);

  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          q: query,
          key: 'eff4152b754f41cdae480219c2bf84df',
          limit: 5,
          no_annotations: 1,
        },
      });
      const suggestions = response.data.results.map((result: any) => ({
        formatted: result.formatted,
        city: result.components.city || result.components.town,
        country: result.components.country,
      }));
      setLocationSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocationSuggestions([]);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, location: value }));
    fetchLocationSuggestions(value);
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      setFormData(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const locationData = formData.selectedLocation!;
    onSubmit({
      ...formData,
      location: {
        city: locationData.city,
        country: locationData.country,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Share Your Travel Experience</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Give your experience a captivating title"
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20"
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />

          {/* Rich Text Editor with darker text */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-2 border-b border-gray-200 flex gap-2">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 text-gray-700 ${
                  editor?.isActive('bold') ? 'bg-gray-200 text-gray-900' : ''
                }`}
              >
                <Bold size={16} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 text-gray-700 ${
                  editor?.isActive('italic') ? 'bg-gray-200 text-gray-900' : ''
                }`}
              >
                <Italic size={16} />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 text-gray-700 ${
                  editor?.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : ''
                }`}
              >
                <List size={16} />
              </button>
            </div>
            <EditorContent
              editor={editor}
              className="p-4 min-h-[200px] prose max-w-none text-gray-900"
            />
          </div>

          <select
            className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20"
            onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
          >
            <option value="" className="text-gray-900">
              Select Category
            </option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id} className="text-gray-900">
                {cat.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Enter a location"
              className="w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20"
              value={formData.location}
              onChange={handleLocationChange}
            />
            {locationSuggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                {locationSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex flex-col gap-1 border-b border-gray-100 last:border-0"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        location: suggestion.formatted,
                        selectedLocation: suggestion,
                      }));
                      setLocationSuggestions([]);
                    }}
                  >
                    <span className="font-medium text-gray-900">{suggestion.formatted}</span>
                    {suggestion.city && suggestion.country && (
                      <span className="text-gray-700">
                        {suggestion.city}, {suggestion.country}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            className="w-full text-gray-900"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFormData(prev => ({ ...prev, image: reader.result as string }));
                };
                reader.readAsDataURL(file);
              }
            }}
          />

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-800 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
