<?php

namespace App\Stats;

use Spatie\Stats\BaseStats;

class VisitorStats extends BaseStats {

  public static function compose(): array
  {
    return VisitorStats::query()
      ->start(now()->subMonths(1))
      ->end(now()->subSecond())
      ->groupByWeek()
      ->get()
      ->toArray();
  }
}
