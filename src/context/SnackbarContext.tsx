import { createContext, useState, type ReactNode } from 'react';
import { Snackbar, Alert, type AlertColor } from '@mui/material';

type SnackbarContextType = {
    showMessage: (text: string, severity?: AlertColor) => void;
};

type providerProps = {
    children: ReactNode;
};

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: providerProps) => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('success');

    const showMessage = (text: string, severity: AlertColor = 'success') => {
        setText(text);
        setSeverity(severity);
        setOpen(true);
    };

    const handleClose = (_event: unknown, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showMessage }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={severity} variant="filled" onClose={() => setOpen(false)}>
                    {text}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export default SnackbarProvider;
