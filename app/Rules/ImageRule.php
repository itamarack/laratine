<?php

namespace App\Rules;

use Closure;
use Illuminate\Http\UploadedFile;
use Illuminate\Contracts\Validation\ValidationRule;

class ImageRule implements ValidationRule
{
  protected $allowedExtensions = ['jpeg', 'png', 'gif', 'jpg'];

  /**
   * Run the validation rule.
   */
  public function validate(string $attribute, mixed $value, Closure $fail): void
  {
    if ($value instanceof UploadedFile) {
      if (!$this->passesFile($value)) {
        $fail('The :attribute must be an image file (JPEG, PNG, GIF, JPG).');
      }
    } else if (is_string($value) && filter_var($value, FILTER_VALIDATE_URL)) {
      if (!$this->passesUrl($value)) {
        $fail('The :attribute must be a valid URL pointing to an image.');
      }
    } else {
      $fail('The :attribute must be either an image file or a valid URL pointing to an image.');
    }
  }

  protected function passesFile(UploadedFile $file)
  {
    $extension = strtolower($file->getClientOriginalExtension());
    return in_array($extension, $this->allowedExtensions);
  }

  protected function passesUrl($url)
  {
    $url = parse_url($url);
    if (isset($url['path'])) {
      $extension = pathinfo($url['path'], PATHINFO_EXTENSION);
      return in_array(strtolower($extension), $this->allowedExtensions);
    }
    return false;
  }
}
