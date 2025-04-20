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

class RendezVousCancelled implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $rendezVous;
    public $doctor;
    public $patient;
    public $reason;

    public function __construct(Rendezvous $rendezVous, User $doctor, User $patient, string $reason = null)
    {
        $this->rendezVous = $rendezVous;
        $this->doctor = $doctor;
        $this->patient = $patient;
        $this->reason = $reason;
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
            'doctor_name' => $this->doctor->name,
            'patient_name' => $this->patient->name,
            'date_heure' => $this->rendezVous->date_heure,
            'reason' => $this->reason,
            'created_at' => now()->toDateTimeString()
        ];
    }
} 