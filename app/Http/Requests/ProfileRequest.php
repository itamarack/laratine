<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use App\Rules\ImageRule;

class ProfileRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Prepare the data for validation.
   */
  protected function prepareForValidation(): void
  {
    if ($this->isMethod('patch') || $this->isMethod('put')) {
      $data = $this->all();
      if (empty($data['password'])) unset($data['password']);
      $this->replace($data);
    }
  }


  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
   */
  public function rules(): array
  {
    return [
      'firstname' => ['required', 'string', 'max:255'],
      'role' => ['required', 'string', 'max:255'],
      'lastname' => ['required', 'string', 'max:255'],
      'avatar' => ['nullable', new ImageRule(), 'max:2048'],
      'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
      'address' => ['required', 'string', 'max:255'],
      'city' => ['required', 'string', 'max:255'],
      'state' => ['required', 'string', 'max:255'],
      'postcode' => ['required', 'string', 'max:255'],
      'biography' => ['string', 'nullable'],
      'password' => [Rules\Password::defaults(), 'nullable', 'confirmed', Rule::RequiredIf(empty($this->user()->id))],
    ];
  }
}
