<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    // Liste des feedbacks avec relations utilisateurs
    public function index()
    {
        $feedbacks = Feedback::with('user')->get();
        return response()->json($feedbacks);
    }

    // Affiche le formulaire de création
    public function create()
    {
        return view('feedback.create');
    }

    // Enregistrement de plusieurs feedbacks sans mass-assignement
    public function store(Request $request)
    {
        $validated = $request->validate([
            'feedbacks' => 'required|array',
            'feedbacks.*.contenu' => 'required|string',
            'feedbacks.*.rating' => 'required|numeric|min:1|max:5',
            'feedbacks.*.user_id' => 'required|exists:users,id'
        ]);

        $createdItems = [];

        foreach ($validated['feedbacks'] as $data) {
            $feedback = new Feedback();
            $feedback->user_id = $data['user_id'];
            $feedback->contenu = $data['contenu'];
            $feedback->rating = $data['rating'];
            // Le status est true (1) par défaut pour "en attente"
            $feedback->status = true;
            // Ajout de la date actuelle
            $feedback->date = now()->toDateString();
            $feedback->save();

            $feedback->load('user'); // Charger la relation utilisateur
            $createdItems[] = $feedback;
        }

        return response()->json($createdItems, 201);
    }

    // Affiche un feedback spécifique
    public function show($id)
    {
        $feedback = Feedback::with('user')->findOrFail($id);
        return view('feedback.show', compact('feedback'));
    }

    // Affiche le formulaire d'édition
    public function edit($id)
    {
        $feedback = Feedback::findOrFail($id);
        return view('feedback.edit', compact('feedback'));
    }

    // Mise à jour d'un feedback
    public function update(Request $request, $id)
    {
        $feedback = Feedback::findOrFail($id);

        $validated = $request->validate([
            'contenu' => 'required|string',
            'rating' => 'required|numeric|min:1|max:5'
        ]);

        $feedback->contenu = $validated['contenu'];
        $feedback->rating = $validated['rating'];
        // On ne modifie pas le status lors de la mise à jour via cette méthode
        $feedback->save();

        $feedback->load('user'); // Charger la relation utilisateur
        return response()->json($feedback);
    }

    // Suppression d'un feedback
    public function destroy($id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();
        return response()->json(null, 204);
    }
}
