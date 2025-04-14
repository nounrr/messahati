<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    @viteReactRefresh
    @vite('resources/js/app.jsx')

    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
