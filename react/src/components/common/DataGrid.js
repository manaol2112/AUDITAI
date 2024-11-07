import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';


const DataTable = ({ columns, rows, columnsWithActions }) => {

    const getRowClassName = (params) => {
        return params.id % 2 === 0 ? 'even-row' : 'odd-row'; // Example of alternating row colors
    };

   
    const customTheme = createTheme({
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    columnHeader: {
                        backgroundColor: '#f0f0f0', // Custom background color for header
                        color: 'rgba(0, 0, 0, 0.54)', // Secondary text color for header
                        fontWeight: 'bold', // Custom font weight for header
                    },
                    
                },
            },
        },
    });

    return (
        <ThemeProvider theme={customTheme}>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columnsWithActions}
                    pagination
                    pageSize={5}
                    rowsPerPageOptions={[10, 20, 30]}
                    // checkboxSelection
                    getRowClassName={getRowClassName}
                />
            </div>
        </ThemeProvider>
    );
}

export default DataTable;
