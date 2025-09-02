<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\CartItems;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{

    public function getUserCartItems() {
        $user_id = Auth::id();
        $items = CartItems::with('event:id,title,price')->where('user_id', $user_id)->orderBy('id', 'ASC')->get();
        $total = 0;

        foreach($items as $item) {
            $total += $item->quantity * $item->event->price;
        }

        return response()->json([
            'success' => true,
            'cart_items' => $items,
            'total' => $total,
        ]);
    }

    public function updateUserCart(Request $request) {
        $user_id = Auth::id();

        //Kosár update
        $item = CartItems::find($request->id);
        if($item) {
            if($request->quantity > 0) {
                $item->update([
                    'quantity' => $request->quantity
                ]);
            }else {
                $item->delete();
            }
        }

        $items = CartItems::with('event:id,title,price')->where('user_id', $user_id)->orderBy('id', 'ASC')->get();
        $total = 0;

        foreach($items as $item) {
            $total += $item->quantity * $item->event->price;
        }

        return response()->json([
            'success' => true,
            'cart_items' => $items,
            'total' => $total,
        ]);
    }

    public function addCartItem(Request $request) {
        $event_id = $request->id;
        $event = Event::find($event_id);
        $user_id = Auth::user()->id;

        if($event) {
            //Jegyek számának ellenőrzése
            $sold_tickets = $event->tickets()->sum('quantity');
            $user_ticket = Ticket::getUserTicketForEvent($user_id, $event_id);

            if($sold_tickets >= $event->capacity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Az eseményre már elkelt az összes jegy!',
                ]);
            }

            if($request->quantity + $sold_tickets > $event->capacity) {
                $available = $event->capacity - $sold_tickets;
                return response()->json([
                    'success' => false,
                    'message' => 'Nincs ennyi elérhető jegy az eseményre! Elérhető még: ' . $available,
                ]);
            }

            if($request->quantity > $event->limit_per_person) {
                return response()->json([
                    'success' => false,
                    'message' => 'Személyenkénti limit jegyek birtoklására erre az eseményre: ' . $event->limit_per_person,
                ]);
            }

            if($user_ticket) {
                if($request->quantity + $user_ticket->quantity > $event->limit_per_person) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Személyenkénti limit jegyek birtoklására erre az eseményre: ' . $event->limit_per_person,
                    ]);
                }
            }

            if($request->quantity + $sold_tickets > $event->capacity) {
                $available = $event->capacity - $sold_tickets;
                return response()->json([
                    'success' => false,
                    'message' => 'Nincs ennyi elérhető jegy az eseményre! Elérhető még: ' . $available,
                ]);
            }

            $item = CartItems::where('user_id', $user_id)->where('event_id', $event_id)->first();

            if($item) {
                if($request->quantity + $item->quantity > $event->limit_per_person) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Személyenkénti limit jegyek birtoklására erre az eseményre: ' . $event->limit_per_person,
                    ]);
                }

                if($request->quantity + $item->quantity + $sold_tickets > $event->capacity) {
                    $available = $event->capacity - $sold_tickets;
                    return response()->json([
                        'success' => false,
                        'message' => 'Nincs ennyi elérhető jegy az eseményre! Elérhető még: ' . $available,
                    ]);
                }

                CartItems::updateItem($item->id, $item->quantity + $request->quantity);
                return response()->json([
                    'success' => true,
                    'message' => 'Kosár tartalma sikeresen módosítva.'
                ]);
            }

            CartItems::addItem($request, $user_id);
            return response()->json([
                'success' => true,
                'message' => 'A jegy(ek) sikeresen hozzáadva a kosaradhoz.'
            ]);
        }
    }
}
