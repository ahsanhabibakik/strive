'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Calendar,
  TrendingUp,
  Users,
  FileText,
  Settings,
  BarChart3,
  Clock,
} from 'lucide-react';
import { Activity } from '@/types/activity';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  // Fetch blog posts from API
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      const data: BlogPost[] = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/admin/activity');
      const data: Activity[] = await res.json();
      setActivities(data);
    } catch (err) {
      console.error('Failed to fetch activities', err);
    } finally {
      setLoadingActivities(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchActivities();
  }, []);

  const allTags = Array.from(new Set(posts.flatMap((p: BlogPost) => p.tags)));

  const filteredPosts = posts.filter((post: BlogPost) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Dashboard stats
  const stats = [
    {
      title: 'Total Posts',
      value: posts.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Published This Month',
      value: posts.filter(post => {
        const postDate = new Date(post.date);
        const now = new Date();
        return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
      }).length,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Total Tags',
      value: allTags.length,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'Avg Reading Time',
      value: posts.length > 0 ? Math.round(
        posts.reduce((acc: number, post: BlogPost) => acc + (parseInt(post.readingTime || '0') || 0), 0) / posts.length
      ) + ' min' : 'N/A',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your blog posts and content</p>
            </div>
            <Button 
              onClick={() => { setEditingPost(null); setIsPostDialogOpen(true); }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Analytics Overview
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              View detailed analytics and performance metrics for your blog posts.
            </p>
            <Button variant="outline" size="sm">View Analytics</Button>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              User Management
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage user accounts, permissions, and access levels.
            </p>
            <Button variant="outline" size="sm">Manage Users</Button>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Site Settings
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure site settings, SEO, and general preferences.
            </p>
            <Button variant="outline" size="sm">Open Settings</Button>
          </Card>
        </motion.div>

        {/* Blog Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold">Blog Posts Management</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search posts..."
                    className="pl-10 w-full sm:w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge
                key="all-posts"
                variant={!selectedTag ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedTag(null)}
              >
                All Posts
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {loading && <p className="text-center">Loading...</p>}
              {filteredPosts.map((post: BlogPost) => (
                <motion.div
                  key={String(post._id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => { setEditingPost(post); setIsPostDialogOpen(true); }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={async () => {
                              if (!post._id) return;
                              await fetch(`/api/admin/blog/${post._id}`, { method: 'DELETE' });
                              fetchPosts();
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingTime}
                        </span>
                        <div className="flex gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {!loading && filteredPosts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No posts found matching your criteria.</p>
              </div>
            )}
          </Card>

          {/* Blog Create/Edit Dialog */}
          <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Edit Post' : 'New Post'}</DialogTitle>
              </DialogHeader>

              <form id="blog-form" className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget as HTMLFormElement);
                const payload: Record<string, string | string[]> = {};
                formData.forEach((value, key) => {
                  if (typeof value === 'string') {
                    payload[key] = value;
                  }
                });
                payload.tags = payload.tags ? (payload.tags as string).split(',').map((t: string)=>t.trim()) : [];

                if (editingPost && editingPost._id) {
                  await fetch(`/api/admin/blog/${editingPost._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                } else {
                  await fetch('/api/admin/blog', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                }
                fetchPosts();
                setIsPostDialogOpen(false);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" defaultValue={editingPost?.title || ''} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" name="slug" defaultValue={editingPost?.slug || ''} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={editingPost?.excerpt || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" name="content" rows={6} defaultValue={editingPost?.content || ''} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input id="tags" name="tags" defaultValue={editingPost?.tags?.join(', ') || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input id="coverImage" name="coverImage" defaultValue={editingPost?.coverImage || ''} />
                  </div>
                </div>
              </form>

              <DialogFooter>
                <Button type="submit" form="blog-form">{editingPost ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Activities Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Activities</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Activity</DialogTitle>
                    <DialogDescription>Add a custom activity entry.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="action">Action</Label>
                      <Input id="action" placeholder="e.g. Fixed bug in contact form" className="w-full" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        onClick={async () => {
                          const actionInput = (document.getElementById('action') as HTMLInputElement)?.value;
                          if (!actionInput) return;
                          await fetch('/api/admin/activity', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: actionInput })
                          });
                          fetchActivities();
                        }}
                      >
                        Save
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {loadingActivities && <p>Loading...</p>}
            {!loadingActivities && activities.length === 0 && (
              <p className="text-muted-foreground">No activities logged yet.</p>
            )}

            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={String(activity._id)} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{activity.action}</h3>
                      <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const actionInput = (document.getElementById('action') as HTMLInputElement)?.value;
                          if (!actionInput) return;
                          await fetch(`/api/admin/activity/${activity._id}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: actionInput })
                          });
                          fetchActivities();
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          if (!activity._id) return;
                          if (!confirm('Delete this activity?')) return;
                          await fetch(`/api/admin/activity/${activity._id}`, { method: 'DELETE' });
                          fetchActivities();
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}