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
use App\Models\Notification;
use App\Services\PusherService;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    protected $pusherService;

    public function __construct(PusherService $pusherService)
    {
        $this->pusherService = $pusherService;
    }

    public function send(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'message' => 'required|string|max:1000',
                'destinataire_id' => 'required|exists:users,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Vérifier si l'utilisateur destinataire existe
            $destinataire = User::find($request->destinataire_id);
            if (!$destinataire) {
                return response()->json([
                    'status' => false,
                    'message' => 'Destinataire non trouvé'
                ], 404);
            }

            // Utiliser l'utilisateur authentifié comme expéditeur
            $sender = Auth::user();

            // Création du message
            $message = Message::create([
                'contenu' => $request->message,
                'destinataire_id' => $request->destinataire_id,
                'emetteure_id' => $sender->id,
                'status' => true,
                'date_envoie' => now()->toDateString(),
                'heure_envoie' => now()->toTimeString()
            ]);

            $message->load('emetteure');

            // Création de la notification
            $notification = Notification::create([
                'date' => now()->toDateString(),
                'statut' => false,
                'type' => 'message'
            ]);

            // Association de la notification à l'utilisateur
            $notification->users()->attach($request->destinataire_id, [
                'message' => "Nouveau message de {$sender->name}: {$request->message}"
            ]);

            // Envoi de la notification via Pusher
            $this->pusherService->sendToUser(
                $request->destinataire_id,
                'new-message',
                [
                    'message' => $message,
                    'sender' => $sender,
                    'notification' => $notification
                ]
            );

            // Diffusion de l'événement
            broadcast(new MessageSent($message, $sender))->toOthers();

            return response()->json([
                'status' => 'success',
                'message' => 'Message sent successfully',
                'data' => [
                    'message' => $message,
                    'notification' => $notification
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi du message: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de l\'envoi du message',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // public function getMessages($userId)
    // {
    //     $messages = Message::where('emetteure_id', $userId)
    //         ->orderBy('created_at', 'asc')
    //         ->get();

    //     return response()->json([
    //         'status' => 'success',
    //         'messages' => $messages
    //     ]);
    // }

    public function getSentMessages()
    {
        $messages = Message::where('emetteure_id', Auth::id())
            ->with(['destinataire', 'emetteure'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'messages' => $messages
        ]);
    }

    public function getReceivedMessages()
    {
        $messages = Message::where('destinataire_id', Auth::id())
            ->with(['destinataire', 'emetteure'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'messages' => $messages
        ]);
    }

    public function getConversation($userId)
    {
        $messages = Message::where(function($query) use ($userId) {
            $query->where('emetteure_id', Auth::id())
                  ->where('destinataire_id', $userId);
        })->orWhere(function($query) use ($userId) {
            $query->where('emetteure_id', $userId)
                  ->where('destinataire_id', Auth::id());
        })
        ->with(['destinataire', 'emetteure'])
        ->orderBy('created_at', 'asc')
        ->get();

        return response()->json([
            'status' => 'success',
            'messages' => $messages
        ]);
    }

    public function markAsRead($messageId)
    {
        $message = Message::where('destinataire_id', Auth::id())
            ->findOrFail($messageId);
            
        $message->status = true;
        $message->save();

        // Mettre à jour la notification associée
        $notification = Notification::whereHas('users', function($query) {
            $query->where('users.id', Auth::id());
        })->where('type', 'message')->latest()->first();

        if ($notification) {
            $notification->statut = true;
            $notification->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Message marked as read'
        ]);
    }
}
