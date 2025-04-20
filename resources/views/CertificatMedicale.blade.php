<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificat Médical</title>
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
        <h1>Certificat Médical</h1>
    </div>

    <div class="details">
        <h2>Informations des Rendez-vous</h2>
        @foreach ($rendezvous as $rdv)
            @if ($rdv->patient && $rdv->docteur)
                <p><strong>Nom du Patient :</strong> {{ $rdv->patient->name }}</p>
                <p><strong>Email du Patient :</strong> {{ $rdv->patient->email }}</p>
                <p><strong>Nom du Docteur :</strong> {{ $rdv->docteur->name }}</p>
                <p><strong>Email du Docteur :</strong> {{ $rdv->docteur->email }}</p>
                <hr>
            @else
                <p><strong>Informations manquantes pour ce rendez-vous.</strong></p>
                <hr>
            @endif
        @endforeach
    </div>

    <div class="details">
        <h2>Détails du Certificat</h2>
        <p><strong>Date d'Émission :</strong> {{ \Carbon\Carbon::parse($certificat->date_emission)->format('d/m/Y') }}</p>
        <p><strong>Description :</strong> {{ $certificat->description }}</p>
        <p><strong>Type de Certificat :</strong>{{ $certificat->typeCertificat ? $certificat->typeCertificat->description : 'Non spécifié' }}</p>
    </div>

    <div class="footer">
        <p>Certificat généré le {{ now()->format('d/m/Y') }}</p>
    </div>
</body>
</html>