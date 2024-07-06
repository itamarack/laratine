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
    Schema::create('pages', function (Blueprint $table) {
      $table->id();

      $table->string('title')->unique();
      $table->string('slug')->unique();
      $table->string('excerpt');
      $table->longText('content');
      $table->string('status');
      $table->string('featured_image')->nullable();
      $table->json('meta_tags')->nullable();
      $table->string('meta_description')->nullable();
      $table->string('layout_template')->nullable();
      $table->string('layout_width')->nullable();
      $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
      $table->foreignId('parent_id')->nullable()->constrained('pages')->cascadeOnDelete()->cascadeOnUpdate();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('pages');
  }
};
