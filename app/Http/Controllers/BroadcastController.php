<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BroadcastController extends Controller
{
    public function authenticate(Request $request)
    {
        // Directly return true without checking for user authentication
        return response()->json([
            'auth' => 'success'
        ]);
    }
}