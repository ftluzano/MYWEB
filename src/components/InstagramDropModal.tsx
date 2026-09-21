import React, { useState, useEffect, useRef } from 'react';
import { Instagram, X, Loader2, ArrowRight, Sparkles, Users, ArrowLeft, RefreshCw, Search } from 'lucide-react';
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
  const [newlyDroppedHandle, setNewlyDroppedHandle] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const newlyDroppedRef = useRef<HTMLDivElement | null>(null);

  // Sync latest dropped profiles from server periodically so all users see each other's dropped accounts
  const fetchSharedProfiles = async (showSyncIndicator = false) => {
    if (showSyncIndicator) setSyncing(true);
    try {
      const res = await fetch('/api/saved-instagram');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        onProfilesUpdated(json.data);
      }
    } catch (err) {
      console.warn('Error fetching shared profiles:', err);
    } finally {
      if (showSyncIndicator) {
        setTimeout(() => setSyncing(false), 500);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    fetchSharedProfiles();

    // Poll every 3 seconds so multi-user drops appear in real-time across all screens
    const interval = setInterval(() => fetchSharedProfiles(false), 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

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

      if (json.success && json.data) {
        const droppedProfile: InstagramProfileData = json.data;
        const updatedList: InstagramProfileData[] =
          json.all || [
            droppedProfile,
            ...profiles.filter((p) => p.username.toLowerCase() !== droppedProfile.username.toLowerCase()),
          ];

        onProfilesUpdated(updatedList);
        setUsernameInput('');
        setNewlyDroppedHandle(droppedProfile.username.toLowerCase());
        setStatusMessage(json.message || `@${droppedProfile.username} popped onto the screen!`);

        // Play impact audio
        gothicAudio.playWarriorLinkSound();

        // Highlight for 5 seconds
        setTimeout(() => setNewlyDroppedHandle(null), 5000);
        setTimeout(() => setStatusMessage(null), 4000);

        // Smoothly bring new card into view
        setTimeout(() => {
          if (newlyDroppedRef.current) {
            newlyDroppedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      } else {
        // Resilient fallback save
        const cleanName = rawUser.replace(/^@/, '').replace(/[/?#].*$/, '').trim();
        const fallback: InstagramProfileData = {
          username: cleanName,
          fullName: cleanName,
          externalUrl: `https://instagram.com/${cleanName}`,
          postsCount: 0,
          followingCount: 0,
          followersCount: 0,
          profilePicUrl: '',
          previewImageUrl: '',
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
        const nextList =
          postJson.all || [
            fallback,
            ...profiles.filter((p) => p.username.toLowerCase() !== cleanName.toLowerCase()),
          ];
        onProfilesUpdated(nextList);
        setUsernameInput('');
        setNewlyDroppedHandle(cleanName.toLowerCase());
        setStatusMessage(postJson.message || `@${cleanName} dropped onto the screen!`);

        setTimeout(() => setNewlyDroppedHandle(null), 5000);
        setTimeout(() => setStatusMessage(null), 4000);
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
        profilePicUrl: '',
        previewImageUrl: '',
        indexLabel: '1 of 1',
        verifiedDemo: false,
        updatedAt: new Date().toISOString(),
      };
      const nextList = [
        localProfile,
        ...profiles.filter((p) => p.username.toLowerCase() !== cleanName.toLowerCase()),
      ];
      onProfilesUpdated(nextList);
      setUsernameInput('');
      setNewlyDroppedHandle(cleanName.toLowerCase());
      setStatusMessage(`@${cleanName} dropped onto the screen. Live scraper data is unavailable.`);

      setTimeout(() => setNewlyDroppedHandle(null), 5000);
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (targetUsername: string) => {
    try {
      const res = await fetch(`/api/saved-instagram/${encodeURIComponent(targetUsername)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        onProfilesUpdated(
          json.all || profiles.filter((p) => p.username.toLowerCase() !== targetUsername.toLowerCase())
        );
        setStatusMessage(`Removed @${targetUsername}`);
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.warn('Error deleting profile:', err);
      const remaining = profiles.filter(
        (p) => p.username.toLowerCase() !== targetUsername.toLowerCase()
      );
      onProfilesUpdated(remaining);
    }
  };

  // Filter profiles
  const filteredProfiles = profiles.filter((p) => {
    if (!filterQuery.trim()) return true;
    const query = filterQuery.toLowerCase().trim();
    return (
      p.username.toLowerCase().includes(query) ||
      (p.fullName && p.fullName.toLowerCase().includes(query))
    );
  });

  const count = profiles.length;

  return (
    <div
      id="instagram-second-page"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#07070b]/95 backdrop-blur-xl flex flex-col text-zinc-100 animate-fade-in"
    >
      {/* Background Ambient Glow & Sparks */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-red-600/15 via-red-950/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[250px] bg-red-900/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] bg-orange-900/10 blur-3xl" />
      </div>

      {/* Top Header Navigation Bar for 2nd Screen */}
      <header className="sticky top-0 z-30 w-full bg-[#0b0b12]/90 backdrop-blur-md border-b border-red-900/40 px-3 sm:px-6 py-2.5 sm:py-3 shrink-0 flex items-center justify-between pt-safe">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 min-h-[38px] rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-gothic tracking-wider text-zinc-200 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer group shrink-0"
            title="Return to 1st Page (Showcase)"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-red-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">BACK TO SHOWCASE</span>
            <span className="sm:hidden text-[11px]">BACK</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-xs sm:text-sm font-bold font-gothic tracking-wider text-white flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="truncate hidden xs:inline">COMMUNITY DROP SCREEN</span>
              <span className="truncate xs:hidden">DROPS</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-red-950/80 border border-red-700/70 text-[10px] sm:text-[11px] font-mono font-bold text-red-300 shadow-sm flex items-center gap-1 shrink-0">
              <Users className="w-3 h-3 text-red-400" />
              <span>{count}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => fetchSharedProfiles(true)}
            className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer active:scale-95"
            title="Sync shared drops"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-red-400' : ''}`} />
          </button>

          <button
            onClick={onClose}
            className="p-2 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer active:scale-95"
            title="Close 2nd Screen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main 2nd Screen Content Canvas */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col items-center">
        
        {/* Central DROP INSTAGRAM Controller Box (Exact layout from Picture 3) */}
        <div className="w-full max-w-lg mb-6 sm:mb-8 relative z-20">
          <div className="relative bg-[#11111a] border border-red-900/70 rounded-2xl p-3.5 sm:p-5 shadow-[0_0_40px_rgba(220,38,38,0.35)] text-zinc-200">
            {/* Atmospheric backlight */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-64 h-12 bg-red-600/20 blur-xl pointer-events-none" />

            {/* Header: (O) DROP INSTAGRAM with badge and count */}
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-zinc-800/80 mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-sm shrink-0">
                  <Instagram className="w-4 h-4" />
                </div>
                <h3 className="font-gothic text-sm sm:text-base font-bold text-white tracking-wide">
                  DROP INSTAGRAM
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-red-950/90 border border-red-700/80 text-[10px] font-mono font-bold text-red-300 shadow-sm flex items-center gap-1">
                  <Users className="w-2.5 h-2.5 text-red-400" />
                  <span>{count}</span>
                </span>
              </div>
            </div>

            {/* Input Bar & Drop Button */}
            <div className="space-y-2 relative z-10">
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
                    className="w-full pl-7 pr-3 py-2.5 min-h-[44px] bg-[#09090f] border border-zinc-800 focus:border-red-600 rounded-xl text-base sm:text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-all"
                  />
                </div>

                <button
                  onClick={() => handleDrop()}
                  disabled={loading || !usernameInput.trim()}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 hover:from-red-900 hover:to-red-800 border border-red-700/80 text-xs font-gothic font-bold tracking-wider text-white shadow-[0_0_18px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40 shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>DROP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Instant status feedback */}
              {statusMessage && (
                <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 animate-fade-in pl-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span className="truncate">{statusMessage}</span>
                </div>
              )}

              {/* Quick filter if there are >6 profiles */}
              {count > 6 && (
                <div className="relative pt-1">
                  <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Search dropped accounts..."
                    className="w-full pl-7 pr-3 py-2 min-h-[38px] bg-[#09090f]/90 border border-zinc-800/80 rounded-lg text-base sm:text-[11px] font-mono text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* The 2nd Screen Wall / Boxes Scattered Across Screen (Matches Picture 3) */}
        <div className="w-full">
          {filteredProfiles.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center text-zinc-500 space-y-2 px-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 mb-1">
                <Instagram className="w-6 h-6" />
              </div>
              <p className="text-sm text-zinc-400">
                {filterQuery ? 'No matching dropped accounts found.' : 'No Instagram boxes dropped yet.'}
              </p>
              <p className="text-xs text-zinc-600 max-w-sm">
                Enter your Instagram handle above and click DROP. Your Discord-style embed box will pop up on the screen and stay saved permanently!
              </p>
            </div>
          ) : (
            /* Multi-column screen-filling wall where boxes pop up all over the screen */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5 sm:gap-5 items-start justify-items-center w-full">
              {filteredProfiles.map((profile) => {
                const isNew = newlyDroppedHandle === profile.username.toLowerCase();

                return (
                  <div
                    key={`${profile.username}-${profile.updatedAt || '0'}`}
                    ref={isNew ? newlyDroppedRef : undefined}
                    className={`w-full max-w-[440px] transition-all duration-500 ${
                      isNew
                        ? 'ring-2 ring-red-500 rounded-[10px] shadow-[0_0_35px_rgba(239,68,68,0.7)] scale-[1.02] animate-pulse'
                        : ''
                    }`}
                  >
                    <InstagramProfileCard
                      profile={profile}
                      variant="compact"
                      onDelete={handleDeleteProfile}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
