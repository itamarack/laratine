<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
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
    } else if (blank($user->avatar)) {
      optional($user->getFirstMedia('avatars'))->delete();
    }
  }

  /**
   * Handle Media upload and deletion.
   *
   * @param Request $request
   * @return void
   */
  public function uploadMedia(Request $request, Model $model): void
  {
    if ($request->hasFile('featured_image')) {
      $model->addMediaFromRequest('featured_image')->toMediaCollection('featured_image');
    } else if (empty($request->query('featured_image'))) {
      optional($model->getFirstMedia('featured_image'))->delete();
    }
  }
}
