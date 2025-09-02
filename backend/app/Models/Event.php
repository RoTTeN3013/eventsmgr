<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'short_description',
        'start_at',
        'status',
        'organizer_id',
        'location',
        'capacity',
        'price',
        'limit_per_person',
        'email_requested'
    ];

    //Organizer -> Esemény összekötése
    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    //Ticket -> Esemény összekötése
    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'event_id');
    }

    //Összes esemény lekérdezése
    public static function getAllEvents()
    {
        return self::with('organizer:id,name')->orderBy('created_at', 'DESC')->paginate(10);
    }

    //Publikus események
    public static function getPublishedEvents()
    {
        return self::where('status', 'published')->orderBy('created_at', 'DESC')->paginate(10);
    }

    //Esemény adatai
    public static function getEvent($id)
    {
        $event = self::with('tickets')->with('organizer:id,name')->find($id);
        if (!$event) {
            return null; 
        }

        $sold_tickets = $event->tickets->sum('quantity');
        $available = $event->capacity - $sold_tickets;
        $event->available_tickets = $available;

        return $event;
    }

    //Összes esemény lekérdezése kezdő dátumok szerint
    public static function getEventsByStartDate()
    {
        return self::orderBy('start_at', 'ASC')->get();
    }

    //Felhasználóhoz tartozó események lekérdezése
    public static function getUserEvents($user)
    {
        return self::where('organizer_id', $user)->get();
    }

    //Esemény létrehozása
    public static function createEvent($data, $organizer)
    {
        return self::create([
            'title' => $data['title'],
            'short_description' => $data['short_description'],
            'description' => $data['description'],
            'capacity' => $data['capacity'],
            'status' =>  $data['status'],
            'limit_per_person' => $data['limit_per_person'],
            'price' => $data['price'],
            'start_at' => $data['start_at'],
            'organizer_id' => $organizer,
            'location' => $data['location'],
            'email_requested' => $data['email_rquested'],
        ]);
    }

    //Esemény módosítása
    public static function updateEvent($data, $user_id, $event_id)
    {
        $event = self::find($event_id);

        if (!$event) {

            return 'Nem található esemény'; 
        }

        $event->title = $data['title'] ?? $event->title;
        $event->short_description = $data['short_description'] ?? $event->short_description;
        $event->description = $data['description'] ?? $event->description;
        $event->capacity = $data['capacity'] ?? $event->capacity;
        $event->status = $data['status'] ?? $event->status;
        $event->limit_per_person = $data['limit_per_person'] ?? $event->limit_per_person;
        $event->price = $data['price'] ?? $event->price;
        $event->start_at = $data['start_at'] ?? $event->start_at;
        $event->location = $data['location'] ?? $event->location;
        $event->email_requested = $data['email_requested'] ?? $event->email_requested;

        return $event->save();
    }
}
