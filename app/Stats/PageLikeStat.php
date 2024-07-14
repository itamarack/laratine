<?php

namespace App\Stats;

use Spatie\Stats\BaseStats;

class PageLikeStat extends BaseStats {

  public static function compose(): array
  {
    return PageLikeStat::query()
      ->start(now()->today())
      ->end(now()->subSecond())
      ->groupByMonth()
      ->get()
      ->first()
      ->toArray();
  }
}
