import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useAppContext } from '../context/appContext';

const Alert = () => {
  const { showAlert, alertType, alertText } = useAppContext();
  if (!showAlert) return null;

  const iconStyle = {
    marginRight: '8px',
  };

  const alertStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px',
    borderRadius: '4px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    zIndex: 9999,
    borderLeft: `4px solid ${alertType === 'success' ? '#4CAF50' : '#FF5252'}`, // Add border to left side
    backgroundColor: '#333', // Background color for the alert
  };

  return (
    <div style={alertStyle}>
      {alertType === 'success' ? (
        <CheckCircleIcon style={iconStyle} />
      ) : (
        <ErrorIcon style={iconStyle} />
      )}
      {alertText}
    </div>
  );
};

export default Alert;