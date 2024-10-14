import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface CustomSnackbarProps {
    snackbarOpen: boolean;
    setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
    severity?: 'success' | 'info' | 'warning' | 'error';
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
    snackbarOpen,
    setSnackbarOpen,
    message,
    severity = 'info',
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
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            autoHideDuration={3000}
        >
            <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar;
