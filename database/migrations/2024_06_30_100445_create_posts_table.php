<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('posts', function (Blueprint $table) {
      $table->id();

      $table->string('title')->unique();
      $table->string('slug')->unique();
      $table->string('excerpt');
      $table->string('author');
      $table->longText('content');
      $table->string('status');
      $table->string('featured_image')->nullable();
      $table->json('meta_tags')->nullable();
      $table->string('meta_description')->nullable();
      $table->string('layout_template')->nullable();
      $table->string('layout_width')->nullable();
      $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
      $table->foreignId('parent_id')->nullable()->constrained('posts')->cascadeOnDelete()->cascadeOnUpdate();

      $table->timestamps();
      $table->unique(['slug', 'parent_id']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('posts');
  }
};
