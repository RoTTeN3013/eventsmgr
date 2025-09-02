<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
*/

Route::post('/log-client-error', function (Request $request) {
    Log::error('Client-side error', [
        'message' => $request->input('message'),
        'stack' => $request->input('stack'),
        'response' => $request->input('response'),
        'status' => $request->input('status'),
    ]);

    return response()->json(['status' => 'logged']);
});