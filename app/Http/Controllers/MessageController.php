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
        $validatedData = $request->validate([
            'destinataire_id' => 'required|exists:users,id',
            'emetteure_id' => 'required|exists:users,id',
            'contenu' => 'required|string',
            'date_envoie' => 'required|date',
            'heure_envoie' => 'required|date_format:H:i:s',
            'status' => 'required|boolean',
        ]);

        Message::create($validatedData);

        return redirect()->route('messages.index')->with('success', 'Message created successfully.');
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
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'destinataire_id' => 'required|exists:users,id',
            'emetteure_id' => 'required|exists:users,id',
            'contenu' => 'required|string',
            'date_envoie' => 'required|date',
            'heure_envoie' => 'required|date_format:H:i:s',
            'status' => 'required|boolean',
        ]);

        $message = Message::findOrFail($id);
        $message->update($validatedData);

        return redirect()->route('messages.index')->with('success', 'Message updated successfully.');
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
