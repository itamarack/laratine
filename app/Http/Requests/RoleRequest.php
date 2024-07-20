<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
      return [
        'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($this->role)],
        'description' => ['nullable', 'string', 'max:2048'],
      ];
    }
}
