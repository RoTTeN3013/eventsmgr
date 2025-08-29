<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;


class EventController extends Controller
{
    public function getAllEvents(Request $request) {
        try{
            
            $builder = Event::with('organizer:id,name');

            if($request->filled('title')) {
                $builder->where('title', 'like', "%{$request->title}%");
            }
            
            if($request->filled('organizer')) {
                $builder->whereHas('organizer', function($q) use ($request) {
                    $q->where('name', 'like', "%{$request->organizer}%");
                });
            }

            if($request->filled('status')) {
                $builder->where('status', $request->status);
            }

            if($request->filled('start_date')) {
                $builder->where('start_at', $request->start_date);
            }

            if($request->filled('date_of_create')) {
                $builder->where('created_at', $request->date_of_create);
            }

            $events = $builder->orderBy('created_at', 'ASC')->get();

            return response()->json([
                'success' => true,
                'events' => $events,
            ]);

        }catch(\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba az események lekérdezése közben',
                //Log the error $e->getMessage();
            ]);
        }
    }

    public function getPublishedEvents() {
        try {
            $events = Event::getPublishedEvents();
            return response()->json([
                'success' => true,
                'events' => $events,
            ]);
        }catch(\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba az események lekérdezése közben',
                //Log the error $e->getMessage();
            ]);
        }
    }

    public function getEventDetails($id) {
        try {
            $event = Event::getEvent($id);
            return response()->json([
                'success' => true,
                'event' => $event,
            ]);
        }catch(\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba az esemény lekérdezése közben',
                //Log the error $e->getMessage();
            ]);
        }
    }
}
