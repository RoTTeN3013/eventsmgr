<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/get-user-data', function () {
    return auth()->check() ? auth()->user() : null; 
});
