<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'users.*.name' => 'required|string',
            'users.*.cin' => 'required|string|unique:users,cin',
            'users.*.email' => 'nullable|email', // devient facultatif
            'users.*.email_verified_at' => 'nullable|date',
            'users.*.password' => 'required|string|min:8|confirmed',
            'users.*.role' => 'required|string',
            'users.*.telephone' => 'required|string',
            'users.*.photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'users.*.adresse' => 'required|string',
            'users.*.departement_id' => 'required|exists:departements,id',
        ]);
    
        $createdUsers = [];
    
        foreach ($validated['users'] as $data) {
            // Définir l'email selon le rôle
            if (strtolower($data['role']) === 'patient') {
                $email = $data['email']; // l'utilisateur doit le fournir
            } else {
                $email = strtolower($data['cin']) . '@gmail.com'; // auto-généré
            }
    
            // Gestion de la photo s'il y en a une
            if (isset($data['photo'])) {
                $filename = time() . '_' . $data['photo']->getClientOriginalName();
                $data['photo']->storeAs('public/images', $filename);
                $data['photo'] = $filename;
            }
    
            $user = User::create([
                'name' => $data['name'],
                'cin' => $data['cin'],
                'email' => $email,
                'email_verified_at' => $data['email_verified_at'] ?? null,
                'password' => Hash::make($data['password']),
                'role' => $data['role'],
                'telephone' => $data['telephone'],
                'photo' => $data['photo'] ?? null,
                'adresse' => $data['adresse'],
                'departement_id' => $data['departement_id'],
            ]);
    
            event(new Registered($user));
            $createdUsers[] = $user;
        }
    
        return redirect()->back()->with('success', 'Utilisateurs enregistrés avec succès.');
    }
}
