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
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
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

  public function usersIndex (Request $request): Response
  {
    $users = User::whereNot('id', $request->user()->id);
    $paginate = $users->paginate($request->query('perPage'));
    $payload = $paginate->withQueryString();

    return Inertia::render('Account/Users/List', ['payload' => $payload]);
  }

  public function userCreate (Request $request): Response
  {
    return Inertia::render('Account/Users/Create', []);
  }

  public function userStore (UsersCreateRequest $request): Response
  {
    $request->user()->fill($request->validated());

    $user = User::create([
      'firstname' => $request->firstname,
      'lastname' => $request->lastname,
      'email' => $request->email,
      'avatar' => $request->avatar,
      'address' => $request->address,
      'city' => $request->city,
      'state' => $request->state,
      'postcode' => $request->postcode,
      'biography' => $request->biography,
      'password' => Hash::make($request->password),
    ]);

    event(new Registered($user));

    return Inertia::render('Account/Users/List', []);
  }

  public function userShow(User $user): Response
  {
    return Inertia::render('Account/Users/Edit', ['user' => $user]);
  }

  public function userUpdate(UsersUpdateRequest $request, User $user): RedirectResponse
  {
    $validated = $request->validated();

    if (blank($validated['password'])) unset($validated['password']);
    else $validated['password'] = Hash::make($validated['password']);

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
      return redirect()->route('users.index');

    } catch (\Exception $e) {
      Log::error('Error deleting user: ', ['exception' => $e]);
      return back()->withErrors(['message' => 'An error occurred while trying to delete the user.']);
    }
  }
}
