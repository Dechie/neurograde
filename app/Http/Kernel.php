<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{

    protected $middlewareAliases = [

        'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
    ];
}

