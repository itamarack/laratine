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
    Schema::create('categories', function (Blueprint $table) {
      $table->id();
      $table->string('title')->unique();
      $table->string('slug')->unique();
      $table->longText('description')->nullable();
      $table->foreignId('parent_id')->nullable()->constrained('categories')->cascadeOnDelete()->cascadeOnUpdate();

      $table->timestamps();
      $table->unique(['slug', 'parent_id']);
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('categories');
  }
};
