<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Auth;

Route::get('/api/get-user-data', function () {
    return response()->json(['user' => Auth::user()]);
})->middleware('auth');

Route::post('/api/log-user-in', [AuthController::class, 'logUserIn']);
Route::get('/api/get-event-list', [EventController::class, 'getEvents']);