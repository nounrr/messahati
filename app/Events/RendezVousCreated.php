<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\RendezVous;

class RendezVousCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $rendezVous;
    public $doctor;
    public $patient;

    public function __construct(RendezVous $rendezVous, $doctor, $patient)
    {
        $this->rendezVous = $rendezVous;
        $this->doctor = $doctor;
        $this->patient = $patient;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('rendez-vous-channel');
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->rendezVous->id,
            'date' => $this->rendezVous->date,
            'heure' => $this->rendezVous->heure,
            'doctor_id' => $this->rendezVous->doctor_id,
            'patient_id' => $this->rendezVous->patient_id,
            'doctor_name' => $this->doctor->name,
            'patient_name' => $this->patient->name,
            'created_at' => $this->rendezVous->created_at->toDateTimeString()
        ];
    }
} 