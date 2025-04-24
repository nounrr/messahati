<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use App\Models\NotificationUser;
use Illuminate\Support\Facades\Auth;



class NotificationController extends Controller
{
    /**
     * Affiche toutes les notifications.
     */
    public function index()
    {
        $notifications = Notification::all();
        return response()->json($notifications);
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
        ]);

        $notification = new Notification();
        $notification->date = $validatedData['date'];
        $notification->statut = $validatedData['statut'];
        $notification->save();

        return redirect()->route('notifications.index')->with('success', 'Notification créée avec succès.');
    }

    /**
     * Affiche une notification spécifique.
     */
    public function show($id)
    {
        $notification = Notification::findOrFail($id);
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

        return redirect()->route('notifications.index')->with('success', 'Notification mise à jour avec succès.');
    }

    /**
     * Supprime une notification.
     */
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();

        return redirect()->route('notifications.index')->with('success', 'Notification supprimée avec succès.');
    }

    public function getUserNotifications($userId)
    {
        // Vérifier que l'utilisateur connecté est bien celui qui fait la requête
      

        // Récupérer les notifications de l'utilisateur avec leurs messages
        $notifications = NotificationUser::with(['notification', 'user'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notificationUser) {
                return [
                    'id' => $notificationUser->notification->id,
                    'message' => $notificationUser->message,
                    'type' => $notificationUser->notification->type,
                    'statut' => $notificationUser->statut,
                    'created_at' => $notificationUser->created_at,
                    'user' => [
                        'id' => $notificationUser->user->id,
                        'name' => $notificationUser->user->name,
                        'email' => $notificationUser->user->email
                    ]
                ];
            });

        return response()->json($notifications);
    }

    public function markAsRead($notificationId)
    {
        
        
        $notificationUser = NotificationUser::where('notification_id', $notificationId)
            ->where('user_id', $userId)
            ->first();

        if (!$notificationUser) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $notificationUser->statut = true;
        $notificationUser->save();

        return response()->json([
            'id' => $notificationId,
            'statut' => true
        ]);
    }

    public function delete($notificationId)
    {
        $userId = Auth::id();
        
        $notificationUser = NotificationUser::where('notification_id', $notificationId)
            ->where('user_id', $userId)
            ->first();

        if (!$notificationUser) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $notificationUser->delete();

        return response()->json([
            'id' => $notificationId,
            'message' => 'Notification deleted successfully'
        ]);
    }
}