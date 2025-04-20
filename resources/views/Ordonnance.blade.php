<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ordonnance Médicale</title>
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
        .medicaments {
            margin-top: 20px;
        }
        .medicaments table {
            width: 100%;
            border-collapse: collapse;
        }
        .medicaments table th, .medicaments table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .medicaments table th {
            background-color: #f4f4f4;
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
        <h1>Ordonnance Médicale</h1>
    </div>

    <div class="details">
        <h2>Détails de l'Ordonnance</h2>
        <p><strong>Date d'Émission :</strong> {{ \Carbon\Carbon::parse($ordonance->date_emission)->format('d/m/Y') }}</p>
        <p><strong>Description :</strong> {{ $ordonance->description }}</p>
    </div>

    <!-- <div class="details">
        <h2>Traitement</h2>
        <p><strong>Description :</strong> {{ $ordonance->traitement->description }}</p>
    </div> -->

    <div class="details">
        <h2>Informations du Patient</h2>
        <p><strong>Nom :</strong> {{ $ordonance->patient->name }}</p>
        <p><strong>Email :</strong> {{ $ordonance->patient->email }}</p>
    </div>

    <div class="details">
        <h2>Informations du Docteur</h2>
        <p><strong>Nom :</strong> {{ $ordonance->docteur->name }}</p>
        <p><strong>Email :</strong> {{ $ordonance->docteur->email }}</p>
    </div>

    <div class="medicaments">
        <h2>Médicaments Prescrits</h2>
        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Dosage</th>
                    <th>Fréquence</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($ordonance->medicaments as $medicament)
                    <tr>
                        <td>{{ $medicament->nom_medicament }}</td>
                        <td>{{ $medicament->pivot->dosage }}</td>
                        <td>{{ $medicament->pivot->frequence }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Ordonnance générée le {{ now()->format('d/m/Y') }}</p>
    </div>
</body>
</html>