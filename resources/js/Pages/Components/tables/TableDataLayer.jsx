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
    selectableRows = false,
    pageLength = 100,
    onSelectedRowsChange,
    isLoading = false,
    selectableRowsHighlight = false,
    selectableRowsVisibleOnly = false,
    selectableRowsSingle = false
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
                cursor: 'pointer',
            },
            selectedHighlightStyle: {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
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

    return (
        <div className="card basic-data-table">
            <div className="card-header">
                <h5 className="card-title mb-0">{title}</h5>
            </div>
            <div className="card-body">
                <DataTable
                    columns={columns}
                    data={data}
                    selectableRows={selectableRows}
                    onSelectedRowsChange={onSelectedRowsChange}
                    pagination
                    paginationPerPage={pageLength}
                    paginationComponentOptions={{
                        rowsPerPageText: 'Afficher',
                        rangeSeparatorText: 'sur',
                        selectAllRowsItem: true,
                        selectAllRowsItemText: 'Tous',
                    }}
                    customStyles={customStyles}
                    highlightOnHover
                    pointerOnHover
                    responsive
                    noHeader
                    progressPending={isLoading}
                    selectableRowsHighlight={selectableRowsHighlight}
                    selectableRowsVisibleOnly={selectableRowsVisibleOnly}
                    selectableRowsSingle={selectableRowsSingle}
                    selectableRowsComponentProps={{
                        indeterminate: isLoading,
                    }}
                />
            </div>
        </div>
    );
};

export default TableDataLayer;
