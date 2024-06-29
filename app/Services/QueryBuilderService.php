<?php

namespace App\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class QueryBuilderService
{
  protected $search;
  protected $per_page;
  protected $query;

  public function __construct(Request $request)
  {
    $this->search = $request->query('search');
    $this->per_page = $request->query('per_page');
    $this->query = $request->query();
  }

  /**
   *
   * @param Request $request
   * @param Model $model
   * @param array $options
   * @return LengthAwarePaginator
   */
  public function query(Model $model, ?array $options): LengthAwarePaginator
  {
    $allowedSorts = $options['allowedSorts'] ?? [];
    $search = $model::search($this->search);

    return QueryBuilder::for($model::class)
      ->allowedSorts($allowedSorts)
      ->when(filled($this->search), fn($query) => $search->constrain($query))
      ->paginate($this->per_page)
      ->appends($this->query);
  }
}
