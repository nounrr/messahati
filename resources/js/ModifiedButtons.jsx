{/* Code modifié pour les boutons d'action - à copier dans AssignRoleLayer.jsx */}

{/* Remplacez cette section dans votre fichier principal */}
<td className="text-center">
    <div className="d-flex justify-content-center gap-2">
        <div className="dropdown">
            <button
                className="btn btn-primary px-18 py-11 dropdown-toggle toggle-icon fw-bold"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Manage Roles
            </button>
            <ul className="dropdown-menu">
                {roles.map(role => {
                    const hasRole = userHasRole(user, role.name);
                    return (
                        <li key={role.id}>
                            <button
                                className={`dropdown-item px-16 py-8 rounded d-flex align-items-center justify-content-between 
                                    ${hasRole ? 'bg-light text-primary' : 'text-secondary-light bg-hover-neutral-200 text-hover-neutral-900'}`}
                                onClick={() => handleToggleRole(user.id, role.name, hasRole)}
                            >
                                <span>{role.name}</span>
                                {hasRole ? (
                                    <FaTrash className="text-danger" />
                                ) : (
                                    <FaPlus className="text-success" />
                                )}
                            </button>
                            {/* Suppression du bouton "View {role.name} Permissions" */}
                        </li>
                    );
                })}
            </ul>
        </div>
        <button
            className="btn btn-outline-secondary-600 not-active px-18 py-11 d-flex align-items-center gap-2"
            onClick={() => handleOpenPermissionModal(user)}
        >
            <FaKey /> Permissions
        </button>
        <button
            className="btn btn-primary not-active px-18 py-11 d-flex align-items-center gap-2"
            onClick={() => handleOpenRoleModal(user)}
        >
            <FaTrash /> Manage Roles
        </button>
    </div>
</td> 