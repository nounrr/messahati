<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport Médical du Patient</title>
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
        <h1>Rapport Médical</h1>
        <p><strong>Nom du Patient :</strong> {{ $patient->name }}</p>
        <p><strong>Email :</strong> {{ $patient->email }}</p>
    </div>

    <div class="details">
        <h2>Rendez-vous et Certificats Médicaux</h2>
        @foreach ($patient->rendezvousAsPatient as $rdv)
            <p><strong>Date du Rendez-vous :</strong> {{ \Carbon\Carbon::parse($rdv->date_heure)->format('d/m/Y H:i') }}</p>
            <p><strong>Docteur :</strong> {{ $rdv->docteur->name }}</p>
            <p><strong>Certificats Médicaux :</strong></p>
            @if ($rdv->traitement && $rdv->traitement->certificatMedicales->isNotEmpty())
                <ul>
                    @foreach ($rdv->traitement->certificatMedicales as $certificat)
                        <li>
                            <strong>Type :</strong> {{ $certificat->typeCertificat->nom ?? 'Non spécifié' }},
                            <strong>Description :</strong> {{ $certificat->description }},
                            <strong>Date d'Émission :</strong> {{ \Carbon\Carbon::parse($certificat->date_emission)->format('d/m/Y') }}
                        </li>
                    @endforeach
                </ul>
            @else
                <p>Aucun certificat médical associé.</p>
            @endif
            <hr>
        @endforeach
    </div>

    <div class="footer">
        <p>Rapport généré le {{ now()->format('d/m/Y') }}</p>
    </div>
</body>
</html>