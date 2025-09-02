<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\Auth;


class EventController extends Controller
{
    public function getAllEvents($type, Request $request) {
        try{
            
            $builder = Event::with([
                'organizer:id,name', 
                'tickets:id,quantity' 
            ]);

            if($type === 'organizer') {
                $builder->where('organizer_id', Auth::id());
            }

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

            $events = $builder->orderBy('created_at', 'ASC')->paginate(15);

            //Elérhető jegyek számítása
            foreach($events as &$event) {
                $tickets = $event->tickets();
                if($tickets) {
                    $sold = $tickets->sum('quantity');
                    $event->available_tickets = $event->capacity - $sold;
                }
            }

            return response()->json([
                'success' => true,
                'events' => $events,
            ]);

        }catch(\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Hiba az események lekérdezése közben',
            ]);
        }
    }

    public function getPublishedEvents(Request $request) {
        try {

            $builder = Event::with([
                'organizer:id,name', 
                'tickets:id,quantity' 
            ]);

            if($request->filled('title')) {
                $builder->where('title', 'like', "%{$request->title}%");
            }
            
            if($request->filled('organizer')) {
                $builder->whereHas('organizer', function($q) use ($request) {
                    $q->where('name', 'like', "%{$request->organizer}%");
                });
            }

            if($request->filled('location')) {
                $builder->where('location', 'like', "%{$request->location}%");
            }

            if($request->filled('start_date')) {
                $builder->where('start_at', $request->start_date);
            }

            if($request->filled('minimum_price')) {
                $builder->where('price', '>=', $request->minimum_price);
            }

            if($request->filled('maximum_price')) {
                $builder->where('price', '<=', $request->maximum_price);
            }

            $events = $builder->where('status', 'published')->orderBy('created_at', 'ASC')->paginate(15);

            //Elérhető jegyek számítása
            foreach($events as &$event) {
                $tickets = $event->tickets();
                if($tickets) {
                    $sold = $tickets->sum('quantity');
                    $event->available_tickets = $event->capacity - $sold;
                }
            }
            
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

    public function createEvent(Request $request) {

        //Validáció
        $request->validate (
            [
            'title' => 'required|min:5|max:16',
            'short_description' => 'required|min:5|max:24',
            'description' => 'required|min:64|max:255',
            'capacity' => 'required|numeric',
            'limit_per_person' => 'required|numeric',
            'price' => 'required|numeric',
            'start_at' => 'required|after:today',
            ],
            [
            'title.required' => 'Esemény nevének (megnevezés) megadása kötelező!',
            'title.min' => 'Esemény neve minimum 5 karakterből kell, hogy álljon!',
            'title.max' => 'Esemény neve maximum 32 karakterből állhat!',
            
            'short_description.required' => 'Rövid leírás megadása kötelező!',
            'short_description.min' => 'Rövid leírás minimum 5 karakterből kell, hogy álljon!',
            'short_description.max' => 'Rövid leírás maximum 32 karakterből állhat!',
            
            'description.required' => 'Leírás megadása kötelező!',
            'description.min' => 'Leírás minimum 64 karakterből kell, hogy álljon!',
            'description.max' => 'Leírás maximum 255 karakterből állhat!',

            'capacity.required' => 'Kapacitás megadása kötelező!',
            'capacity.numeric' => 'Kapacitás csakis szám(ok)ból állhat!',
              
            'limit_per_person.required' => 'Személyenkénti limit megadása kötelező!',
            'limit_per_person.numeric' => 'Személyenkénti limit csakis szám(ok)ból állhat!',
            
            'price.required' => 'Ár limit megadása kötelező!',
            'price.numeric' => 'Az ár csakis szám(ok)ból állhat!',
               
            'start_at.required' => 'Kezdés dátum és idő megadása kötelező!',  
            'start_at.after' => 'Hibás dátum (kezdés dátuma csakis a jövőben lehet)',     
            ]
        );

        try {
            Event::createEvent($request, Auth::user()->id);
            return response()->json([
                'success' => true,
                'message' => 'Esemény sikeresen létrehozva',
            ]);
        }catch(\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                //Log the error $e->getMessage();
            ]);
        }
    }

    public function updateEvent(Request $request, $event_id = 0) {

        //Validáció
        $request->validate (
            [
            'title' => 'required|min:5|max:16',
            'short_description' => 'required|min:5|max:24',
            'description' => 'required|min:64|max:255',
            'capacity' => 'required|numeric',
            'limit_per_person' => 'required|numeric',
            'price' => 'required|numeric',
            'start_at' => 'required',
            ],
            [
            'title.required' => 'Esemény nevének (megnevezés) megadása kötelező!',
            'title.min' => 'Esemény neve minimum 5 karakterből kell, hogy álljon!',
            'title.max' => 'Esemény neve maximum 32 karakterből állhat!',
            
            'short_description.required' => 'Rövid leírás megadása kötelező!',
            'short_description.min' => 'Rövid leírás minimum 5 karakterből kell, hogy álljon!',
            'short_description.max' => 'Rövid leírás maximum 32 karakterből állhat!',
            
            'description.required' => 'Leírás megadása kötelező!',
            'description.min' => 'Leírás minimum 64 karakterből kell, hogy álljon!',
            'description.max' => 'Leírás maximum 255 karakterből állhat!',

            'capacity.required' => 'Kapacitás megadása kötelező!',
            'capacity.numeric' => 'Kapacitás csakis szám(ok)ból állhat!',
              
            'limit_per_person.required' => 'Személyenkénti limit megadása kötelező!',
            'limit_per_person.numeric' => 'Személyenkénti limit csakis szám(ok)ból állhat!',
            
            'price.required' => 'Ár limit megadása kötelező!',
            'price.numeric' => 'Az ár csakis szám(ok)ból állhat!',
               
            'start_at.required' => 'Kezdés dátum és idő megadása kötelező!',     
            ]
        );

        try {
            Event::updateEvent($request, Auth::user()->id, $event_id);
            return response()->json([
                'success' => true,
                'message' => 'Esemény sikeresen létrehozva',
            ]);
        }catch(\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                //Log the error $e->getMessage();
            ]);
        }
    }

    public function getEventFormDetails(Request $request) {
        try {
            $event = Event::find($request->id);
            return response()->json([
                'success' => true,
                'event' => $event,
            ]);
        }catch(\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                //Log the error $e->getMessage();
            ]);
        }
    }
}
