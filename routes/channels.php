<?php

use Illuminate\Support\Facades\Broadcast;
Broadcast::channel('notifications.*', function () {
    return true; // Tout le monde peut accéder à ce canal
});
// Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });

// Broadcast::channel('chat.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });
