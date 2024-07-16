<?php

namespace App\Http\Controllers;

use App\Models\Category;
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
    $stats['categories'] = Category::withCount('posts')->get()->toArray();

    return Inertia::render('Account/Dashboard/Dashboard', [
      'stats' => $stats,
    ]);
  }
}
