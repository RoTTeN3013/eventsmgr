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
        'limit_per_person'
    ];

    //Organizer -> Esemény összekötése
    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    //Összes esemény lekérdezése
    public static function getEvents()
    {
        return self::orderBy('created_at', 'DESC')->get();
    }

    //Publikus események
    public static function getPublishedEvents()
    {
        return self::where('status', 'published')->orderBy('created_at', 'DESC')->get();
    }

    //Esemény adatai
    public static function getEvent($id)
    {
        return self::find($id);
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
}
