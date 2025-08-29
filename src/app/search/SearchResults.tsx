'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Calendar, Clock, User, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { blogPosts, categories, searchPosts } from '@/lib/blog/data';
import { Analytics } from '@/lib/analytics/google-analytics';

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [results, setResults] = useState(blogPosts.filter(post => post.published));
  
  useEffect(() => {
    let filteredResults = blogPosts.filter(post => post.published);
    
    if (searchQuery.trim()) {
      filteredResults = searchPosts(searchQuery.trim());
      
      // Track search event
      Analytics.trackSearch(searchQuery.trim(), filteredResults.length);
    }
    
    if (selectedCategory) {
      filteredResults = filteredResults.filter(post => post.category.slug === selectedCategory);
    }
    
    setResults(filteredResults);
  }, [searchQuery, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL without page refresh
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory) params.set('category', selectedCategory);
    
    window.history.pushState(null, '', `/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    window.history.pushState(null, '', '/search');
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blog posts, tutorials, and resources..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </Button>
                
                {(searchQuery || selectedCategory) && (
                  <Button type="button" variant="outline" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {searchQuery ? `Search results for "${searchQuery}"` : 'All Posts'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
            {selectedCategory && ` in ${categories.find(cat => cat.slug === selectedCategory)?.name}`}
          </p>
        </div>
        
        {results.length > 0 && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Sort by relevance</span>
          </div>
        )}
      </div>

      {/* Search Results */}
      {results.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `We couldn't find any posts matching "${searchQuery}". Try using different keywords or check your spelling.`
                : 'Try searching for specific topics or browse our categories.'
              }
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Popular searches:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Next.js', 'Authentication', 'Goals', 'Productivity', 'SaaS'].map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow bg-white">
              {post.featuredImage && (
                <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {post.title.split(' ').slice(0, 2).map(word => word[0]).join('')}
                  </span>
                </div>
              )}
              
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    style={{ backgroundColor: `${post.category.color}10`, color: post.category.color }}
                  >
                    {post.category.name}
                  </Badge>
                  {post.featured && <Badge variant="outline">Featured</Badge>}
                </div>
                
                <CardTitle className="text-lg hover:text-indigo-600 transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime} min</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
                
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/blog/${post.slug}`}>
                    Read Article
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Load More (placeholder for pagination) */}
      {results.length > 6 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Results
          </Button>
        </div>
      )}
    </div>
  );
}