<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/roles', [RolePermissionController::class, 'roles']);
    Route::get('/permissions', [RolePermissionController::class, 'permissions']);

    Route::post('/assign-role', [RolePermissionController::class, 'assignRoleToUser']);
    Route::post('/assign-permission', [RolePermissionController::class, 'assignPermissionToUser']);
});