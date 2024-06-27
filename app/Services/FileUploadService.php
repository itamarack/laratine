<?php

namespace App\Services;

use App\Models\User;
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
  public function uploadAvatar(Request $request, User $user): void
  {
    if ($request->hasFile('avatar')) {
      $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');
    } else if (empty($request->query('avatar'))) {
      optional($user->getFirstMedia('avatars'))->delete();
    }
  }
}
