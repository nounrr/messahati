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
            'message' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        //$validated['user_id'] = auth()->id();
        foreach ($validated['feedback'] as $data){
            Feedback::create($validated);
        } 
        return redirect()->route('feedback.index')->with('success', 'Feedback submitted successfully');
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

    public function update(Request $request, $id)
    {
        $feedback = Feedback::findOrFail($id);
        $validated = $request->validate([
            'message' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);
        foreach ($validated['feedback'] as $data){
            $feedback->update($validated);
        } 
        return redirect()->route('feedback.index')->with('success', 'Feedback updated successfully');
    }

    public function destroy($id)
    {
        Feedback::findOrFail($id)->delete();
        return redirect()->route('feedback.index')->with('success', 'Feedback deleted successfully');
    }
}
