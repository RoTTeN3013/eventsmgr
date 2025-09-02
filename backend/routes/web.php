<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

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
Route::get('/api/get-all-events/{type}', [EventController::class, 'getAllEvents']);
Route::post('/api/create-event', [EventController::class, 'createEvent']);
Route::post('/api/update-event/{id}', [EventController::class, 'updateEvent']);
Route::get('/api/get-event-form-details', [EventController::class, 'getEventFormDetails']);

//Cart / Kosár
Route::get('/api/get-user-cart-items', [CartController::class, 'getUserCartItems']);
Route::post('/api/add-cart-item', [CartController::class, 'addCartItem']);
Route::post('/api/update-user-cart', [CartController::class, 'updateUserCart']);

//Tickets
Route::post('/api/buy-tickets', [TicketController::class, 'buyUserTickets']);
Route::get('/api/get-user-tickets', [TicketController::class, 'getUserTickets']);

