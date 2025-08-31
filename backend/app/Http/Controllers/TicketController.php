<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Event;
use App\Models\CartItems;
use App\Models\Ticket;

class TicketController extends Controller
{
    public function buyUserTickets() {
        $user = Auth::id();

        $items = CartItems::with('event:id,title,price,capacity,limit_per_person')->where('user_id', $user)->get();

        foreach($items as $item) {
            $event = $item->event;
            $sold_tickets = $event->tickets()->sum('quantity');
            $user_ticket = Ticket::getUserTicketForEvent($user, $event->id);

            //Esemlny státusz ellenőrzés (A biztonság kedvéért)
            if($$event->status === 'cancelled') {
                return response()->json([
                    'success' => false,
                    'message' => $event->title . ': Az esemény törölve lett!',
                ]);
            }

            //Mennyiség ellenőrzése
            if($item->quantity + $sold_tickets > $event->capacity) {
                $available = $event->capacity - $sold_tickets;
                return response()->json([
                    'success' => false,
                    'message' => $event->title . ': Nincs ennyi elérhető jegy az eseményre! Elérhető még: ' . $available,
                ]);
            }

            if($item->quantity > $event->limit_per_person) {
                return response()->json([
                    'success' => false,
                    'message' => $event->title . ': Személyenkénti limit jegyek birtoklásához erre az eseményre: ' . $event->limit_per_person,
                ]);
            }

            if($user_ticket) {
                if($user_ticket->quantity + $item->quantity > $event->limit_per_person) {
                    return response()->json([
                        'success' => false,
                        'message' => $event->title . ': Személyenkénti limit jegyek birtoklásához erre az eseményre: ' . $event->limit_per_person,
                    ]);
                }
                $user_ticket->update(['quantity' => $user_ticket->quantity + $item->quantity]);
            }else {
                Ticket::create([
                    'user_id' => $user,
                    'event_id' => $event->id,
                    'quantity' => $item->quantity
                ]);
            }
        }
        CartItems::clearUserCart($user);
        return response()->json([
            'success' => true,
            'message' => 'Jegyek sikeresen megrendelve!'
        ]);
    }

    public function getUserTickets() {
        $user_id = Auth::user()->id;
        $tickets = Ticket::getUserTickets($user_id);
        return response()->json([
            'success' => true,
            'tickets' => $tickets
        ]);
    }
}
