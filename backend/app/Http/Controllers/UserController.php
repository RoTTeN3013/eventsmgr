<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function getAllUsers() {
        $users = User::getAllUsers();
        return response()->json([
            'users' => $users,
        ]);
    }

    public function setUserBlockedStatus(Request $request) {
        $id = $request->user_id;
        $status = User::setBlockedStatus($id);
        return response()->json([
            'success' => true,
            'status' => $status
        ]);
    }
}
