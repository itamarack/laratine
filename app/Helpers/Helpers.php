<?php

if (!function_exists('getAvatarAssetUrl')) {
  /**
   * Get the asset URL for the user's avatar.
   *
   * @param \Illuminate\Contracts\Auth\Authenticatable|null $user The user instance (optional).
   * @return string|null The asset URL of the avatar, or null if no avatar is present.
   */
  function getAvatarAssetUrl(\Illuminate\Contracts\Auth\Authenticatable $user = null): ?string
  {
      try {
          $user = $user ?: request()->user();
          return optional($user)->avatar ? asset("storage/{$user->avatar}") : null;
      } catch (\Exception $e) {
          \Log::error('Error retrieving avatar URL: ' . $e->getMessage());
          return null;
      }
  }
}