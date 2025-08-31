<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItems extends Model
{
    protected $fillable = [
        'user_id',
        'event_id',
        'quantity'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function getUserCartItems($id) {
        $items = self::where('user_id', $id)->get();

        return $items;
    }

    public static function clearUserCart($user_id) {
        self::where('user_id', $user_id)->delete();
    }

    public static function addItem($data, $user_id) {
        self::create([
            'user_id' => $user_id,
            'event_id' => $data['id'],
            'quantity' => $data['quantity']
        ]);
    }

    public static function updateItem($id, $quantity) {
        self::where('id', $id)->update([
            'quantity' => $quantity
        ]);
    }

}
