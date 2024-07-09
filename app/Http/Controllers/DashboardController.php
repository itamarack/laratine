<?php

namespace App\Http\Controllers;

use App\Stats\UserStats;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
  public function __invoke(Request $request)
  {
    $userStats = UserStats::query()
      ->start(now()->subMonths(2))
      ->end(now()->subSecond())
      ->groupByWeek()
      ->get()
      ->toArray();

    return Inertia::render('Account/Dashboard/Dashboard', [
      'userStats' => $userStats
    ]);
  }
}
