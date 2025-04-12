<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function index()
    {
        $feedbacks = Feedback::with('user')->get();
        return view('feedback.index', compact('feedbacks'));
    }

    public function create()
    {
        return view('feedback.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'feedbacks.*.user_id' => 'required|exists:users,id',
            'feedbacks.*.contenu' => 'required|string',
            'feedbacks.*.rating' => 'required|numeric',
            'feedbacks.*.date' => 'required|date',
            'feedbacks.*.status' => 'required'
        ]);
    
        $createdItems = [];
        foreach ($validated['feedbacks'] as $data) {
            
            $createdItems[] = Feedback::create($data);
        }
    
        return response()->json($createdItems, 201);
    }
    
   
    public function show($id)
    {
        $feedback = Feedback::with('user')->findOrFail($id);
        return view('feedback.show', compact('feedback'));
    }

    public function edit($id)
    {
        $feedback = Feedback::findOrFail($id);
        return view('feedback.edit', compact('feedback'));
    }

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
            $item = Feedback::findOrFail($data['id']);
            
            $item->update($data);
            $updatedItems[] = $item;
        }
    
        return response()->json($updatedItems, 200);
    }


    public function destroy($id)
    {
        Feedback::findOrFail($id)->delete();
        return redirect()->route('feedback.index')->with('success', 'Feedback deleted successfully');
    }
}
