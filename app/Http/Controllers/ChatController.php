<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;



class ChatController extends Controller
{
    public function send(Request $request)
    {
        $message = $request->input('message');
        $user = auth()->user()->name;
        broadcast(new MessageSent($message, $user));
        return response()->json(['message' => 'Message envoyé!']);
    }
}

