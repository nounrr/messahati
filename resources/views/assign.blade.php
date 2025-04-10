@extends('main')

@section('content')
<div class="container">
    <h2 class="mb-4">Assignation des rôles</h2>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Utilisateur</th>
                <th>Rôles</th>
                <th>Assigner un rôle</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
                <tr>
                    <td>{{ $user->name }}</td>
                    <td>
                        @foreach($user->roles as $role)
                            <span class="badge bg-info text-dark">{{ $role->name }}</span>
                        @endforeach
                    </td>
                    <td>
                        <form action="{{ route('assign.role', $user->id) }}" method="POST">
                            @csrf
                            <div class="input-group">
                                <select name="role" class="form-select" required>
                                    <option value="">-- Choisir un rôle --</option>
                                    @foreach($roles as $role)
                                        <option value="{{ $role->name }}">{{ $role->name }}</option>
                                    @endforeach
                                </select>
                                <button class="btn btn-primary" type="submit">Assigner</button>
                            </div>
                        </form>
                    </td>
                    <td>
                        @foreach($user->roles as $role)
                            <form action="{{ route('remove.role') }}" method="POST" class="d-inline">
                                @csrf
                                <input type="hidden" name="user_id" value="{{ $user->id }}">
                                <input type="hidden" name="role" value="{{ $role->name }}">
                                <button class="btn btn-danger btn-sm" onclick="return confirm('Retirer ce rôle ?')">
                                    Retirer {{ $role->name }}
                                </button>
                            </form>
                        @endforeach
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{ $users->links() }}
</div>
@endsection
