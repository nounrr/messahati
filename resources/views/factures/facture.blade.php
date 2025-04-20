<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            margin-top: 20px;
        }
        .content table {
            width: 100%;
            border-collapse: collapse;
        }
        .content table th, .content table td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        .content table th {
            background-color: #f2f2f2;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Facture</h1>
    </div>
    <div class="content">
        <table>
            <tr>
                <th>Numéro d’admission</th>
                <td>{{ $numero_admission }}</td>
            </tr>
            <tr>
                <th>Nom du patient</th>
                <td>{{ $nom_patient }}</td>
            </tr>
            <tr>
                <th>Date d’encaissement</th>
                <td>{{ $date_encaissement }}</td>
            </tr>
            <tr>
                <th>Mode de paiement</th>
                <td>{{ $mode_paiement }}</td>
            </tr>
            <tr>
                <th>Référence paiement</th>
                <td>{{ $reference_paiement }}</td>
            </tr>
            <tr>
                <th>Montant payé</th>
                <td>{{ $montant_paye }} €</td>
            </tr>
        </table>
    </div>
</body>
</html>

