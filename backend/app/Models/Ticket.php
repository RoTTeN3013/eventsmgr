<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'user_id',
        'event_id',
        'quantity',
    ];

    //Esemény -> Ticket összekötése
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public static function getUserTickets($user_id) {
        return self::with('event')->where('user_id', $user_id)->get();
    }

    public static function getUserTicketForEvent($user_id, $event_id) {
        return self::where('user_id', $user_id)->where('event_id', $event_id)->first();
    }
}
