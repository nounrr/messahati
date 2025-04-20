<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Afficher une liste des documents.
     */
    public function index()
    {
        $documents = Document::all();
        return response()->json($documents);
    }

    /**
     * Créer un nouveau document.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:analyse,radio',
            'description' => 'required|string',
            'traitement_id' => 'required|exists:traitements,id',
            'file' => 'required|file|mimes:pdf|max:2048', // Validation pour le fichier PDF
        ]);

        // Enregistrer le fichier PDF
        $filePath = $request->file('file')->store('documents', 'public');
        $validated['file_path'] = $filePath;

        $document = Document::create($validated);
        return response()->json($document, 201);
    }

    /**
     * Afficher un document spécifique.
     */
    public function show($id)
    {
        $document = Document::findOrFail($id);
        return response()->json($document);
    }

    /**
     * Mettre à jour un document existant.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'type' => 'sometimes|string|in:analyse,radio',
            'description' => 'sometimes|string',
            'traitement_id' => 'sometimes|exists:traitements,id',
            'file' => 'sometimes|file|mimes:pdf|max:2048', // Validation pour le fichier PDF
        ]);

        $document = Document::findOrFail($id);

        // Si un nouveau fichier est téléchargé, remplacer l'ancien
        if ($request->hasFile('file')) {
            // Supprimer l'ancien fichier
            if ($document->file_path) {
                Storage::disk('public')->delete($document->file_path);
            }

            // Enregistrer le nouveau fichier
            $filePath = $request->file('file')->store('documents', 'public');
            $validated['file_path'] = $filePath;
        }

        $document->update($validated);
        return response()->json($document);
    }

    /**
     * Supprimer un document.
     */
    public function destroy($id)
    {
        $document = Document::findOrFail($id);

        // Supprimer le fichier associé
        if ($document->file_path) {
            Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();
        return response()->json(['message' => 'Document supprimé avec succès.']);
    }
}
