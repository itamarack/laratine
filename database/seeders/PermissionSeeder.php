<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

    Permission::firstOrCreate(['name' => 'View Users']);
    Permission::firstOrCreate(['name' => 'Create Users']);
    Permission::firstOrCreate(['name' => 'Update Users']);
    Permission::firstOrCreate(['name' => 'Delete Users']);

    Permission::firstOrCreate(['name' => 'View Posts']);
    Permission::firstOrCreate(['name' => 'Create Posts']);
    Permission::firstOrCreate(['name' => 'Update Posts']);
    Permission::firstOrCreate(['name' => 'Delete Posts']);

    Permission::firstOrCreate(['name' => 'View Categories']);
    Permission::firstOrCreate(['name' => 'Create Categories']);
    Permission::firstOrCreate(['name' => 'Update Categories']);
    Permission::firstOrCreate(['name' => 'Delete Categories']);

    Permission::firstOrCreate(['name' => 'View Tags']);
    Permission::firstOrCreate(['name' => 'Create Tags']);
    Permission::firstOrCreate(['name' => 'Update Tags']);
    Permission::firstOrCreate(['name' => 'Delete Tags']);

    Permission::firstOrCreate(['name' => 'View Pages']);
    Permission::firstOrCreate(['name' => 'Create Pages']);
    Permission::firstOrCreate(['name' => 'Update Pages']);
    Permission::firstOrCreate(['name' => 'Delete Pages']);

    Permission::firstOrCreate(['name' => 'View Comments']);
    Permission::firstOrCreate(['name' => 'Create Comments']);
    Permission::firstOrCreate(['name' => 'Update Comments']);
    Permission::firstOrCreate(['name' => 'Delete Comments']);

    Permission::firstOrCreate(['name' => 'View Profiles']);
    Permission::firstOrCreate(['name' => 'Create Profiles']);
    Permission::firstOrCreate(['name' => 'Update Profiles']);
    Permission::firstOrCreate(['name' => 'Delete Profiles']);

    Permission::firstOrCreate(['name' => 'View Roles & Permissions']);
    Permission::firstOrCreate(['name' => 'Create Roles & Permissions']);
    Permission::firstOrCreate(['name' => 'Update Roles & Permissions']);
    Permission::firstOrCreate(['name' => 'Delete Roles & Permissions']);

    $role = Role::firstOrCreate(['name' => 'Administrator']);
    $role->givePermissionTo(Permission::all());
  }
}