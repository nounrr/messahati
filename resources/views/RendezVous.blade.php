<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport de Rendez-vous</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            font-size: 24px;
            color: #555;
        }
        .details {
            margin-bottom: 20px;
        }
        .details h2 {
            font-size: 18px;
            color: #444;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .details p {
            margin: 5px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rendez-vous</h1>
    </div>

    <div class="details">
        <h2>Détails du Rendez-vous</h2>
        <p><strong>ID du Rendez-vous :</strong> {{ $rendezvous->id }}</p>
        <p><strong>Type de Rendez-vous :</strong> {{ $rendezvous->traitement->description }}</p>
        <p><strong>Date et Heure :</strong> {{ \Carbon\Carbon::parse($rendezvous->date_heure)->format('Y-m-d H:i') }}</p>
        <p><strong>Statut :</strong> {{ $rendezvous->statut }}</p>
    </div>

    <div class="details">
        <h2>Informations du Patient</h2>
        <p><strong>Nom :</strong> {{ $rendezvous->patient->name }}</p>
        <p><strong>Email :</strong> {{ $rendezvous->patient->email }}</p>
    </div>

    <div class="details">
        <h2>Informations du Docteur</h2>
        <p><strong>Nom :</strong> {{ $rendezvous->docteur->name }}</p>
        <p><strong>Email :</strong> {{ $rendezvous->docteur->email }}</p>
    </div>

    <div class="details">
        <h2>Département</h2>
        <p><strong>Nom :</strong> {{ $rendezvous->departement->nom }}</p>
    </div>

    <div class="footer">
        <p>Rapport généré le {{ now()->format('d/m/Y') }}</p>
    </div>
</body>
</html>