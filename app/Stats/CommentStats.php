<?php

namespace App\Stats;

use Spatie\Stats\BaseStats;

class CommentStats extends BaseStats {

  public static function compose(): array
  {
    return CommentStats::query()
      ->start(now()->today())
      ->end(now()->subSecond())
      ->groupByMonth()
      ->get()
      ->first()
      ->toArray();
  }
}
