import React, { useState } from 'react';
import { Link2, Instagram, User, ExternalLink } from 'lucide-react';
import kylePreviewImg from '../assets/images/kyle_ig_preview_1789985766479.jpg';

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
}

export const InstagramProfileCard: React.FC<InstagramProfileCardProps> = ({
  profile,
  variant = 'compact',
}) => {
  const isKyle =
    profile.username.toLowerCase() === 'exclusive.kyle777' ||
    profile.username.toLowerCase() === 'kyle';

  const defaultImg = isKyle ? kylePreviewImg : undefined;
  const initialImg = profile.previewImageUrl || profile.profilePicUrl || defaultImg;

  const [imgSrc, setImgSrc] = useState<string | undefined>(initialImg);
  const [imgFailed, setImgFailed] = useState<boolean>(!initialImg);

  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(
    profile.profilePicUrl || profile.previewImageUrl || defaultImg
  );
  const [avatarFailed, setAvatarFailed] = useState<boolean>(
    !(profile.profilePicUrl || profile.previewImageUrl || defaultImg)
  );

  const instagramUrl = `https://www.instagram.com/${encodeURIComponent(profile.username)}/`;
  const externalLink = profile.externalUrl || instagramUrl;

  const handleCardClick = (e: React.MouseEvent) => {
    // If user clicked directly on the external link anchor, allow that link
    const target = e.target as HTMLElement;
    if (target.closest('a[data-external-link="true"]')) {
      return;
    }
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  };

  const isFeatured = variant === 'featured';

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
      className={`group relative w-full ${
        isFeatured ? 'max-w-[430px]' : 'max-w-full'
      } mx-auto select-none cursor-pointer text-left transition-all duration-200 outline-none`}
    >
      {/* Discord Embed Container (Exact Picture 2 styling) */}
      <div className={`relative bg-[#2b2d31] hover:bg-[#313338] border border-[#1e1f22] group-hover:border-[#58a6ff]/50 rounded-xl ${
        isFeatured ? 'p-4 sm:p-4.5' : 'p-3 sm:p-3.5'
      } shadow-xl group-hover:shadow-[0_8px_25px_rgba(0,0,0,0.5)] text-[#dbdee1] flex gap-3 justify-between items-start transition-all`}>
        
        {/* Left Column: Author, Blue Title, Link, Stats, Instagram Badge */}
        <div className="flex-1 space-y-1.5 min-w-0">
          
          {/* Author Row */}
          <div className="flex items-center gap-1.5">
            {!avatarFailed && avatarSrc ? (
              <img
                src={avatarSrc}
                alt={profile.fullName || profile.username}
                className={`${isFeatured ? 'w-4.5 h-4.5' : 'w-4 h-4'} rounded-full object-cover shrink-0 bg-black`}
                referrerPolicy="no-referrer"
                onError={() => {
                  if (defaultImg && avatarSrc !== defaultImg) {
                    setAvatarSrc(defaultImg);
                  } else {
                    setAvatarFailed(true);
                  }
                }}
              />
            ) : (
              <div className={`${isFeatured ? 'w-4.5 h-4.5' : 'w-4 h-4'} rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shrink-0 text-white`}>
                <User className="w-2.5 h-2.5" />
              </div>
            )}
            <span className="text-[11px] font-semibold text-[#f2f3f5] truncate group-hover:text-white transition-colors">
              {profile.fullName || profile.username}
            </span>
          </div>

          {/* Main Blue Header Link */}
          <div>
            <span className={`${isFeatured ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'} font-bold text-[#58a6ff] group-hover:text-[#79b8ff] group-hover:underline transition-colors block truncate leading-tight flex items-center gap-1`}>
              <span>{profile.fullName || profile.username} (@{profile.username})</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </span>
            <p className="text-[10px] text-[#949ba4] font-medium mt-0.5">
              {profile.indexLabel || '1 of 1'}
            </p>
          </div>

          {/* External Link (e.g. Linktree or bio link) */}
          {externalLink && (
            <div className="flex items-start gap-1 text-[11px] text-[#dbdee1] break-all leading-tight">
              <Link2 className="w-3 h-3 shrink-0 mt-0.5 text-[#949ba4]" />
              <a
                href={externalLink}
                data-external-link="true"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#58a6ff] hover:underline truncate block max-w-[200px]"
                title={externalLink}
              >
                [{externalLink}]({externalLink})
              </a>
            </div>
          )}

          {/* Stats Breakdown (Posts, Following, Followers) */}
          <div className="space-y-1 pt-0.5 text-[11px]">
            <div>
              <div className="font-bold text-[#f2f3f5]">Posts</div>
              <div className="text-[#dbdee1] font-medium">
                {(profile.postsCount ?? 0).toLocaleString()}
              </div>
            </div>

            <div>
              <div className="font-bold text-[#f2f3f5]">Following</div>
              <div className="text-[#dbdee1] font-medium">
                {(profile.followingCount ?? 0).toLocaleString()}
              </div>
            </div>

            <div>
              <div className="font-bold text-[#f2f3f5]">Followers</div>
              <div className="text-[#dbdee1] font-medium">
                {(profile.followersCount ?? 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Bottom Instagram Badge */}
          <div className="flex items-center gap-1 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#f2f3f5] group-hover:text-pink-400 transition-colors">
              <div className="w-3.5 h-3.5 rounded-[3px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
                <Instagram className="w-2.5 h-2.5" />
              </div>
              <span>Instagram</span>
            </div>
          </div>
        </div>

        {/* Right Column: Thumbnail Image (Exact layout position) */}
        <div className={`${
          isFeatured ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-20 h-20 sm:w-22 sm:h-22'
        } rounded-lg overflow-hidden bg-[#1e1f22] shrink-0 shadow border border-white/5 self-start flex items-center justify-center relative`}>
          {!imgFailed && imgSrc ? (
            <img
              src={imgSrc}
              alt={profile.fullName || profile.username}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
              onError={() => {
                if (defaultImg && imgSrc !== defaultImg) {
                  setImgSrc(defaultImg);
                } else {
                  setImgFailed(true);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1e1f22] to-[#141517] p-2 text-center text-zinc-500">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white mb-1 shadow-sm">
                <Instagram className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] font-mono text-zinc-400 truncate w-full">
                @{profile.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
