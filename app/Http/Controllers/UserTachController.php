<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserTach;

class UserTachController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userTaches = UserTach::all();
        return response()->json($userTaches);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('user-taches.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'taches_id' => 'required|exists:taches,id',
            'user_id' => 'required|exists:users,id',
        ]);

        UserTach::create($validatedData);

        return redirect()->route('user-taches.index')->with('success', 'User task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $userTach = UserTach::findOrFail($id);
        return response()->json($userTach);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $userTach = UserTach::findOrFail($id);
        return view('user-taches.edit', compact('userTach'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'taches_id' => 'required|exists:taches,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $userTach = UserTach::findOrFail($id);
        $userTach->update($validatedData);

        return redirect()->route('user-taches.index')->with('success', 'User task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $userTach = UserTach::findOrFail($id);
        $userTach->delete();

        return redirect()->route('user-taches.index')->with('success', 'User task deleted successfully.');
    }
}
