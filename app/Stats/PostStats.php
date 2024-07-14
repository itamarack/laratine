<?php

namespace App\Stats;

use Spatie\Stats\BaseStats;

class PostStats extends BaseStats {

  public static function compose(): array
  {
    return PostStats::query()
      ->start(now()->today())
      ->end(now()->subSecond())
      ->groupByMonth()
      ->get()
      ->first()
      ->toArray();
  }
}
