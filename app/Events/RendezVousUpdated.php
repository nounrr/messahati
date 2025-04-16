<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Rendezvous;
use App\Models\User;

class RendezVousUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $rendezVous;
    public $doctor;
    public $patient;
    public $changes;

    public function __construct(Rendezvous $rendezVous, User $doctor, User $patient, array $changes)
    {
        $this->rendezVous = $rendezVous;
        $this->doctor = $doctor;
        $this->patient = $patient;
        $this->changes = $changes;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('rendez-vous-channel');
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->rendezVous->id,
            'doctor_id' => $this->doctor->id,
            'patient_id' => $this->patient->id,
            'changes' => $this->changes,
            'doctor_name' => $this->doctor->name,
            'patient_name' => $this->patient->name,
            'date_heure' => $this->rendezVous->date_heure,
            'created_at' => now()->toDateTimeString()
        ];
    }
} 