<?php

namespace App\Stats;

use Spatie\Stats\BaseStats;

class UserStats extends BaseStats {

  public static function compose(): array
  {
    return UserStats::query()
      ->start(now()->today())
      ->end(now()->subSecond())
      ->groupByMonth()
      ->get()
      ->first()
      ->toArray();
  }
}
