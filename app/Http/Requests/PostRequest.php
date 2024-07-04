<?php

namespace App\Http\Requests;

use App\Models\Post;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
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
      // dd($this->route('post'));
      return [
        'title' => ['required', 'string', 'max:255', Rule::unique('posts')->ignore($this->post)],
        'slug' => ['required', 'string', 'max:255', Rule::unique('posts')->ignore($this->post)],
        'excerpt' => ['required', 'string', 'max:2048'],
        'content' => ['required', 'string'],
        'author' => ['required', 'string', 'max:255'],
        'category_id' => ['required', 'string', 'max:255'],
        'status' => ['required', 'string', 'max:255'],
        'featured_image' => ['nullable', new ImageRule(), 'max:2048'],
        'layout_template' => ['nullable', 'string', 'max:255'],
        'layout_width' => ['nullable', 'string', 'max:255'],
        'meta_description' => ['nullable', 'string', 'max:255'],
        'meta_tags' => ['nullable', 'array', 'max:255'],
      ];
    }
}
