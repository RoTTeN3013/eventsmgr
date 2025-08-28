<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;

//Auth
Route::get('/api/get-user-data', function () {
    return response()->json(['user' => Auth::user()]);
})->middleware('auth');

Route::post('/api/log-user-in', [AuthController::class, 'logUserIn']);
Route::post('/api/log-user-out', [AuthController::class, 'logUserOut']);

//User
Route::get('/api/get-all-users', [UserController::class, 'getAllUsers']);
Route::post('/api/set-user-blocked-status', [UserController::class, 'setUserBlockedStatus']);

//Event
Route::get('/api/get-event-list', [EventController::class, 'getPublishedEvents']);
Route::get('/api/get-event-details/{id}', [EventController::class, 'getEventDetails']);
