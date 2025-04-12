<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{
    /**
     * Affiche tous les messages.
     */
    public function index()
    {
        $messages = Message::all();
        return response()->json($messages);
    }

    /**
     * Affiche le formulaire de création.
     */
    public function create()
    {
        return view('messages.create');
    }

    /**
     * Enregistre plusieurs messages.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'messages' => 'required|array',
            'messages.*.destinataire_id' => 'required|exists:destinataires,id',
            'messages.*.emetteure_id' => 'required|exists:emetteures,id',
            'messages.*.contenu' => 'required|string',
            'messages.*.date_envoie' => 'required|date',
            'messages.*.heure_envoie' => 'required',
            'messages.*.status' => 'required'
        ]);

        $createdItems = [];

        foreach ($validated['messages'] as $data) {
            $message = new Message();
            $message->destinataire_id = $data['destinataire_id'];
            $message->emetteure_id = $data['emetteure_id'];
            $message->contenu = $data['contenu'];
            $message->date_envoie = $data['date_envoie'];
            $message->heure_envoie = $data['heure_envoie'];
            $message->status = $data['status'];
            $message->save();

            $createdItems[] = $message;
        }

        return response()->json($createdItems, 201);
    }

    /**
     * Affiche un message spécifique.
     */
    public function show($id)
    {
        $message = Message::findOrFail($id);
        return response()->json($message);
    }

    /**
     * Affiche le formulaire d'édition.
     */
    public function edit($id)
    {
        $message = Message::findOrFail($id);
        return view('messages.edit', compact('message'));
    }

    /**
     * Met à jour plusieurs messages.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:messages,id',
            'updates.*.destinataire_id' => 'required|exists:destinataires,id',
            'updates.*.emetteure_id' => 'required|exists:emetteures,id',
            'updates.*.contenu' => 'required|string',
            'updates.*.date_envoie' => 'required|date',
            'updates.*.heure_envoie' => 'required',
            'updates.*.status' => 'required'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $message = Message::findOrFail($data['id']);
            $message->destinataire_id = $data['destinataire_id'];
            $message->emetteure_id = $data['emetteure_id'];
            $message->contenu = $data['contenu'];
            $message->date_envoie = $data['date_envoie'];
            $message->heure_envoie = $data['heure_envoie'];
            $message->status = $data['status'];
            $message->save();

            $updatedItems[] = $message;
        }

        return response()->json($updatedItems, 200);
    }

    /**
     * Supprime un message.
     */
    public function destroy($id)
    {
        $message = Message::findOrFail($id);
        $message->delete();

        return redirect()->route('messages.index')->with('success', 'Message supprimé avec succès.');
    }
}
