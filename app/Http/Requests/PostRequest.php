<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\ImageRule;

class PostRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
      return [
        'title' => ['required', 'string', 'max:255'],
        'slug' => ['required', 'string', 'max:255'],
        'excerpt' => ['required', 'string', 'max:2048'],
        'content' => ['nullable', 'string'],
        'author' => ['required', 'string', 'max:255'],
        'category' => ['required', 'string', 'max:255'],
        'status' => ['required', 'string', 'max:255'],
        'featured_image' => ['nullable', new ImageRule(), 'max:2048'],
        'layout_template' => ['nullable', 'string', 'max:255'],
        'layout_width' => ['nullable', 'string', 'max:255'],
        'meta_description' => ['nullable', 'string', 'min:255'],
        'meta_tags' => ['nullable', 'array'],
      ];
    }
}
