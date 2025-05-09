<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
use App\Notifications\NewMessageNotification;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:1000',
            'destinataire_id' => 'required|exists:users,id',
            'sender_id' => 'required|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        // Création du message
        $message = Message::create([
            'contenu' => $request->message,
            'destinataire_id' => $request->destinataire_id,
            'emetteure_id' => $request->sender_id,
            'status' => true,
            'date_envoie' => now()->toDateString(),
            'heure_envoie' => now()->toTimeString()
        ]);

        // Chargement de l'utilisateur
        $sender = User::find($request->sender_id);
        $message->load('emetteure');

        // Diffusion de l'événement
        broadcast(new MessageSent($message, $sender))->toOthers();

        // Envoi de la notification
        $receiver = User::find($request->destinataire_id);
        $receiver->notify(new NewMessageNotification($message));

        return response()->json([
            'status' => 'success',
            'message' => 'Message sent successfully'
        ]);
    }

    public function getMessages($userId)
    {
        $messages = Message::where('emetteure_id', $userId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'messages' => $messages
        ]);
    }

    public function getSentMessages($userId)
    {
        $messages = Message::where('emetteure_id', $userId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'messages' => $messages
        ]);
    }

    public function getReceivedMessages($userId)
    {
        $messages = Message::where('destinataire_id', $userId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'messages' => $messages
        ]);
    }
}
