import React, { useState, useEffect } from 'react';
import { Instagram, X, Loader2, ArrowRight, Sparkles, Users, ExternalLink } from 'lucide-react';
import { gothicAudio } from '../utils/audioEngine';
import { InstagramProfileCard, InstagramProfileData } from './InstagramProfileCard';

interface InstagramDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: InstagramProfileData[];
  onProfilesUpdated: (profiles: InstagramProfileData[]) => void;
}

export const InstagramDropModal: React.FC<InstagramDropModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onProfilesUpdated,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sync latest dropped profiles from server periodically while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const fetchSharedProfiles = async () => {
      try {
        const res = await fetch('/api/saved-instagram');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          onProfilesUpdated(json.data);
        }
      } catch (err) {
        console.warn('Error fetching shared profiles:', err);
      }
    };

    fetchSharedProfiles();

    // Poll every 4 seconds so multiple concurrent users see newly dropped profiles live
    const interval = setInterval(fetchSharedProfiles, 4000);
    return () => clearInterval(interval);
  }, [isOpen, onProfilesUpdated]);

  if (!isOpen) return null;

  const handleDrop = async (targetUsername?: string) => {
    const rawUser = (targetUsername || usernameInput).trim();
    if (!rawUser) return;

    gothicAudio.playWarriorLinkSound();
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/instagram-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: rawUser }),
      });

      const json = await res.json();

      if (json.success) {
        const updatedList: InstagramProfileData[] =
          json.all || (json.data ? [json.data, ...profiles.filter((p) => p.username.toLowerCase() !== json.data.username.toLowerCase())] : profiles);
        
        onProfilesUpdated(updatedList);
        setUsernameInput('');
        setStatusMessage(`@${json.data.username} dropped successfully!`);
        setTimeout(() => setStatusMessage(null), 3500);
      } else {
        // Fallback local save
        const cleanName = rawUser.replace(/^@/, '').replace(/[/?#].*$/, '').trim();
        const fallback: InstagramProfileData = {
          username: cleanName,
          fullName: cleanName,
          externalUrl: `https://instagram.com/${cleanName}`,
          postsCount: 0,
          followingCount: 0,
          followersCount: 0,
          indexLabel: '1 of 1',
          verifiedDemo: false,
          updatedAt: new Date().toISOString(),
        };

        const postRes = await fetch('/api/save-instagram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fallback),
        });
        const postJson = await postRes.json();
        const nextList = postJson.all || [fallback, ...profiles.filter((p) => p.username.toLowerCase() !== cleanName.toLowerCase())];
        onProfilesUpdated(nextList);
        setUsernameInput('');
        setStatusMessage(`@${cleanName} dropped!`);
        setTimeout(() => setStatusMessage(null), 3500);
      }
    } catch (err: any) {
      console.error('Drop error:', err);
      const cleanName = rawUser.replace(/^@/, '').replace(/[/?#].*$/, '').trim();
      const localProfile: InstagramProfileData = {
        username: cleanName,
        fullName: cleanName,
        externalUrl: `https://instagram.com/${cleanName}`,
        postsCount: 0,
        followingCount: 0,
        followersCount: 0,
        indexLabel: '1 of 1',
        verifiedDemo: false,
        updatedAt: new Date().toISOString(),
      };
      const nextList = [localProfile, ...profiles.filter((p) => p.username.toLowerCase() !== cleanName.toLowerCase())];
      onProfilesUpdated(nextList);
      setUsernameInput('');
      setStatusMessage(`@${cleanName} dropped!`);
      setTimeout(() => setStatusMessage(null), 3500);
    } finally {
      setLoading(false);
    }
  };

  // Filter profiles if user has searched
  const filteredProfiles = profiles.filter((p) => {
    if (!filterQuery.trim()) return true;
    const query = filterQuery.toLowerCase().trim();
    return (
      p.username.toLowerCase().includes(query) ||
      (p.fullName && p.fullName.toLowerCase().includes(query))
    );
  });

  const count = profiles.length;

  // Dynamic layout calculation based on dropped count:
  // - 0 profiles: clean empty state
  // - 1 profile: centered slightly big layout (featured, compact to page)
  // - 2 to 20 profiles: 2-column adaptive grid with compact cards
  // - > 20 profiles: compact grid with search
  const isSingle = count === 1;
  const isMedium = count >= 2 && count <= 20;

  const modalMaxWidth = count <= 1 ? 'max-w-lg' : 'max-w-3xl';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${modalMaxWidth} bg-[#111118] border border-red-900/60 rounded-3xl p-4 sm:p-6 shadow-[0_0_55px_rgba(220,38,38,0.3)] text-zinc-200 my-6 transition-all duration-300 max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Atmospheric Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-16 bg-gradient-to-b from-red-600/20 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800/80 mb-3.5 shrink-0 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 text-white shadow-sm">
              <Instagram className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-gothic text-base sm:text-lg font-bold text-white tracking-wide">
                  DROP INSTAGRAM
                </h3>
                {count > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-950/80 border border-red-700/60 text-[11px] font-mono font-bold text-red-300 shadow-sm flex items-center gap-1">
                    <Users className="w-3 h-3 text-red-400" />
                    <span>{count}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800 cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input & Drop Action Bar */}
        <div className="mb-3 shrink-0 relative z-10 space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">
                @
              </span>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDrop()}
                placeholder="enter instagram username..."
                autoFocus
                className="w-full pl-7 pr-3 py-2.5 bg-[#09090e] border border-zinc-800 focus:border-red-600 rounded-xl text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
              />
            </div>

            <button
              onClick={() => handleDrop()}
              disabled={loading || !usernameInput.trim()}
              className="px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-red-900 via-red-800 to-red-900 hover:from-red-800 hover:to-red-700 border border-red-700/80 text-xs font-gothic font-bold tracking-wider text-white shadow-[0_0_15px_rgba(220,38,38,0.35)] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40 shrink-0"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>DROP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Status feedback */}
          {statusMessage && (
            <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 animate-fade-in pl-1">
              <Sparkles className="w-3 h-3" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Quick filter for >6 dropped profiles */}
          {count > 6 && (
            <div className="pt-1">
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search dropped profiles..."
                className="w-full px-3 py-1.5 bg-[#09090e]/80 border border-zinc-800/80 rounded-lg text-[11px] font-mono text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
              />
            </div>
          )}
        </div>

        {/* Dropped Profiles Area: Compact to 2nd Page with Smooth Scroll */}
        <div className="flex-1 overflow-y-auto pr-1 relative z-10 custom-scrollbar max-h-[58vh]">
          {count === 0 ? (
            <div className="py-10 text-center flex flex-col items-center justify-center text-zinc-500 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                <Instagram className="w-5 h-5" />
              </div>
              <p className="text-xs text-zinc-400 max-w-xs">
                No Instagram profiles dropped yet. Enter your handle above to be the first!
              </p>
            </div>
          ) : isSingle ? (
            /* 1 User: Slightly big layout, centered and compact to page */
            <div className="py-2 flex flex-col items-center">
              <p className="text-[11px] text-zinc-400 mb-2 flex items-center gap-1">
                <span>Click profile to visit on Instagram</span>
                <ExternalLink className="w-3 h-3 text-[#58a6ff]" />
              </p>
              <InstagramProfileCard profile={filteredProfiles[0]} variant="featured" />
            </div>
          ) : isMedium ? (
            /* 2 to 20 Users: 2-column adaptive grid, slightly big & compact to the 2nd page */
            <div className="py-1 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
                <span>Click any profile to open on Instagram</span>
                <span className="font-mono text-zinc-500">{filteredProfiles.length} active</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProfiles.map((profile) => (
                  <InstagramProfileCard
                    key={`${profile.username}-${profile.updatedAt || '0'}`}
                    profile={profile}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          ) : (
            /* >20 Users: Responsive grid layout with compact cards */
            <div className="py-1 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
                <span>Click any profile to open on Instagram</span>
                <span className="font-mono text-zinc-500">{filteredProfiles.length} profiles</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredProfiles.map((profile) => (
                  <InstagramProfileCard
                    key={`${profile.username}-${profile.updatedAt || '0'}`}
                    profile={profile}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
