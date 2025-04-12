<?php

use App\Http\Controllers\CliniqueController;
use App\Http\Controllers\TypeTraitementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DepartementController;
use App\Http\Controllers\PartenaireController;
use App\Http\Controllers\TypePartenaireController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TraitementsController;
use App\Http\Controllers\OrdonanceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RendezVousController;
use App\Http\Controllers\MedicamentController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::resource('/departements', DepartementController::class);
Route::resource('/cliniques', CliniqueController::class);
Route::resource('/type-traitements', TypeTraitementController::class);
Route::resource('departements', DepartementController::class);
Route::resource('partenaires', PartenaireController::class);
Route::resource('type-partenaires', TypePartenaireController::class);
Route::resource('cliniques', CliniqueController::class);
Route::resource('services', ServiceController::class);
Route::resource('traitements', TraitementsController::class);
Route::resource('ordonances', OrdonanceController::class);
Route::resource('payments', PaymentController::class);
Route::resource('rendezvous', RendezVousController::class);
Route::resource('medicament', MedicamentController::class);