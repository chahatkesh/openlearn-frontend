import React from 'react';
import { createPortal } from 'react-dom';

/**
 * ModalPortal Component
 * Renders children in a portal attached to document.body to avoid stacking context issues
 */
const ModalPortal = ({ children, isOpen }) => {
  if (!isOpen) return null;
  
  // Create portal target if it doesn't exist
  let portalTarget = document.getElementById('modal-portal');
  if (!portalTarget) {
    portalTarget = document.createElement('div');
    portalTarget.id = 'modal-portal';
    portalTarget.style.position = 'relative';
    portalTarget.style.zIndex = '9999';
    document.body.appendChild(portalTarget);
  }

  return createPortal(children, portalTarget);
};

export default ModalPortal;
