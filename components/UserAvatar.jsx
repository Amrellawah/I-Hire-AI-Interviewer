import React from 'react';

export default function UserAvatar({ profilePhoto, userImageUrl, name, size = 40, className = '' }) {
  let showInitials = false;
  let effectivePhoto = null;
  
  // Handle undefined, null, or empty profilePhoto
  if (profilePhoto && profilePhoto !== "" && profilePhoto !== "null" && profilePhoto !== "undefined") {
    effectivePhoto = profilePhoto;
    showInitials = false;
  } else {
    showInitials = true;
  }

  const getInitials = (name) => {
    if (!name || name === "null" || name === "undefined") return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const initials = getInitials(name);

  if (showInitials) {
    return (
      <div
        className={`flex items-center justify-center font-bold text-white bg-sky-300 select-none ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          fontSize: size / 2,
        }}
        title={name || 'User'}
      >
        {initials}
      </div>
    );
  }
  return (
    <img
      src={effectivePhoto}
      alt="Profile"
      className={`object-cover ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
      }}
      title={name || 'User'}
      onError={(e) => {
        // Fallback to initials if image fails to load
        e.target.style.display = 'none';
        e.target.nextSibling.style.display = 'flex';
      }}
    />
  );
} 