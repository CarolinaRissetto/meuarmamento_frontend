import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface CustomSnackbarProps {
    snackbarOpen: boolean; 
    setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>; 
    message: string;
    severity?: 'success' | 'info' | 'warning' | 'error';
    autoHideDuration?: number;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
    snackbarOpen,
    setSnackbarOpen,
    message,
    severity = 'info',
    autoHideDuration = 4000
}) => {
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;
