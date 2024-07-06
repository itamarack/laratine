<?php

namespace App\Services;

use Illuminate\Contracts\Database\Query\Builder;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\QueryBuilder;

class QueryBuilderService
{
  protected $search;
  protected $per_page;
  protected $query;
  protected $userId;

  public function __construct(Request $request)
  {
    $this->search = $request->query('search');
    $this->per_page = $request->query('per_page');
    $this->query = $request->query();
    $this->userId = $request->user()?->id;
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
    $conditions = $options['conditions'] ?? [];
    $eagerLoaders = $options['eagerLoaders'] ?? [];
    $searchIds = $model::search($this->search)->keys();

    $queryBuilder = QueryBuilder::for($model::class)
      ->allowedSorts($allowedSorts)
      ->when($this->search, fn($query) => $query->whereIn('id', $searchIds))
      ->when(filled($conditions), function (Builder $query) use ($conditions) {
        collect($conditions)->each(function ($condition) use ($query) {
          if (method_exists($query, $condition['method'])) {
            $query->{$condition['method']}(...$condition['parameters']);
          } else {
            throw new \InvalidArgumentException("Method {$condition['method']} not found.");
          }

        });
      });

      if (filled($eagerLoaders)) {
        collect($eagerLoaders)->each(function ($loader) use ($queryBuilder) {
          return $queryBuilder->with($loader);
        });
      }

      return $queryBuilder->paginate($this->per_page)
        ->appends($this->query);
  }
}
