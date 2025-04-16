<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use App\Models\User;

class FeedbackController extends Controller
{
    // Liste des feedbacks avec relations utilisateurs
    public function index()
    {
        $feedbacks = Feedback::with('user')->get();
        return view('feedback.index', compact('feedbacks'));
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
            'feedbacks.*.user_id' => 'required|exists:users,id',
            'feedbacks.*.contenu' => 'required|string',
            'feedbacks.*.rating' => 'required|numeric',
            'feedbacks.*.date' => 'required|date',
            'feedbacks.*.status' => 'required'
        ]);

        $createdItems = [];

        foreach ($validated['feedbacks'] as $data) {
            $feedback = new Feedback();
            $feedback->user_id = $data['user_id'];
            $feedback->contenu = $data['contenu'];
            $feedback->rating = $data['rating'];
            $feedback->date = $data['date'];
            $feedback->status = $data['status'];
            $feedback->save();

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

    // Mise à jour de plusieurs feedbacks sans mass-assignement
    public function update(Request $request)
    {
        $validated = $request->validate([
            'updates' => 'required|array',
            'updates.*.id' => 'required|exists:feedbacks,id',
            'updates.*.user_id' => 'required|exists:users,id',
            'updates.*.contenu' => 'required|string',
            'updates.*.rating' => 'required|numeric',
            'updates.*.date' => 'required|date',
            'updates.*.status' => 'required'
        ]);

        $updatedItems = [];

        foreach ($validated['updates'] as $data) {
            $feedback = Feedback::findOrFail($data['id']);
            $feedback->user_id = $data['user_id'];
            $feedback->contenu = $data['contenu'];
            $feedback->rating = $data['rating'];
            $feedback->date = $data['date'];
            $feedback->status = $data['status'];
            $feedback->save();

            $updatedItems[] = $feedback;
        }

        return response()->json($updatedItems, 200);
    }

    // Suppression d’un feedback
    public function destroy($id)
    {
        Feedback::findOrFail($id)->delete();
        return redirect()->route('feedback.index')->with('success', 'Feedback supprimé avec succès');
    }
}
