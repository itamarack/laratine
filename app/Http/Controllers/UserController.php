<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Requests\Users\UsersCreateRequest;
use App\Http\Requests\Users\UsersUpdateRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
  /**
   * Display the user's profile form.
   */
  public function profileIndex(Request $request): Response
  {
    return Inertia::render('Account/Profile/Profile', [
      'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
      'status' => session('status'),
    ]);
  }

  /**
   * Update the user's profile information.
   */
  public function profileUpdate(ProfileUpdateRequest $request): RedirectResponse
  {
    $request->user()->fill($request->validated());

    if ($request->user()->isDirty('email')) {
      $request->user()->email_verified_at = null;
    }

    $request->user()->save();

    return Redirect::route('profile.index');
  }

  /**
   * Delete the user's account.
   */
  public function profileDestroy(Request $request): RedirectResponse
  {
    $request->validate([
      'password' => ['required', 'current_password'],
    ]);

    $user = $request->user();

    Auth::logout();

    $user->delete();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return Redirect::to('/');
  }

  public function userIndex (Request $request): Response
  {
    $allowedSorts = ['firstname', 'created_at', 'updated_at'];
    $search = User::search($request->query('search'));

    $users = QueryBuilder::for(User::class)
      ->allowedSorts($allowedSorts)
      ->whereNot('id', $request->user()->id)
      ->when($request->filled('search'), fn($query) => $search->constrain($query))
      ->paginate($request->query('per_page'))
      ->appends($request->query());

    return Inertia::render('Account/Users/List', ['users' => $users]);
  }

  public function userCreate (Request $request): Response
  {
    return Inertia::render('Account/Users/Create', []);
  }

  public function userStore (UsersCreateRequest $request): RedirectResponse
  {
    $request->validated();
    $user = User::create($request->all());

    event(new Registered($user));

    return redirect()->route('user.index');
  }

  public function userShow(User $user): Response
  {
    return Inertia::render('Account/Users/Edit', ['user' => $user]);
  }

  public function userUpdate(UsersUpdateRequest $request, User $user): RedirectResponse
  {
    $validated = $request->validated();
    $user->update($validated);

    return redirect()->route('user.update', ['user' => $user]);
  }

  public function userDestroy(Request $request, User $user)
  {
    if ($request->user()->is($user)) {
      return back()->withErrors(['message' => 'Action not permitted!']);
    }

    try {
      $user->delete();
      return redirect()->route('user.index');

    } catch (\Exception $e) {
      Log::error('Error deleting user: ', ['exception' => $e]);
      return back()->withErrors(['message' => 'An error occurred while trying to delete the user.']);
    }
  }
}
