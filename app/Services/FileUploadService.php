<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
  /**
   * Handle avatar upload and deletion.
   *
   * @param Request $request
   * @return string $avatar_path
   */
  public function uploadAvatar(Request $request, ?string $prevAvatar): ?string
  {
    if ($request->hasFile('avatar')) {
      Storage::disk('public')->delete($prevAvatar ?? '');
      return $request->file('avatar')->store('avatars', 'public');
    }

    if (empty($request->query('avatar'))) {
      Storage::disk('public')->delete($prevAvatar ?? '');
      return null;
    }

    return $prevAvatar;
  }
}
