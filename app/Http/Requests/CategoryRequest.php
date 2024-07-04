<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
      return [
        'title' => ['required', 'string', 'max:255', Rule::unique('categories')->ignore($this->category)],
        'slug' => ['required', 'string', 'max:255', Rule::unique('categories')->ignore($this->category)],
        'parent_id' => ['nullable', 'numeric', 'max:255'],
        'description' => ['nullable', 'string', 'max:2048'],
      ];
    }
}
