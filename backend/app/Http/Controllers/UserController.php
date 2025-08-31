<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function getAllUsers(Request $request) {
        
        try{
            $builder = User::orderBy('id', 'ASC');
        
            if($request->filled('username')) {
                $builder->where('name', 'like', "%{$request->username}%");
            }

            if($request->filled('status')) {
                $builder->where('is_blocked', $request->status);
            }
            
            $users = $builder->paginate(15);
            
            return response()->json([
                'success' => true,
                'users' => $users,
            ]);
        }catch(\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba a felhasználók lekérdezése közben',
                //Logolni $e->getMessage();
            ]);
        }
    }

    public function setUserBlockedStatus(Request $request) {
        try{
            $id = $request->user_id;
            $status = User::setBlockedStatus($id);
            return response()->json([
                'success' => true,
                'status' => $status
            ]);
        }catch(\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba a felhasználó státuszának állítása közben',
                //Logolni $e->getMessage();
            ]);
        }
    }
}
