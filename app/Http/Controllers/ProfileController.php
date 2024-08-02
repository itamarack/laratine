<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\FileUploadService;
use App\Services\QueryBuilderService;
use Spatie\Permission\Models\Role;

class ProfileController extends Controller
{
  protected $uploadService;
  protected $builderService;

  public function __construct(FileUploadService $uploadService, QueryBuilderService $builderService)
  {
    $this->uploadService = $uploadService;
    $this->builderService = $builderService;
  }

  /**
   * Display the user's profile form.
   *
   * @param Request $request
   * @return Response
   */
  public function show(Request $request): Response
  {
    return Inertia::render('Account/Profile/Profile', [
      'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
      'status' => session('status'),
      'roles' => Role::all()->pluck('name')
    ]);
  }

  /**
   * Update the user's profile information.
   *
   * @param ProfileRequest $request
   * @return RedirectResponse
   */
  public function update(ProfileRequest $request): RedirectResponse
  {
    $request->user()->fill($request->validated());

    if ($request->user()->isDirty('email')) {
      $request->user()->email_verified_at = null;
    }

    $this->uploadService->uploadAvatar($request, $request->user());
    $request->user()->save();
    $request->user()->syncRoles($request->role);

    return Redirect::route('profile.show');
  }

  /**
   * Delete the user's account.
   *
   * @param Request $request
   * @return RedirectResponse
   */
  public function destroy(Request $request): RedirectResponse
  {
    $request->validate([
      'password' => ['required', 'current_password'],
    ]);

    Auth::logout();
    $request->user()->delete();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return Redirect::to('/');
  }

  /**
   * Display the user's profile form.
   *
   * @param Request $request
   * @return Response
   */
  public function securityShow(Request $request): Response
  {
    return Inertia::render('Account/Profile/AccountSecurity', [
      'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
      'status' => session('status'),
      'roles' => Role::all()->pluck('name')
    ]);
  }
}
