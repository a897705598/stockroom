<?php

namespace Ares\Provider;

use Illuminate\Support\ServiceProvider;

class AresStockroomProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadMigrationsFrom(__DIR__.'/../Migration');
        $this->loadRoutesFrom(__DIR__.'/../routes.php');
        $this->publishes([
            __DIR__.'/../View' => resource_path('views/ares/basic'),
        ]);
        $this->publishes([
            __DIR__.'/../Assets' => public_path('assets'),
        ]);
        $this->publishes([
            __DIR__.'/../Trait' => app_path('Traits'),
        ]);
        $this->publishes([
            __DIR__.'/../Controller' => app_path('Http/Controllers/Ares')
        ]);
        $this->publishes([
            __DIR__.'/../Model' => app_path('Model/Ares')
        ]);
        $this->publishes([
            __DIR__.'/../Exception' => app_path('Exceptions')
        ]);
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
