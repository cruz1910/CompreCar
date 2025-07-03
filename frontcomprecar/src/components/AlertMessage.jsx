import React, { useState, useEffect, useRef } from 'react';
import './AlertMessage.css';

const AlertMessage = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

   
    timerRef.current = setTimeout(() => {
      setIsVisible(false); 
      setTimeout(() => {
        if (onClose) onClose();
      }, 500); 
    }, 3000);


    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [message, onClose]); 

  const handleClose = () => {
    setIsVisible(false); 
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    setTimeout(() => {
      if (onClose) onClose();
    }, 500); 
  };

  if (!isVisible && !message) {
    return null;
  }

  return (
    <div className={`alert-message ${type === 'success' ? 'alert-success' : 'alert-error'} ${isVisible ? 'fade-in' : 'fade-out'}`}>
      <span>{message}</span>
      <button className="close-button" onClick={handleClose}>&times;</button>
    </div>
  );
};

export default AlertMessage;