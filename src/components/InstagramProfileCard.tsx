import React, { useState } from 'react';
import { Link2, Instagram, User, Trash2 } from 'lucide-react';

export interface InstagramProfileData {
  username: string;
  fullName: string;
  externalUrl?: string;
  postsCount: number;
  followingCount: number;
  followersCount: number;
  profilePicUrl?: string;
  previewImageUrl?: string;
  indexLabel?: string;
  sourceKeyIndex?: number;
  verifiedDemo?: boolean;
  updatedAt?: string;
}

interface InstagramProfileCardProps {
  profile: InstagramProfileData;
  variant?: 'featured' | 'compact';
  onDelete?: (username: string) => void;
}

export const InstagramProfileCard: React.FC<InstagramProfileCardProps> = ({
  profile,
  variant = 'compact',
  onDelete,
}) => {
  const initialImg = profile.previewImageUrl || profile.profilePicUrl;

  const [imgSrc, setImgSrc] = useState<string | undefined>(initialImg);
  const [imgFailed, setImgFailed] = useState<boolean>(!initialImg);

  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(
    profile.profilePicUrl || profile.previewImageUrl
  );
  const [avatarFailed, setAvatarFailed] = useState<boolean>(
    !(profile.profilePicUrl || profile.previewImageUrl)
  );

  const instagramUrl = `https://www.instagram.com/${encodeURIComponent(profile.username)}/`;
  const externalLink = profile.externalUrl || instagramUrl;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('a[data-external-link="true"]') || target.closest('button')) {
      return;
    }
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  };

  const displayName = profile.fullName || profile.username;

  return (
    <div
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      title={`Open @${profile.username} on Instagram`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          window.open(instagramUrl, '_blank', 'noopener,noreferrer');
        }
      }}
      className="group relative w-full max-w-[440px] select-none cursor-pointer text-left transition-all duration-200 outline-none hover:-translate-y-0.5"
    >
      {/* Discord Embed Container (Exact Picture 1 styling) */}
      <div className="relative bg-[#2b2d31] hover:bg-[#313338] border border-[#1e1f22] group-hover:border-[#58a6ff]/50 rounded-[8px] p-2.5 sm:p-3.5 shadow-lg group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] text-[#dbdee1] flex gap-2.5 sm:gap-3 justify-between items-start transition-all">
        
        {/* Left Column: Author, Blue Title, Link, Stats, Instagram Badge */}
        <div className="flex-1 space-y-1.5 min-w-0 pr-0.5 sm:pr-1">
          
          {/* Author Row */}
          <div className="flex items-center gap-1.5">
            {!avatarFailed && avatarSrc ? (
              <img
                src={avatarSrc}
                alt={displayName}
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full object-cover shrink-0 bg-black"
                referrerPolicy="no-referrer"
                onError={() => {
                  setAvatarFailed(true);
                }}
              />
            ) : (
              <div className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shrink-0 text-white">
                <User className="w-2.5 h-2.5" />
              </div>
            )}
            <span className="text-[11px] sm:text-[12px] font-semibold text-[#f2f3f5] truncate group-hover:text-white transition-colors">
              {displayName}
            </span>
          </div>

          {/* Main Blue Header Link */}
          <div>
            <span className="text-[12px] sm:text-[14px] font-bold text-[#58a6ff] group-hover:text-[#79b8ff] group-hover:underline transition-colors block truncate leading-tight">
              {displayName} (@{profile.username})
            </span>
            <p className="text-[9px] sm:text-[10px] text-[#949ba4] font-medium mt-0.5">
              {profile.indexLabel || '1 of 1'}
            </p>
          </div>

          {/* External Link (Exact markdown layout: [url](url)) */}
          {externalLink && (
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#dbdee1] truncate leading-tight">
              <Link2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-[#949ba4]" />
              <a
                href={externalLink}
                data-external-link="true"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#dbdee1] hover:underline truncate block"
                title={externalLink}
              >
                <span className="text-[#dbdee1]">[</span>
                <span className="text-[#58a6ff]">{externalLink}</span>
                <span className="text-[#dbdee1]">]({externalLink})</span>
              </a>
            </div>
          )}

          {/* Stats Breakdown (Posts, Following, Followers) - Exact 3-column horizontal layout from Image 1 */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1 text-[10px] sm:text-[11px] max-w-[260px]">
            <div>
              <div className="font-bold text-[#f2f3f5]">Posts</div>
              <div className="text-[#dbdee1] font-medium mt-0.5 truncate">
                {(profile.postsCount ?? 0).toLocaleString()}
              </div>
            </div>

            <div>
              <div className="font-bold text-[#f2f3f5]">Following</div>
              <div className="text-[#dbdee1] font-medium mt-0.5 truncate">
                {(profile.followingCount ?? 0).toLocaleString()}
              </div>
            </div>

            <div>
              <div className="font-bold text-[#f2f3f5]">Followers</div>
              <div className="text-[#dbdee1] font-medium mt-0.5 truncate">
                {(profile.followersCount ?? 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Bottom Instagram Badge */}
          <div className="flex items-center gap-1 pt-1">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#f2f3f5] group-hover:text-pink-400 transition-colors">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                <Instagram className="w-2.5 h-2.5" />
              </div>
              <span>Instagram</span>
            </div>
          </div>
        </div>

        {/* Right Column: Thumbnail Image (Exact layout position from Image 1) */}
        <div className="w-20 h-20 sm:w-[102px] sm:h-[102px] rounded-[6px] overflow-hidden bg-[#1e1f22] shrink-0 shadow border border-white/5 self-start flex items-center justify-center relative">
          {!imgFailed && imgSrc ? (
            <img
              src={imgSrc}
              alt={displayName}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
              onError={() => {
                setImgFailed(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1e1f22] to-[#141517] p-1.5 sm:p-2 text-center text-zinc-500">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white mb-1 shadow-sm">
                <Instagram className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <span className="text-[9px] font-mono text-zinc-400 truncate w-full">
                @{profile.username}
              </span>
            </div>
          )}

          {/* Quick Remove Button (Accessible on touch & hover) */}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(profile.username);
              }}
              title={`Remove @${profile.username} from screen`}
              className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 p-1 sm:p-1 rounded-md bg-black/80 hover:bg-red-950 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-600 transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-md z-10"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
