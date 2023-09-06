
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from "@mui/material";
import { ArrowDropDown , ArrowDropUp} from "@mui/icons-material"


const AIPDataGrid = ({ columns, rows, handleRowClick, onRowsSelectionHandler, checkboxSelection = false }) => {

    const muiTheme = createTheme({
        typography: {
            fontFamily: 'Cresta, Normal',
            fontSize: 14,
        },
        palette: {
            background: {
                default: '#f5f5f5', // Default background color for most components
                paper: '#ffffff', // Background color for paper-like components (dialogs, cards, etc.)
            },
        },
    });

    return (
        <Box sx={{ height: '100%', width: '100%', top: 50 }}>
            <ThemeProvider theme={muiTheme}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowHeight={39}
                    hideFooterPagination={true}
                    disableColumnMenu={true}
                    hideFooter={true}
                    onRowClick={handleRowClick}
                    sx={{
                        '.MuiDataGrid-iconButtonContainer': {
                            visibility: 'visible',
                        },
                        '.MuiDataGrid-sortIcon': {
                            opacity: 'inherit !important',
                        },
                        '.MuiTableSortLabel-icon': {
                            opacity: 2,
                        },
                        '.MuiDataGrid-columnHeaderTitle': {
                            fontSize: '12px',
                            fontFamily: 'var(--font-cresta-normal)'
                        }
                    }}
                    checkboxSelection={checkboxSelection}
                    onRowSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                    slots={{
                      columnSortedDescendingIcon: ArrowDropDown,
                      columnSortedAscendingIcon: ArrowDropUp,
                    }}
                />
            </ThemeProvider>
        </Box>
    );
};

export default AIPDataGrid;