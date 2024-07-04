<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TagRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
      return [
        'title' => ['required', 'string', 'max:255', Rule::unique('tags')->ignore($this->tag)],
        'slug' => ['required', 'string', 'max:255', Rule::unique('tags')->ignore($this->tag)],
        'description' => ['nullable', 'string', 'max:2048'],
      ];
    }
}
