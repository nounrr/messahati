<!-- resources/views/Export.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Export Departements</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.0/css/bootstrap.min.css">
</head>
<body>
    <div class="container mt-5">
        <h1>Export Departements</h1>

        <!-- Export Button -->
        <div class="mb-3">
            <a href="{{ route('departements.export') }}" class="btn btn-primary">Export Departements to Excel</a>
        </div>
    </div>
</body>
</html>
