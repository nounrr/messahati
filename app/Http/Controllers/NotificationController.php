<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

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
}
