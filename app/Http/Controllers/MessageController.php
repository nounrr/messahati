<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $messages = Message::all();
        return response()->json($messages);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('messages.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'messages.*.destinataire_id' => 'required|exists:destinataires,id',
        'messages.*.emetteure_id' => 'required|exists:emetteures,id',
        'messages.*.destinataire_id' => 'required|exists:destinataires,id',
        'messages.*.emetteure_id' => 'required|exists:emetteures,id',
        'messages.*.contenu' => 'required|string',
        'messages.*.date_envoie' => 'required|date',
        'messages.*.heure_envoie' => 'required',
        'messages.*.status' => 'required'
    ]);

    $createdItems = [];
    foreach ($validated['messages'] as $data) {
        
        $createdItems[] = Message::create($data);
    }

    return response()->json($createdItems, 201);
}



    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $message = Message::findOrFail($id);
        return response()->json($message);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $message = Message::findOrFail($id);
        return view('messages.edit', compact('message'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:messages,id',
            'updates.*.destinataire_id' => 'required|exists:destinataires,id',
            'updates.*.emetteure_id' => 'required|exists:emetteures,id',
            'updates.*.destinataire_id' => 'required|exists:destinataires,id',
            'updates.*.emetteure_id' => 'required|exists:emetteures,id',
            'updates.*.contenu' => 'required|string',
            'updates.*.date_envoie' => 'required|date',
            'updates.*.heure_envoie' => 'required',
            'updates.*.status' => 'required'
        ]);
    
        $updatedItems = [];
        foreach ($validated['updates'] as $data) {
            $item = Message::findOrFail($data['id']);
            
            $item->update($data);
            $updatedItems[] = $item;
        }
    
        return response()->json($updatedItems, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $message = Message::findOrFail($id);
        $message->delete();

        return redirect()->route('messages.index')->with('success', 'Message deleted successfully.');
    }
}
