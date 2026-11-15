'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Star,
  Clock,
  Calendar,
  Upload,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Save,
  X,
  FileText,
  User,
  Share2,
  Layers,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface BlogItem {
  id: string;
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  summary: string;
  coverImage: string;
  imageAlt?: string | null;
  category: string;
  contentHtml: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  readTime: string;
  isPublished: boolean;
  isFeatured: boolean;
  displayOrder: number;
  publishedDate: string;
  faqsJson?: string | null;
  relatedProductSlug?: string | null;
  relatedProductName?: string | null;
  views: number;
  createdAt: string;
  updatedAt: string;
}

const PRESET_CATEGORIES = [
  'Purity & Quality Guides',
  'Nutrition & Wellness',
  'Farm Traditions & Heritage',
  'Artisanal Recipes',
  'Cold-Chain & Food Safety',
];

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, featured: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'author' | 'seo' | 'preview'>('content');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [productsList, setProductsList] = useState<{ id: string; name: string; slug: string }[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Purity & Quality Guides',
    customCategory: '',
    summary: '',
    coverImage: '/products/fresh-milk.jpg',
    imageAlt: '',
    contentHtml: '',
    authorName: 'Sanaullah',
    authorRole: 'Master Dairy Farm Manager',
    authorAvatar: '/profile.jpg',
    readTime: '6 min read',
    isPublished: true,
    isFeatured: false,
    displayOrder: 0,
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    faqs: [] as FaqItem[],
    relatedProductSlug: 'pure-clarified-butter-artisanal-ghee',
    relatedProductName: 'Pure Clarified Butter (Artisanal Ghee)',
  });

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/blogs', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      showToast('error', 'Failed to load blog posts from database');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) {
        setProductsList(data.map((p: any) => ({ id: p.id, name: p.name, slug: p.slug })));
      }
    } catch (err) {
      console.warn('Could not fetch products list:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchProducts();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      const matchesSearch =
        !searchQuery ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.keywords && b.keywords.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'ALL' || b.category === selectedCategory;

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'PUBLISHED' && b.isPublished) ||
        (statusFilter === 'DRAFT' && !b.isPublished);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [blogs, searchQuery, selectedCategory, statusFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Purity & Quality Guides',
      customCategory: '',
      summary: '',
      coverImage: '/products/fresh-milk.jpg',
      imageAlt: '',
      contentHtml: `<p class="lead text-lg text-forest-700 leading-relaxed font-sans mb-6">
Start your article here with an engaging introductory paragraph.
</p>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">First Key Point Heading</h2>
<p class="text-forest-800 leading-relaxed mb-4">
Provide clear, evidence-based details explaining why authentic dairy quality matters for health and family wellness.
</p>`,
      authorName: 'Sanaullah',
      authorRole: 'Master Dairy Farm Manager',
      authorAvatar: '/profile.jpg',
      readTime: '5 min read',
      isPublished: true,
      isFeatured: false,
      displayOrder: blogs.length + 1,
      metaTitle: '',
      metaDescription: '',
      keywords: 'pure farm dairy, organic desi ghee, raw cow milk',
      faqs: [
        {
          question: 'What is the quality assurance behind this product?',
          answer: 'All SUNNY Dairy products undergo unbroken cold-chain chilling and rigorous zero water dilution standards.',
        },
      ],
      relatedProductSlug: productsList[0]?.slug || 'farm-fresh-cow-milk',
      relatedProductName: productsList[0]?.name || 'Farm-Fresh Whole Cow Milk',
    });
    setActiveTab('content');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (blog: BlogItem) => {
    setEditingBlog(blog);

    let parsedFaqs: FaqItem[] = [];
    if (blog.faqsJson) {
      try {
        parsedFaqs = JSON.parse(blog.faqsJson);
      } catch {
        parsedFaqs = [];
      }
    }

    setFormData({
      title: blog.title,
      slug: blog.slug,
      category: PRESET_CATEGORIES.includes(blog.category) ? blog.category : 'CUSTOM',
      customCategory: PRESET_CATEGORIES.includes(blog.category) ? '' : blog.category,
      summary: blog.summary,
      coverImage: blog.coverImage || '/products/fresh-milk.jpg',
      imageAlt: blog.imageAlt || '',
      contentHtml: blog.contentHtml,
      authorName: blog.authorName || 'Sanaullah',
      authorRole: blog.authorRole || 'Master Dairy Farm Manager',
      authorAvatar: blog.authorAvatar || '/profile.jpg',
      readTime: blog.readTime || '6 min read',
      isPublished: blog.isPublished,
      isFeatured: blog.isFeatured,
      displayOrder: blog.displayOrder,
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
      keywords: blog.keywords || '',
      faqs: parsedFaqs,
      relatedProductSlug: blog.relatedProductSlug || '',
      relatedProductName: blog.relatedProductName || '',
    });

    setActiveTab('content');
    setIsModalOpen(true);
  };

  // Auto-slug generator
  const handleTitleChange = (val: string) => {
    const isNew = !editingBlog;
    setFormData((prev) => {
      const generatedSlug = isNew || prev.slug === '' ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : prev.slug;
      const generatedMetaTitle = isNew || prev.metaTitle === '' ? `${val.trim()} | SUNNY Dairy` : prev.metaTitle;
      return {
        ...prev,
        title: val,
        slug: generatedSlug,
        metaTitle: generatedMetaTitle,
        imageAlt: prev.imageAlt || val,
      };
    });
  };

  // Rich Content Helper Inserts
  const insertSnippet = (snippet: string) => {
    setFormData((prev) => ({
      ...prev,
      contentHtml: prev.contentHtml + '\n' + snippet,
    }));
  };

  // Upload Cover Image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, coverImage: data.url }));
        showToast('success', 'Cover image uploaded successfully!');
      } else {
        showToast('error', data.error || 'Upload failed');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Image upload error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Blog Post
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('error', 'Please provide an article title');
      return;
    }
    if (!formData.summary.trim()) {
      showToast('error', 'Please provide a short summary / excerpt');
      return;
    }
    if (!formData.contentHtml.trim()) {
      showToast('error', 'Article content cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const effectiveCategory =
        formData.category === 'CUSTOM' ? formData.customCategory.trim() || 'General' : formData.category;

      const payload = {
        title: formData.title,
        slug: formData.slug,
        category: effectiveCategory,
        summary: formData.summary,
        coverImage: formData.coverImage,
        imageAlt: formData.imageAlt,
        contentHtml: formData.contentHtml,
        authorName: formData.authorName,
        authorRole: formData.authorRole,
        authorAvatar: formData.authorAvatar,
        readTime: formData.readTime,
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured,
        displayOrder: Number(formData.displayOrder) || 0,
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        keywords: formData.keywords,
        faqsJson: JSON.stringify(formData.faqs),
        relatedProductSlug: formData.relatedProductSlug,
        relatedProductName: formData.relatedProductName,
      };

      let res;
      if (editingBlog) {
        res = await fetch(`/api/admin/blogs/${editingBlog.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save blog post');
      }

      showToast(
        'success',
        editingBlog ? `Article "${formData.title}" updated successfully!` : `Article "${formData.title}" published!`
      );
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      console.error(err);
      showToast('error', err.message || 'Error saving article');
    } finally {
      setSaving(false);
    }
  };

  // Quick toggle publication status
  const handleTogglePublish = async (blog: BlogItem) => {
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !blog.isPublished }),
      });
      if (res.ok) {
        setBlogs((prev) =>
          prev.map((b) => (b.id === blog.id ? { ...b, isPublished: !blog.isPublished } : b))
        );
        showToast(
          'success',
          !blog.isPublished ? `"${blog.title}" is now Published live!` : `"${blog.title}" moved to Draft.`
        );
      }
    } catch (err) {
      showToast('error', 'Failed to toggle status');
    }
  };

  // Quick toggle featured status
  const handleToggleFeatured = async (blog: BlogItem) => {
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !blog.isFeatured }),
      });
      if (res.ok) {
        setBlogs((prev) =>
          prev.map((b) => (b.id === blog.id ? { ...b, isFeatured: !blog.isFeatured } : b))
        );
        showToast(
          'success',
          !blog.isFeatured
            ? `"${blog.title}" is now Featured on Homepage!`
            : `"${blog.title}" removed from Featured.`
        );
      }
    } catch (err) {
      showToast('error', 'Failed to toggle featured status');
    }
  };

  // Delete blog post
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        showToast('success', 'Article deleted permanently.');
        setDeleteConfirmId(null);
      } else {
        const data = await res.json();
        showToast('error', data.error || 'Failed to delete');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Delete failed');
    }
  };

  // FAQ management
  const addFaqItem = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }));
  };

  const updateFaqItem = (index: number, field: 'question' | 'answer', value: string) => {
    setFormData((prev) => {
      const copy = [...prev.faqs];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, faqs: copy };
    });
  };

  const removeFaqItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-xl flex items-center space-x-3 text-sm font-semibold transition-all transform animate-bounce duration-300 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-900/20'
              : 'bg-rose-600 text-white shadow-rose-900/20'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-cream-200">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gold-700 bg-gold-100/60 px-3 py-1 rounded-full mb-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Farm Journal &amp; Editorial Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">
            Farm Journal &amp; Dairy Blogs
          </h1>
          <p className="text-sm text-forest-600 mt-1 max-w-2xl">
            Publish SEO-optimized guides, morning milk benefits, clarified butter purity tests, and pastoral confectionery articles to educate customers and drive 100% organic Google search traffic.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-forest-800 bg-white border border-forest-200 hover:bg-forest-50 hover:border-forest-300 transition-colors shadow-xs"
          >
            <Eye className="w-4 h-4 text-forest-600" />
            <span>View Public Blog</span>
            <ExternalLink className="w-3.5 h-3.5 text-forest-400" />
          </Link>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold text-forest-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 shadow-md shadow-gold-500/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4 text-forest-950" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-cream-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800 flex-shrink-0">
            <BookOpen className="w-6 h-6 text-forest-700" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-forest-900">{stats.total}</div>
            <div className="text-xs font-semibold text-forest-600 uppercase tracking-wider">Total Articles</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-cream-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-forest-900">{stats.published}</div>
            <div className="text-xs font-semibold text-forest-600 uppercase tracking-wider">Published Live</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-cream-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
            <Edit3 className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-forest-900">{stats.draft}</div>
            <div className="text-xs font-semibold text-forest-600 uppercase tracking-wider">Drafts</div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-cream-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-700 flex-shrink-0">
            <Star className="w-6 h-6 text-gold-600 fill-gold-500/30" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-forest-900">{stats.featured}</div>
            <div className="text-xs font-semibold text-forest-600 uppercase tracking-wider">Homepage Featured</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-forest-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title, keywords, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-forest-900 placeholder-forest-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-forest-200 bg-white text-forest-800 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
          >
            <option value="ALL">All Categories</option>
            {PRESET_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="inline-flex p-1 bg-forest-50 rounded-xl border border-forest-100 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'ALL' ? 'bg-white text-forest-900 shadow-xs' : 'text-forest-600 hover:text-forest-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('PUBLISHED')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'PUBLISHED' ? 'bg-white text-emerald-800 shadow-xs' : 'text-forest-600 hover:text-forest-900'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter('DRAFT')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === 'DRAFT' ? 'bg-white text-amber-800 shadow-xs' : 'text-forest-600 hover:text-forest-900'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>
      </div>

      {/* Articles List / Table */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-forest-500">
            <div className="w-8 h-8 border-3 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Loading articles from database...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-forest-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-forest-900">No articles found</h3>
            <p className="text-xs text-forest-500 max-w-sm mx-auto">
              No articles match your current search query or filter. Try clearing filters or write a new article!
            </p>
            <button
              onClick={handleOpenCreate}
              className="mt-2 inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white bg-forest-900 rounded-xl hover:bg-forest-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write Your First Article</span>
            </button>
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards View (Screen < 768px) */}
            <div className="block md:hidden divide-y divide-cream-100 p-3 sm:p-4 space-y-3">
              {filteredBlogs.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-cream-50/60 border border-cream-200/80 space-y-3 transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-forest-900 flex-shrink-0 border border-cream-200">
                      <img
                        src={b.coverImage || '/products/fresh-milk.jpg'}
                        alt={b.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 border border-forest-200/50">
                          {b.category}
                        </span>
                        {b.isFeatured && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gold-100 text-gold-800 flex items-center space-x-0.5">
                            <Star className="w-2.5 h-2.5 fill-gold-500 text-gold-600" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/blog/${b.slug}`}
                        target="_blank"
                        className="font-serif font-bold text-sm text-forest-900 hover:text-gold-700 transition-colors line-clamp-2 leading-snug block"
                      >
                        {b.title}
                      </Link>
                      <div className="text-[11px] text-forest-500 font-mono truncate">
                        /blog/{b.slug}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-forest-600 pt-2 border-t border-cream-200/60">
                    <div className="flex items-center space-x-1.5">
                      <img
                        src={b.authorAvatar || '/profile.jpg'}
                        alt={b.authorName}
                        className="w-5 h-5 rounded-full object-cover border border-gold-400"
                      />
                      <span className="text-[11px] font-semibold text-forest-800">{b.authorName}</span>
                    </div>
                    <span className="text-[11px] font-mono text-forest-500">{b.readTime}</span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleTogglePublish(b)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                        b.isPublished
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${b.isPublished ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                      <span>{b.isPublished ? 'Published' : 'Draft'}</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleFeatured(b)}
                        className={`p-1.5 rounded-lg border ${
                          b.isFeatured
                            ? 'text-gold-600 bg-gold-50 border-gold-300'
                            : 'text-forest-400 hover:text-gold-500 border-cream-200'
                        }`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-3.5 h-3.5 ${b.isFeatured ? 'fill-gold-500' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="px-2.5 py-1 rounded-lg border border-cream-300 bg-white text-xs font-semibold text-forest-800 hover:bg-cream-100 inline-flex items-center space-x-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(b.id)}
                        className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop Table View (Screen >= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-forest-50/60 border-b border-cream-200 text-[11px] font-bold text-forest-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Read Time</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100 text-sm">
                {filteredBlogs.map((b) => (
                  <tr key={b.id} className="hover:bg-forest-50/30 transition-colors">
                    {/* Article Info */}
                    <td className="py-3.5 px-4 min-w-[280px]">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-forest-900 flex-shrink-0 border border-cream-200">
                          <img
                            src={b.coverImage || '/products/fresh-milk.jpg'}
                            alt={b.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <Link
                            href={`/blog/${b.slug}`}
                            target="_blank"
                            className="font-serif font-bold text-forest-900 hover:text-gold-700 transition-colors line-clamp-1 text-sm inline-flex items-center space-x-1"
                          >
                            <span>{b.title}</span>
                            <ExternalLink className="w-3 h-3 text-forest-400 opacity-60 flex-shrink-0" />
                          </Link>
                          <div className="text-[11px] text-forest-500 font-mono">
                            /blog/{b.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-forest-100/70 text-forest-800 border border-forest-200/50">
                        {b.category}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <img
                          src={b.authorAvatar || '/profile.jpg'}
                          alt={b.authorName}
                          className="w-6 h-6 rounded-full object-cover border border-gold-400 flex-shrink-0"
                        />
                        <span className="text-xs font-semibold text-forest-800">{b.authorName}</span>
                      </div>
                    </td>

                    {/* Read Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-forest-600 font-mono">
                      {b.readTime}
                    </td>

                    {/* Featured toggle */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(b)}
                        title={b.isFeatured ? 'Featured on Homepage (Click to remove)' : 'Not Featured (Click to feature)'}
                        className={`p-1.5 rounded-lg transition-colors ${
                          b.isFeatured
                            ? 'text-gold-600 bg-gold-50 hover:bg-gold-100 border border-gold-300'
                            : 'text-forest-300 hover:text-gold-500 hover:bg-forest-50'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${b.isFeatured ? 'fill-gold-500' : ''}`} />
                      </button>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(b)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          b.isPublished
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${b.isPublished ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                        <span>{b.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          title="View Live Article"
                          className="p-1.5 text-forest-600 hover:text-forest-900 hover:bg-forest-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(b)}
                          title="Edit Article"
                          className="p-1.5 text-forest-600 hover:text-forest-900 hover:bg-forest-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(b.id)}
                          title="Delete Article"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-cream-200 space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-forest-900">Delete Blog Article?</h3>
              <p className="text-xs text-forest-600 leading-relaxed">
                Are you sure you want to delete this blog post? This action will permanently remove it from the database and public blog.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-bold text-forest-700 bg-forest-100 hover:bg-forest-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Fullscreen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl border border-cream-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-cream-200 flex items-center justify-between bg-forest-950 text-white flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-forest-900 border border-forest-800 flex items-center justify-center text-gold-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold">
                    {editingBlog ? `Edit: ${editingBlog.title}` : 'Write New Farm Journal Article'}
                  </h2>
                  <p className="text-xs text-cream-200">
                    High-quality content creation, SEO meta parameters &amp; schema markup
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-forest-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-cream-200 bg-cream-50/80 px-6 gap-2 text-xs font-bold text-forest-700 flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 transition-all ${
                  activeTab === 'content'
                    ? 'border-forest-900 text-forest-950 bg-white rounded-t-lg'
                    : 'border-transparent text-forest-600 hover:text-forest-900'
                }`}
              >
                <FileText className="w-4 h-4 text-forest-600" />
                <span>Article &amp; Content</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('author')}
                className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 transition-all ${
                  activeTab === 'author'
                    ? 'border-forest-900 text-forest-950 bg-white rounded-t-lg'
                    : 'border-transparent text-forest-600 hover:text-forest-900'
                }`}
              >
                <User className="w-4 h-4 text-forest-600" />
                <span>Author &amp; Product CTA</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 transition-all ${
                  activeTab === 'seo'
                    ? 'border-forest-900 text-forest-950 bg-white rounded-t-lg'
                    : 'border-transparent text-forest-600 hover:text-forest-900'
                }`}
              >
                <Share2 className="w-4 h-4 text-forest-600" />
                <span>SEO &amp; FAQs Schema</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`py-3 px-3.5 border-b-2 flex items-center space-x-2 transition-all ${
                  activeTab === 'preview'
                    ? 'border-forest-900 text-forest-950 bg-white rounded-t-lg'
                    : 'border-transparent text-forest-600 hover:text-forest-900'
                }`}
              >
                <Eye className="w-4 h-4 text-forest-600" />
                <span>Live Preview</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* TAB 1: CONTENT */}
              {activeTab === 'content' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Title */}
                    <div className="md:col-span-8 space-y-1.5">
                      <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. 5 Easy Purity Tests to Check Pure Desi Ghee at Home"
                        className="w-full px-3.5 py-2.5 text-sm font-serif font-bold rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-800/20 text-forest-900"
                      />
                    </div>

                    {/* Slug */}
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                          }))
                        }
                        placeholder="how-to-check-pure-desi-ghee"
                        className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-800/20 text-forest-700 bg-cream-50/50"
                      />
                    </div>
                  </div>

                  {/* Category & Read Time */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 space-y-1.5">
                      <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-forest-200 bg-white text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                      >
                        {PRESET_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                        <option value="CUSTOM">+ Custom Category</option>
                      </select>

                      {formData.category === 'CUSTOM' && (
                        <input
                          type="text"
                          placeholder="Enter custom category name..."
                          value={formData.customCategory}
                          onChange={(e) => setFormData((prev) => ({ ...prev, customCategory: e.target.value }))}
                          className="mt-2 w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200"
                        />
                      )}
                    </div>

                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={formData.readTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, readTime: e.target.value }))}
                        placeholder="6 min read"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-forest-200 text-forest-900"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.displayOrder}
                        onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: Number(e.target.value) }))}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-forest-200 text-forest-900"
                      />
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                      Cover Image
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-3 relative h-28 rounded-xl overflow-hidden bg-forest-900 border border-forest-200">
                        <img
                          src={formData.coverImage || '/products/fresh-milk.jpg'}
                          alt={formData.imageAlt || 'Cover'}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="md:col-span-9 space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={formData.coverImage}
                            onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                            placeholder="/products/desi-ghee.jpg or https://..."
                            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-forest-200 font-mono text-forest-800"
                          />
                          <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-forest-900 bg-forest-100 hover:bg-forest-200 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingImage}
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <input
                          type="text"
                          value={formData.imageAlt}
                          onChange={(e) => setFormData((prev) => ({ ...prev, imageAlt: e.target.value }))}
                          placeholder="Image SEO Alt text (e.g. Pure organic clarified butter desi ghee jar)"
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-forest-200 text-forest-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary / Excerpt */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                      Short Summary / Excerpt *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.summary}
                      onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                      placeholder="Brief 1-2 sentence overview shown in blog cards and social sharing..."
                      className="w-full px-3.5 py-2.5 text-xs text-forest-900 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-800/20 leading-relaxed"
                    />
                  </div>

                  {/* Rich Content HTML Editor */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                        Full Article HTML Content *
                      </label>
                      <span className="text-[11px] text-forest-500 font-medium">
                        Rich HTML formatting supported
                      </span>
                    </div>

                    {/* Toolbar Quick-Insert Helpers */}
                    <div className="flex flex-wrap items-center gap-1.5 p-2 bg-forest-50/70 border border-cream-200 rounded-xl text-xs">
                      <button
                        type="button"
                        onClick={() => insertSnippet('<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">Section Heading</h2>')}
                        className="px-2.5 py-1 bg-white hover:bg-forest-100 rounded-lg border border-forest-200 font-bold text-forest-800"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet('<h3 class="text-xl font-serif font-bold text-forest-900 mt-6 mb-3">Subheading</h3>')}
                        className="px-2.5 py-1 bg-white hover:bg-forest-100 rounded-lg border border-forest-200 font-bold text-forest-800"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet('<p class="text-forest-800 leading-relaxed mb-4">Your text paragraph here...</p>')}
                        className="px-2.5 py-1 bg-white hover:bg-forest-100 rounded-lg border border-forest-200 text-forest-800"
                      >
                        Paragraph
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet('<div class="my-8 p-6 bg-cream-50 border-l-4 border-gold-500 rounded-r-xl shadow-sm"><h3 class="text-xl font-serif font-bold text-forest-900 mb-2">SUNNY Dairy Quality Standard</h3><p class="text-sm text-forest-700 leading-relaxed">Certified 100% farm-pure dairy with zero water adulteration.</p></div>')}
                        className="px-2.5 py-1 bg-white hover:bg-gold-50 rounded-lg border border-gold-300 font-bold text-gold-800"
                      >
                        + Quality Box
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet('<ul class="list-disc pl-6 space-y-2 text-forest-800 mb-6">\n  <li>Bullet point 1</li>\n  <li>Bullet point 2</li>\n</ul>')}
                        className="px-2.5 py-1 bg-white hover:bg-forest-100 rounded-lg border border-forest-200 text-forest-800"
                      >
                        Bullet List
                      </button>
                      <button
                        type="button"
                        onClick={() => insertSnippet('<ol class="list-decimal pl-6 space-y-2 text-forest-800 mb-6">\n  <li>Step 1 description</li>\n  <li>Step 2 description</li>\n</ol>')}
                        className="px-2.5 py-1 bg-white hover:bg-forest-100 rounded-lg border border-forest-200 text-forest-800"
                      >
                        Numbered List
                      </button>
                    </div>

                    <textarea
                      required
                      rows={12}
                      value={formData.contentHtml}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contentHtml: e.target.value }))}
                      className="w-full font-mono text-xs text-forest-900 p-4 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-800/20 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: AUTHOR & PRODUCT CTA */}
              {activeTab === 'author' && (
                <div className="space-y-6">
                  {/* Author Settings */}
                  <div className="bg-cream-50/70 p-5 rounded-2xl border border-cream-200 space-y-4">
                    <h3 className="font-serif text-base font-bold text-forest-900 flex items-center space-x-2">
                      <User className="w-4 h-4 text-gold-600" />
                      <span>Author Credentials</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-forest-800">Author Name</label>
                        <input
                          type="text"
                          value={formData.authorName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, authorName: e.target.value }))}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-forest-200 text-forest-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-forest-800">Author Role</label>
                        <input
                          type="text"
                          value={formData.authorRole}
                          onChange={(e) => setFormData((prev) => ({ ...prev, authorRole: e.target.value }))}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-forest-200 text-forest-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-forest-800">Author Avatar Path</label>
                        <input
                          type="text"
                          value={formData.authorAvatar}
                          onChange={(e) => setFormData((prev) => ({ ...prev, authorAvatar: e.target.value }))}
                          className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-forest-200 text-forest-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Related Product Call To Action */}
                  <div className="bg-cream-50/70 p-5 rounded-2xl border border-cream-200 space-y-4">
                    <h3 className="font-serif text-base font-bold text-forest-900 flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-gold-600" />
                      <span>Featured Product Call to Action (CTA)</span>
                    </h3>
                    <p className="text-xs text-forest-600">
                      Select which farm product should be recommended at the conclusion of this article to convert readers into direct orders.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-forest-800">Choose Farm Product</label>
                        <select
                          value={formData.relatedProductSlug}
                          onChange={(e) => {
                            const found = productsList.find((p) => p.slug === e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              relatedProductSlug: e.target.value,
                              relatedProductName: found?.name || prev.relatedProductName,
                            }));
                          }}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-forest-200 bg-white text-forest-900"
                        >
                          {productsList.map((p) => (
                            <option key={p.id} value={p.slug}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-forest-800">Product Display Label</label>
                        <input
                          type="text"
                          value={formData.relatedProductName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, relatedProductName: e.target.value }))}
                          className="w-full px-3.5 py-2 text-sm rounded-xl border border-forest-200 text-forest-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Publishing Status & Flags */}
                  <div className="bg-cream-50/70 p-5 rounded-2xl border border-cream-200 space-y-3">
                    <h3 className="font-serif text-base font-bold text-forest-900">
                      Visibility &amp; Homepage Settings
                    </h3>

                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <label className="flex items-center space-x-2 cursor-pointer text-sm font-semibold text-forest-800">
                        <input
                          type="checkbox"
                          checked={formData.isPublished}
                          onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                          className="w-4 h-4 rounded text-forest-900 focus:ring-forest-800"
                        />
                        <span>Publish Live on Website (Visible to Public)</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer text-sm font-semibold text-forest-800">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                          className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500"
                        />
                        <span>Feature on Homepage ("From Our Farm Journal")</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SEO & FAQS SCHEMA */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  {/* Google Snippet Preview */}
                  <div className="bg-white p-4 rounded-xl border border-cream-200 shadow-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-400">
                      Google Search Result Snippet Preview
                    </span>
                    <div className="text-xs text-[#202124] font-sans">
                      https://sunny-dairy-web.vercel.app › blog › {formData.slug || 'article-slug'}
                    </div>
                    <div className="text-base text-[#1a0dab] font-sans hover:underline cursor-pointer font-medium leading-snug">
                      {formData.metaTitle || formData.title || 'Article Title | SUNNY Dairy'}
                    </div>
                    <div className="text-xs text-[#4d5156] font-sans leading-relaxed line-clamp-2">
                      {formData.metaDescription || formData.summary || 'Article description will appear here...'}
                    </div>
                  </div>

                  {/* Meta Tags */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                          SEO Meta Title
                        </label>
                        <span
                          className={`text-[11px] font-mono ${
                            formData.metaTitle.length > 60 ? 'text-amber-600 font-bold' : 'text-forest-400'
                          }`}
                        >
                          {formData.metaTitle.length} / 60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                        placeholder="Optimized headline for Google search results..."
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-forest-200 text-forest-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                          SEO Meta Description
                        </label>
                        <span
                          className={`text-[11px] font-mono ${
                            formData.metaDescription.length > 160 ? 'text-amber-600 font-bold' : 'text-forest-400'
                          }`}
                        >
                          {formData.metaDescription.length} / 160 chars
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={formData.metaDescription}
                        onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                        placeholder="150-160 character snippet that compels searchers to click..."
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-forest-200 text-forest-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-forest-800 uppercase tracking-wider">
                        Focus Keywords (Comma-Separated)
                      </label>
                      <input
                        type="text"
                        value={formData.keywords}
                        onChange={(e) => setFormData((prev) => ({ ...prev, keywords: e.target.value }))}
                        placeholder="pure desi ghee in Pakistan, raw milk delivery DI Khan, organic butter Muscat"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-forest-200 text-forest-900"
                      />
                    </div>
                  </div>

                  {/* FAQ Schema Builder */}
                  <div className="bg-cream-50/70 p-5 rounded-2xl border border-cream-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-base font-bold text-forest-900 flex items-center space-x-2">
                          <HelpCircle className="w-4 h-4 text-gold-600" />
                          <span>Interactive FAQ Section &amp; JSON-LD Schema</span>
                        </h3>
                        <p className="text-xs text-forest-600 mt-0.5">
                          Questions added here generate Google Rich Results FAQ schema automatically.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={addFaqItem}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-forest-900 bg-white border border-forest-200 hover:bg-forest-50"
                      >
                        + Add Question
                      </button>
                    </div>

                    {formData.faqs.length === 0 ? (
                      <p className="text-xs text-forest-400 italic">No FAQ items added yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {formData.faqs.map((faq, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-xl border border-cream-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-forest-800">Question #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => removeFaqItem(idx)}
                                className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                              >
                                Remove
                              </button>
                            </div>
                            <input
                              type="text"
                              value={faq.question}
                              onChange={(e) => updateFaqItem(idx, 'question', e.target.value)}
                              placeholder="e.g. Can pure clarified butter be stored without refrigeration?"
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200 font-semibold text-forest-900"
                            />
                            <textarea
                              rows={2}
                              value={faq.answer}
                              onChange={(e) => updateFaqItem(idx, 'answer', e.target.value)}
                              placeholder="Direct, helpful answer..."
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-forest-200 text-forest-800"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: LIVE PREVIEW */}
              {activeTab === 'preview' && (
                <div className="space-y-6 bg-cream-50 p-6 rounded-2xl border border-cream-200">
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-cream-200 shadow-sm space-y-6">
                    <div className="space-y-3">
                      <span className="inline-block bg-forest-100 text-forest-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {formData.category === 'CUSTOM' ? formData.customCategory : formData.category}
                      </span>
                      <h1 className="font-serif text-2xl sm:text-4xl font-bold text-forest-900 leading-tight">
                        {formData.title || 'Untitled Article'}
                      </h1>
                      <div className="flex items-center space-x-3 text-xs text-forest-600">
                        <img
                          src={formData.authorAvatar || '/profile.jpg'}
                          alt={formData.authorName}
                          className="w-8 h-8 rounded-full object-cover border-2 border-gold-400"
                        />
                        <div>
                          <div className="font-bold text-forest-900">{formData.authorName}</div>
                          <div className="text-[10px] text-forest-500">{formData.authorRole} · {formData.readTime}</div>
                        </div>
                      </div>
                    </div>

                    <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-forest-900">
                      <img
                        src={formData.coverImage || '/products/fresh-milk.jpg'}
                        alt={formData.imageAlt || 'Cover'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content Preview */}
                    <div
                      className="prose prose-forest max-w-none text-forest-800 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formData.contentHtml }}
                    />

                    {/* FAQs Preview */}
                    {formData.faqs.length > 0 && (
                      <div className="pt-6 border-t border-cream-200 space-y-3">
                        <h3 className="font-serif text-lg font-bold text-forest-900">
                          Frequently Asked Questions
                        </h3>
                        {formData.faqs.map((faq, i) => (
                          <div key={i} className="p-3 bg-cream-50 rounded-xl space-y-1">
                            <div className="font-bold text-xs text-forest-900">{faq.question}</div>
                            <div className="text-xs text-forest-700">{faq.answer}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-cream-200 flex items-center justify-between bg-white flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-forest-700 hover:bg-forest-100 transition-colors"
                >
                  Cancel
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-forest-950 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 hover:from-gold-500 hover:to-gold-300 shadow-md shadow-gold-500/20 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving Article...' : editingBlog ? 'Update Article' : 'Publish Article'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
