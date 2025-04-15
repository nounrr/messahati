<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TypeCertificatMedicalController;
use App\Http\Controllers\TypeMutuelController;
use App\Http\Controllers\FactureController;

Route::get('/', function () {
    return view('app');
});

// Routes pour TypeCertificatMedical
Route::resource('type-certificat-medical', TypeCertificatMedicalController::class);

// Routes pour TypeMutuel
Route::resource('type-mutuel', TypeMutuelController::class);

// Route pour générer le PDF
Route::get('/facture/{id}', [FactureController::class, 'generatePDF'])->name('facture.generate');
