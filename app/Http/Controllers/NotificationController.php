<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Récupérer toutes les notifications de l'utilisateur
     */
    public function index()
    {
        $notifications = Auth::user()->notifications()
            ->with(['users' => function ($query) {
                $query->select('users.id', 'notification_users.message');
            }])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->statut = true;
        $notification->save();
        return response()->json(['message' => 'Notification marquée comme lue']);
    }

    /**
     * Supprimer une notification
     */
    public function destroy($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->delete();
        return response()->json(['message' => 'Notification supprimée']);
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead()
    {
        Auth::user()->notifications()->update(['statut' => true]);
        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues']);
    }

    /**
     * Supprimer toutes les notifications
     */
    public function destroyAll()
    {
        Auth::user()->notifications()->delete();
        return response()->json(['message' => 'Toutes les notifications ont été supprimées']);
    }

    /**
     * Affiche le formulaire de création.
     */
    public function create()
    {
        return view('notifications.create');
    }

    /**
     * Enregistre une nouvelle notification (sans mass-assignement).
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'date' => 'required|date',
            'statut' => 'required|boolean',
            'type' => 'required|string',
            'data' => 'nullable|array',
            'user_id' => 'required|exists:users,id',
            'message' => 'required|string'
        ]);

        $notification = new Notification();
        $notification->date = $validatedData['date'];
        $notification->statut = $validatedData['statut'];
        $notification->type = $validatedData['type'];
        $notification->data = $validatedData['data'] ?? null;
        $notification->save();

        // Attacher la notification à l'utilisateur
        $notification->users()->attach($validatedData['user_id'], [
            'message' => $validatedData['message']
        ]);

        return response()->json([
            'message' => 'Notification créée avec succès',
            'notification' => $notification
        ], 201);
    }

    /**
     * Affiche une notification spécifique.
     */
    public function show($id)
    {
        $notification = Notification::with(['users' => function ($query) {
            $query->select('users.id', 'notification_users.message');
        }])->findOrFail($id);
        return response()->json($notification);
    }

    /**
     * Affiche le formulaire d'édition.
     */
    public function edit($id)
    {
        $notification = Notification::findOrFail($id);
        return view('notifications.edit', compact('notification'));
    }

    /**
     * Met à jour une notification (sans mass-assignement).
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'date' => 'required|date',
            'statut' => 'required|boolean',
        ]);

        $notification = Notification::findOrFail($id);
        $notification->date = $validatedData['date'];
        $notification->statut = $validatedData['statut'];
        $notification->save();

        return response()->json(['message' => 'Notification mise à jour avec succès']);
    }

    public function getReclamationNotifications($userId)
    {
        $notifications = Notification::where('type', 'reclamation')
            ->whereHas('users', function ($query) use ($userId) {
                $query->where('users.id', $userId);
            })
            ->with(['users' => function ($query) {
                $query->select('users.id', 'notification_users.message');
            }])
            ->get();

        return response()->json($notifications);
    }

    public function saveToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string'
        ]);

        $user = Auth::user();
        $user->notification_token = $request->token;
        $user->save();

        return response()->json(['message' => 'Token saved successfully']);
    }

    public function getNotifications()
    {
        $user = Auth::user();
        
        // Récupérer les notifications avec leurs messages
        $notifications = $user->notifications()
            ->join('notification_users', 'notifications.id', '=', 'notification_users.notification_id')
            ->select(
                'notifications.id',
                'notifications.type',
                'notifications.date',
                'notifications.statut',
                'notifications.created_at',
                'notification_users.message'
            )
            ->orderBy('notifications.created_at', 'desc')
            ->get();

        return response()->json($notifications);
    }
}
