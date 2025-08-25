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
}
