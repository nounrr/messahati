<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\MessageSent;
use App\Models\User;
use App\Notifications\NewMessageNotification;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;  
use Illuminate\Support\Facades\Log;
use Exception;

class ChatController extends Controller
{
    public function send(Request $request)
    {
        try {
            // ✅ Validation
            $validator = Validator::make($request->all(), [
                'message' => 'required|string|max:255',
                'destinataire_id' => 'required|exists:users,id'
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            if (!auth()->check()) {
                return response()->json(['error' => 'Utilisateur non authentifié'], 401);
            }

            // 🧠 Préparation du message
            $message = [
                'emetteur_id' => auth()->id(),
                'user_name' => auth()->user()->name ?? 'Anonymous',
                'destinataire_id' => $request->destinataire_id,
                'content' => $request->message,
                'timestamp' => now()->toDateTimeString(),
            ];

            Log::info('Message envoyé', ['message' => $message]);
            
            // 📡 Diffusion de l'événement avec Pusher
            broadcast(new MessageSent($message, auth()->user()->id))->toOthers();

            // Envoi de la notification
            $receiver = User::find($request->destinataire_id);
            if ($receiver) {
                $receiver->notify(new NewMessageNotification($message));
            }

            return response()->json([
                'status' => true,
                'message' => 'Message envoyé avec succès',
                'data' => $message,
            ]);

        } catch (Exception $e) {
            Log::error('Erreur lors de l\'envoi du message', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Erreur lors de l\'envoi du message',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
