import React, { useEffect } from 'react';

interface ToastProps {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ show, message, type, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = {
    success: 'bg-success',
    error: 'bg-danger',
    info: 'bg-info',
    warning: 'bg-warning',
  }[type];

  const icon = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle',
    warning: 'fa-exclamation-triangle',
  }[type];

  return (
    <div
      className={`toast show position-fixed top-0 end-0 m-3 ${bgColor} text-white`}
      role="alert"
      style={{ zIndex: 9999 }}
    >
      <div className="toast-header">
        <i className={`fas ${icon} me-2 text-${type === 'warning' ? 'dark' : 'white'}`}></i>
        <strong className="me-auto">
          {type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'info' ? 'Info' : 'Warning'}
        </strong>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body">{message}</div>
    </div>
  );
};

export default Toast;
