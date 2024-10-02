<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Stats\CommentStats;
use App\Stats\PageLikeStat;
use App\Stats\PostStats;
use App\Stats\UserStats;
use App\Stats\VisitorStats;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
  public function __invoke(Request $request)
  {
    $stats['user'] = UserStats::compose();
    $stats['post'] = PostStats::compose();
    $stats['likes'] = PageLikeStat::compose();
    $stats['comments'] = CommentStats::compose();
    $stats['visitors'] = VisitorStats::compose();

    $category_count = Category::withCount('posts')->get()->toArray();
    $recent_posts = Post::with('user')->orderBy('created_at', 'desc')->take(5)->get();
    $recent_comments = Comment::with('user')->orderBy('created_at', 'desc')->take(5)->get();

    return Inertia::render('Account/Dashboard/Dashboard', [
      'stats' => $stats,
      'recent_posts' => $recent_posts,
      'category_count' => $category_count,
      'recent_comments' => $recent_comments
    ]);
  }
}