<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    /**
     * Envoie des notifications à l'émetteur et au destinataire
     *
     * @param int $emetteurId ID de l'émetteur
     * @param int $destinataireId ID du destinataire
     * @param string $type Type de notification (rendez-vous, reclamation, message, payment)
     * @param array $details Détails supplémentaires pour le message
     * @return void
     */
    public static function envoyerNotifications($emetteurId, $destinataireId, $type, $details)
    {
        // Récupérer les utilisateurs en une seule requête
        $users = User::whereIn('id', [$emetteurId, $destinataireId])->get();
        $emetteur = $users->firstWhere('id', $emetteurId);
        $destinataire = $users->firstWhere('id', $destinataireId);

        if (!$emetteur || !$destinataire) {
            return;
        }

        switch ($type) {
            case 'rendez-vous':
                $messageEmetteur = "Un rendez-vous a été programmé le " . $details['date_heure'] . " avec le docteur " . $destinataire->nom . " " . $destinataire->prenom;
                $messageDestinataire = "Un rendez-vous a été programmé avec le patient " . $emetteur->nom . " " . $emetteur->prenom . " le " . $details['date_heure'];
                break;

            case 'reclamation':
                $messageEmetteur = "Votre réclamation a été envoyée au docteur " . $destinataire->nom . " " . $destinataire->prenom;
                $messageDestinataire = "Vous avez reçu une réclamation du patient " . $emetteur->nom . " " . $emetteur->prenom;
                break;

            case 'message':
                $messageEmetteur = "Votre message a été envoyé au docteur " . $destinataire->nom . " " . $destinataire->prenom;
                $messageDestinataire = "Vous avez reçu un message du patient " . $emetteur->nom . " " . $emetteur->prenom;
                break;

            case 'payment':
                $messageEmetteur = "Vous avez effectué un paiement de " . $details['montant'] . " au docteur " . $destinataire->nom . " " . $destinataire->prenom;
                $messageDestinataire = "Vous avez reçu un paiement de " . $details['montant'] . " du patient " . $emetteur->nom . " " . $emetteur->prenom;
                break;

            default:
                $messageEmetteur = "Notification";
                $messageDestinataire = "Notification";
        }

        // Utiliser une transaction pour garantir l'intégrité des données
        DB::transaction(function () use ($emetteurId, $destinataireId, $messageEmetteur, $messageDestinataire) {
            // Notification pour l'émetteur
            $notificationEmetteur = new Notification();
            $notificationEmetteur->date = now();
            $notificationEmetteur->statut = true;
            $notificationEmetteur->save();

            $notificationEmetteur->users()->attach($emetteurId, [
                'message' => $messageEmetteur
            ]);

            // Notification pour le destinataire
            $notificationDestinataire = new Notification();
            $notificationDestinataire->date = now();
            $notificationDestinataire->statut = true;
            $notificationDestinataire->save();

            $notificationDestinataire->users()->attach($destinataireId, [
                'message' => $messageDestinataire
            ]);
        });
    }
} 