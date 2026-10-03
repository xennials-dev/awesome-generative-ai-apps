'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Share2, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  ExternalLink,
  Loader2,
  Copy,
  Layers,
  Image as ImageIcon,
  Video as VideoIcon,
  MessageSquare
} from 'lucide-react';

interface SocialPublisherModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent?: string;
  initialMediaUrl?: string;
  initialMediaType?: 'text' | 'photo' | 'video';
}

interface PlatformItem {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  mediaTypes: string[];
  maxChars: number;
}

export default function SocialPublisherModal({
  isOpen,
  onClose,
  initialContent = '',
  initialMediaUrl = '',
  initialMediaType = 'text'
}: SocialPublisherModalProps) {
  const [platforms, setPlatforms] = useState<PlatformItem[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['x', 'linkedin', 'threads']);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(initialContent);
  const [mediaUrl, setMediaUrl] = useState(initialMediaUrl);
  const [mediaType, setMediaType] = useState<'text' | 'photo' | 'video'>(initialMediaType);
  const [scheduleDate, setScheduleDate] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<any[] | null>(null);
  const [mode, setMode] = useState<'live-api' | 'sandbox-simulator'>('sandbox-simulator');

  useEffect(() => {
    if (initialContent) setContent(initialContent);
    if (initialMediaUrl) setMediaUrl(initialMediaUrl);
    if (initialMediaType) setMediaType(initialMediaType);
  }, [initialContent, initialMediaUrl, initialMediaType]);

  // Load platform capabilities on mount
  useEffect(() => {
    async function loadPlatforms() {
      try {
        const res = await fetch('/api/social/platforms');
        if (res.ok) {
          const data = await res.json();
          if (data.platforms) {
            setPlatforms(data.platforms);
            setMode(data.mode);
          }
        }
      } catch (err) {
        console.error('Failed to load platforms', err);
      }
    }
    loadPlatforms();
  }, []);

  if (!isOpen) return null;

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const selectAllPlatforms = () => {
    if (selectedPlatforms.length === platforms.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(platforms.map(p => p.id));
    }
  };

  // Generate captions using Upload-Post / LM Studio
  const handleGenerateAiCaptions = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/social/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: mediaUrl || 'https://sample.com/preview.mp4',
          platforms: ['youtube', 'instagram', 'tiktok', 'facebook'],
          language: 'English'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.youtube?.title) setTitle(data.youtube.title);
        const caption = data.instagram?.caption || data.tiktok?.caption || data.youtube?.description;
        if (caption) setContent(caption);
      }
    } catch (err) {
      console.error('AI generation failed', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Universal Publish
  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) return;
    setIsPublishing(true);
    setPublishResults(null);

    try {
      const res = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms: selectedPlatforms,
          title: title.trim(),
          content: content.trim(),
          mediaUrl: mediaUrl.trim(),
          mediaType,
          scheduleDate: scheduleDate || undefined
        })
      });

      const data = await res.json();
      if (data.success && data.results) {
        setPublishResults(data.results);
      } else {
        alert(data.error || 'Failed to publish post');
      }
    } catch (err: any) {
      alert(`Error publishing post: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Share2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Universal Social Media Publisher</h2>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  mode === 'live-api' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                }`}>
                  {mode === 'live-api' ? 'Live Upload-Post API' : 'Zero-Friction Sandbox'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Publish or schedule to 12+ social networks simultaneously</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Target Platforms Picker */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Layers size={14} className="text-indigo-400" />
                Select Target Networks ({selectedPlatforms.length}/{platforms.length})
              </label>
              <button
                type="button"
                onClick={selectAllPlatforms}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {selectedPlatforms.length === platforms.length ? 'Deselect All' : 'Select All 12 Networks'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {platforms.map(p => {
                const isSelected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post Content & Media */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left: Content Editor */}
            <div className="md:col-span-2 space-y-4">
              
              {/* Title (for YouTube, LinkedIn, Reddit, Blog) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Post Headline / Video Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5 AI Breakthroughs You Missed This Week 🚀"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Main Caption */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-indigo-400" />
                    Caption & Hashtags
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiCaptions}
                    disabled={isGeneratingAi}
                    className="flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 font-semibold bg-pink-500/10 px-2.5 py-1 rounded-lg border border-pink-500/20 disabled:opacity-50 transition"
                  >
                    {isGeneratingAi ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    <span>AI Caption Assistant</span>
                  </button>
                </div>
                <textarea
                  rows={5}
                  placeholder="Write your cross-platform message here with emojis, links, and hashtags..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none custom-scrollbar"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span>Character count: {content.length}</span>
                  {selectedPlatforms.includes('x') && content.length > 280 && (
                    <span className="text-amber-400 font-medium">⚠️ Exceeds standard X (Twitter) 280-char limit</span>
                  )}
                </div>
              </div>

              {/* Media Type & URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Media Format
                  </label>
                  <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setMediaType('text')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                        mediaType === 'text' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Text Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('photo')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition ${
                        mediaType === 'photo' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <ImageIcon size={12} /> Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType('video')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition ${
                        mediaType === 'video' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <VideoIcon size={12} /> Video
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Media URL (Image or MP4)
                  </label>
                  <input
                    type="url"
                    placeholder="https://.../asset.jpg or .mp4"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Right: Scheduling & Preview */}
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Calendar size={13} className="text-indigo-400" />
                  Publishing Settings
                </h3>

                {/* Scheduling Date Input */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Schedule For Later (Leave empty for Now)
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                    <div className="text-[11px] font-bold text-slate-300">Publish Summary</div>
                    <div className="text-[11px] text-slate-400 flex justify-between">
                      <span>Targets:</span>
                      <span className="text-white font-medium">{selectedPlatforms.length} networks</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex justify-between">
                      <span>Format:</span>
                      <span className="capitalize text-white font-medium">{mediaType}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex justify-between">
                      <span>Dispatch:</span>
                      <span className="text-emerald-400 font-medium">
                        {scheduleDate ? 'Scheduled' : 'Instant (Now)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing || selectedPlatforms.length === 0 || (!content && !mediaUrl)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Broadcasting Content...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>
                        {scheduleDate 
                          ? `Schedule to ${selectedPlatforms.length} Networks` 
                          : `Publish to ${selectedPlatforms.length} Networks`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          {publishResults && (
            <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>Publish Broadcast Completed Successfully!</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {publishResults.map(r => (
                  <div key={r.platform} className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-semibold capitalize text-white">{r.platform}</span>
                    </div>
                    {r.postUrl && (
                      <a 
                        href={r.postUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                      >
                        <span>View Post</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
