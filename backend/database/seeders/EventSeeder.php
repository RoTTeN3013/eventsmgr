<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventSeeder extends Seeder
{
    public function run(): void
    {
       
        $locations = ['Budapest', 'Debrecen', 'Győr', 'Sopron', 'Pécs', 'Szeged'];
        $titles = [
            'Rock Fesztivál',
            'Jazz Est',
            'Tech Meetup',
            'Startup Konferencia',
            'Bor & Gasztro Napok',
            'Képregény Börze',
            'Filmvetítés a Parkban',
            'Művészeti Kiállítás',
            'Karácsonyi Vásár',
            'Gamer Expo'
        ];
        $prices = [5000, 10000, 20000, 30000, 2000, 1000, 2500, 6000, 8000];

        foreach ($titles as $title) {
            Event::create([
                'title' => $title,
                'short_description' => Str::limit("Ez egy rövid leírás a(z) {$title} eseményhez.", 64),
                'description' => "Ez a(z) {$title} esemény részletes leírása, ahol mindenki jól fogja érezni magát!",
                'organizer_id' => rand(1,3),
                'capacity' => rand(10, 100),
                'limit_per_person' => 5,
                'status' => 'published',
                'price' => $prices[array_rand($prices)],
                'start_at' => now()->addDays(rand(1, 60))->setTime(rand(10, 20), [0, 15, 30, 45][rand(0, 3)]),
                'email_requested' => (bool)rand(0, 1),
                'location' => $locations[array_rand($locations)],
            ]);
        }
        
    }
}

