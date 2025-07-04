"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function ClientUserProfileSync() {
  const { user, isLoaded } = useUser();
  useEffect(() => {
    if (isLoaded && user) {
      fetch(`/api/user-profile?userId=${user.id}`)
        .then(res => {
          if (res.status === 404) {
            // Profile doesn't exist, create it
            fetch('/api/user-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id,
                email: user.emailAddresses?.[0]?.emailAddress || '',
                name: user.fullName || '',
                profilePhoto: user.imageUrl || '',
                isProfileComplete: false
              })
            });
          }
        });
    }
  }, [isLoaded, user]);
  return null;
} 