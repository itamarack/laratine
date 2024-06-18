<?php

namespace App\Http\Requests\Users;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;


class UsersUpdateRequest extends FormRequest
{
  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
   */
  public function rules(): array
  {
    return [
      'firstname' => ['required', 'string', 'max:255'],
      'lastname' => ['required', 'string', 'max:255'],
      'avatar' => ['nullable', 'regex:/^data:image\/(jpeg|png|gif|jpg);base64,/'],
      'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->route('user')->id)],
      'address' => ['required', 'string', 'max:255'],
      'city' => ['required', 'string', 'max:255'],
      'state' => ['required', 'string', 'max:255'],
      'postcode' => ['required', 'string', 'max:255'],
      'biography' => ['string', 'nullable'],
      'password' => [Rules\Password::defaults(), 'nullable', 'confirmed'],
    ];
  }
}
