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
            'feedbacks.*.titre' => 'required|string',
            'feedbacks.*.contenu' => 'required|string',
            'feedbacks.*.note' => 'required|numeric|min:1|max:5',
            'feedbacks.*.statut' => 'required|string|in:en_attente,traite,ignore'
        ]);

        $createdItems = [];

        foreach ($validated['feedbacks'] as $data) {
            $feedback = new Feedback();
            $feedback->user_id = Auth::id(); // Utiliser l'utilisateur connecté
            $feedback->titre = $data['titre'];
            $feedback->contenu = $data['contenu'];
            $feedback->note = $data['note'];
            $feedback->statut = $data['statut'];
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
            'titre' => 'required|string',
            'contenu' => 'required|string',
            'note' => 'required|numeric|min:1|max:5',
            'statut' => 'required|string|in:en_attente,traite,ignore'
        ]);

        $feedback->titre = $validated['titre'];
        $feedback->contenu = $validated['contenu'];
        $feedback->note = $validated['note'];
        $feedback->statut = $validated['statut'];
        // On ne modifie pas le user_id lors de la mise à jour
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
