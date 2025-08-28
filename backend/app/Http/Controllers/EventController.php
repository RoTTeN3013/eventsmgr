<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;


class EventController extends Controller
{
    public function getEvents() {
        $events = Event::getEvents();
        return response()->json([
            'events' => $events,
        ]);
    }

    public function getPublishedEvents() {
        $events = Event::getPublishedEvents();
        return response()->json([
            'events' => $events,
        ]);
    }

    public function getEventDetails($id) {
        $event = Event::getEvent($id);
        return response()->json([
            'event' => $event,
        ]);
    }
}
