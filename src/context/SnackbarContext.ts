import { createContext } from 'react';
import type { AlertColor } from '@mui/material';

export type SnackbarContextType = {
    showMessage: (text: string, severity?: AlertColor) => void;
};

export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);
