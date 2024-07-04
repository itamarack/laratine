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
      Schema::create('post_tag', function (Blueprint $table) {
        $table->id();
        $table->foreignId('post_id')->constrained('posts')->onDelete('cascade');
        $table->foreignId('tag_id')->constrained('tags')->onDelete('cascade');
        $table->timestamps();

        $table->unique(['post_id', 'tag_id']);
      });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_tag');
    }
};
