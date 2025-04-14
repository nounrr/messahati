<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\ChatController;


Route::post('/chat/send', [ChatController::class, 'send'])->middleware('auth');

// Route::post('/send-data', [App\Http\Controllers\RealTimeController::class, 'sendData']);
