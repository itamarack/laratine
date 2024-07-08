<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CommentRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   */
  public function authorize(): bool
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
   */
  public function rules(): array
  {
    return [
      'content' => 'required|string|max:2000',
      'status' => 'required|string|max:256',
      'post_id' => 'required|exists:posts,id',
      'user_id' => 'required|exists:users,id',
      'parent_id' => 'nullable|exists:comments,id',
    ];
  }
}
