<?php

$models = [
    'TypeMedicament',
    'TypeCertificat',
    'TypePartenaire',
    'Clinique',
    'Departement',
    'Traitement',
    'RendezVous',
    'Ordonance',
    'Medicament',
    'CertificatMedicale',
    'Mutuel',
    'Partenaire',
    'Materiel',
    'Salaire',
    'Charge',
    'Reclamation',
    'Feedback',
    'Tache',
    'Message'
];

foreach ($models as $model) {
    $file = "app/Models/{$model}.php";
    if (file_exists($file)) {
        $content = file_get_contents($file);
        if (!str_contains($content, 'use HasFactory;')) {
            $content = str_replace(
                'use Illuminate\Database\Eloquent\Model;',
                "use Illuminate\Database\Eloquent\Model;\nuse Illuminate\Database\Eloquent\Factories\HasFactory;",
                $content
            );
            $content = str_replace(
                "class {$model} extends Model",
                "class {$model} extends Model\n{\n    use HasFactory;\n",
                $content
            );
            file_put_contents($file, $content);
            echo "Added HasFactory to {$model}\n";
        }
    }
} 