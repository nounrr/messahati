<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;  
use Illuminate\Support\Facades\Log;
class ChatController extends Controller
{
    public function send(Request $request)
    {
        // ✅ Validation simple
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // 🧠 Préparation du message (tu peux aussi l’enregistrer dans la DB si tu veux)
        $message = [
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name ?? 'Anonymous',
            'receiver_id' => $request->destinataire_id,
            'content' => $request->message,
            'timestamp' => now()->toDateTimeString(),
        ];
        // Chargement de l'utilisateur pour l'événement (si tu veux son nom)
        $message->load('user');
        // 📡 Diffusion de l’événement avec Pusher
        broadcast(new MessageSent([
            'id' => $message->id,
            'user_id' => $message->user_id,
            'user_name' => $message->user->name ?? 'Anonymous',
            'content' => $message->content,
            'timestamp' => $message->created_at->toDateTimeString(),
        ]))->toOthers();
        $receiver = User::find($request->destinataire_id); 
        $receiver->notify(new NewMessageNotification($message));
        // ✅ Réponse
        return response()->json([
            'status' => true,
            'message' => 'Message sent successfully.',
            'data' => $message,
        ]);
    }
}
