<?php

namespace Jxc\Provider;

use Illuminate\Support\ServiceProvider;

class JxcStockroomProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadMigrationsFrom(__DIR__.'/../Migration');
        $this->loadViewsFrom(__DIR__.'/../View', 'jxc');
        $this->loadRoutesFrom(__DIR__.'/../routes.php');
        $this->publishes([
            __DIR__.'/../View' => resource_path('views'),
        ]);
        $this->publishes([
            __DIR__.'/../Assets' => public_path('assets'),
        ]);
        $this->publishes([
            __DIR__.'/../Trait' => app_path('Traits'),
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
