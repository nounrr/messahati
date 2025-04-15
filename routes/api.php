<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

use App\Http\Controllers\ChatController;
use App\Http\Controllers\RendezVousController;


Route::post('/chat/send', [ChatController::class, 'send'])->middleware('auth');

// Route::post('/send-data', [App\Http\Controllers\RealTimeController::class, 'sendData']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/rendez-vous', [RendezVousController::class, 'store']);
    Route::get('/rendez-vous', [RendezVousController::class, 'index']);
    Route::get('/rendez-vous/{id}', [RendezVousController::class, 'show']);
    Route::put('/rendez-vous/{id}', [RendezVousController::class, 'update']);
    Route::delete('/rendez-vous/{id}', [RendezVousController::class, 'destroy']);
});
