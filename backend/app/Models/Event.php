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
        'capacity'
    ];

    //Organizer -> Esemény összekötése
    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    //Összes esemény lekérdezése
    static function getEvents()
    {
        return self::orderBy('created_at', 'DESC')->get();
    }

    //Összes esemény lekérdezése kezdő dátumok szerint
    static function getEventsByStartDate()
    {
        return self::orderBy('start_at', 'ASC')->get();
    }

    //Felhasználóhoz tartozó események lekérdezése
    static function getUserEvents($user)
    {
        return self::where('organizer_id', $user)->get();
    }
}
