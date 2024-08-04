<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileRequest;
use App\Rules\ImageRule;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\FileUploadService;
use Illuminate\Routing\Controllers\Middleware;
use Spatie\Permission\Middleware\PermissionMiddleware;
use Spatie\Permission\Models\Role;

class ProfileController extends Controller implements HasMiddleware
{
  protected $uploadService;

  public function __construct(FileUploadService $uploadService)
  {
    $this->uploadService = $uploadService;
  }

  public static function middleware(): array
  {
    return [
      new Middleware(PermissionMiddleware::using('View Profiles'), only:['show', 'securityShow']),
      new Middleware(PermissionMiddleware::using('Update Profiles'), only:['update', 'securityUpdate']),
      new Middleware(PermissionMiddleware::using('Delete Profiles'), only:['destroy']),
    ];
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

    return redirect()->route('profile.show');
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

    return redirect()->route('login');
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
