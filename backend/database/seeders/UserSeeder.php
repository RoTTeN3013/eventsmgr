<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'password' => Hash::make('Admin1'),
            'is_blocked' => false
        ]);

        User::create([
            'name' => 'Organizer',
            'email' => 'organizer@example.com',
            'role' => 'organizer',
            'password' => Hash::make('Admin1'),
            'is_blocked' => false
        ]);

        User::create([
            'name' => 'User',
            'email' => 'user@example.com',
            'role' => 'user',
            'password' => Hash::make('Admin1'),
            'is_blocked' => false
        ]);
    }
}
