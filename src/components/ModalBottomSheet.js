import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const Sheet = styled.div`
  position: fixed;
  bottom: ${props => props.$isVisible ? '56px' : '-100%'};
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  z-index: 1001;
  padding: 16px;
  max-height: calc(80vh - 56px);
  overflow-y: auto;
  transition: bottom 0.3s ease;

  &::before {
    content: '';
    display: block;
    width: 40px;
    height: 4px;
    background: #e8e8e8;
    border-radius: 2px;
    margin: 0 auto 16px;
  }
`;

const SheetHeader = styled.div`
  text-align: center;
  font-weight: 600;
  margin-bottom: 16px;
`;

const ModalBottomSheet = ({ title, children, open, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Trigger animation after component is mounted
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      // Remove component after animation
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!shouldRender) return null;

  const handleBackdropClick = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300);
  };
  
  return (
    <>
      <Backdrop $isVisible={isVisible} onClick={handleBackdropClick} />
      <Sheet $isVisible={isVisible}>
        <SheetHeader>{title}</SheetHeader>
        {children}
      </Sheet>
    </>
  );
};

export default ModalBottomSheet; 