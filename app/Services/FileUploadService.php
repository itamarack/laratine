<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;

class FileUploadService
{
  /**
   * Handle avatar upload and deletion.
   *
   * @param Request $request
   * @return void
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
