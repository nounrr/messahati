import React from 'react';
import DataTable from 'react-data-table-component';
import { Icon } from '@iconify/react';

const TableDataLayer = ({ 
    title = "Data Table",
    columns = [],
    data = [],
    onView,
    onEdit,
    onDelete,
    showCheckbox = true,
    pageLength = 100,
    onSelectedRowsChange
}) => {
    // Personnalisation du style pour correspondre à l'ancien design
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f8f9fa',
                borderBottomWidth: '1px',
                borderBottomColor: '#dee2e6',
                minHeight: '50px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
                fontWeight: '600',
                fontSize: '14px',
                color: '#495057',
            },
        },
        rows: {
            style: {
                minHeight: '50px',
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
                fontSize: '14px',
            },
        },
        pagination: {
            style: {
                borderTopWidth: '1px',
                borderTopColor: '#dee2e6',
                paddingTop: '16px',
            },
            pageButtonsStyle: {
                borderRadius: '4px',
                height: '32px',
                minWidth: '32px',
                padding: '0 8px',
                margin: '0 4px',
                cursor: 'pointer',
                transition: '0.2s all',
                backgroundColor: '#f8f9fa',
                '&:hover:not(:disabled)': {
                    backgroundColor: '#e9ecef',
                },
                '&:disabled': {
                    cursor: 'not-allowed',
                },
            },
        },
    };

    // Personnalisation des colonnes pour inclure les actions
    const customColumns = [
        ...columns,
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    {onView && (
                        <button
                            onClick={() => onView(row)}
                            className="w-8 h-8 bg-primary-light text-primary-600 rounded-full flex items-center justify-center"
                        >
                            <Icon icon="iconamoon:eye-light" />
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={() => onEdit(row)}
                            className="w-8 h-8 bg-success-focus text-success-main rounded-full flex items-center justify-center"
                        >
                            <Icon icon="lucide:edit" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(row)}
                            className="w-8 h-8 bg-danger-focus text-danger-main rounded-full flex items-center justify-center"
                        >
                            <Icon icon="mingcute:delete-2-line" />
                        </button>
                    )}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '200px',
            grow:1
        },
    ];

    // Personnalisation de la pagination
    const paginationComponentOptions = {
        rowsPerPageText: 'Afficher',
        rangeSeparatorText: 'sur',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Tous',
    };

    return (
        <div className="card basic-data-table">
            <div className="card-header">
                <h5 className="card-title mb-0">{title}</h5>
            </div>
            <div className="card-body">
                <DataTable
                    columns={customColumns}
                    data={data}
                    selectableRows={showCheckbox}
                    onSelectedRowsChange={onSelectedRowsChange}
                    pagination
                    paginationPerPage={pageLength}
                    paginationComponentOptions={paginationComponentOptions}
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
                    responsive
                    noHeader
                />
            </div>
        </div>
    );
};

export default TableDataLayer;
