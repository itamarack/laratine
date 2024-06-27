<?php 

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AvatarRule implements Rule
{
  protected $allowedExtensions = ['jpeg', 'png', 'gif', 'jpg'];

  public function passes($attribute, $value)
  {
    if ($value instanceof UploadedFile) {
      return $this->passesFile($value);
    } elseif (is_string($value) && filter_var($value, FILTER_VALIDATE_URL)) {
      return $this->passesUrl($value);
    }
    return false;
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

  public function message()
  {
    return 'The :attribute must be either an image file (JPEG, PNG, GIF, JPG) or a valid URL pointing to an image.';
  }
}

