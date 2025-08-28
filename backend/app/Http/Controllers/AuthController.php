<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function checkUserStatus() {
        //Login status ellenőrzése
        if(Auth::guard('web')->check()) {
            $user = Auth::user();
        }else {
            $user = null;
        }
        return response()->json([
            'user' => $user,
        ]);
    }

    public function logUserIn(Request $request) {
        
        $request->validate (
            [
            'email' => 'required|email',
            'password' => 'required',
            ],
            [
            'email.required' => 'Email megadása kötelező!',
            'email.email' => 'Nem valid email címet adtál meg!',
               
            'password.required' => 'Jelszó megadása kötelező!',     
            ]
        );

        $credentials = $request->only('email', 'password');

        //Autentikáció
        if(Auth::attempt($credentials)) { //Sikeres
            $request->session()->regenerate();
            $user = Auth::user();
            if($user->is_blocked) { // A felhasználó letiltva
                return response()->json([
                    'message' => 'A felhasználód jelenleg tiltás alatt áll!',
                    'success' => false
                ]);
            }
            return response()->json([
                'message' => 'Üdv újra itt: ' . $user->name,
                'user' => $user,
                'success' => true
            ]);
        }else { //Sikertelen
            return response()->json([
                'message' => 'Helytelen email vagy jelszó!',
                'success' => false
            ]);
        }
    }
}
