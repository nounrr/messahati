import React, { useState } from 'react';

const [roleFilter, setRoleFilter] = useState('');

const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
};

const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || user.status === statusFilter;
    const matchesRole = !roleFilter || (user.roles && user.roles.some(role => role.name === roleFilter));
    return matchesSearch && matchesStatus && matchesRole;
});

<select
    className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
    value={roleFilter}
    onChange={handleRoleFilter}
>
    <option value="">All Roles</option>
    {roles.map(role => (
        <option key={role.id} value={role.name}>{role.name}</option>
    ))}
</select> 