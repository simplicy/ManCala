import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Modal = ({ show, onClose, children, title }) => {
    const [isBrowser, setIsBrowser] = useState(false);
    const modalWrapperRef = React.useRef();
    
    useEffect(() => {
      setIsBrowser(true);
      window.addEventListener('click', backDropHandler);
      return () => window.removeEventListener('click', backDropHandler);
    }, []);
  
    const handleCloseClick = (e) => {
      e.preventDefault();
      onClose();
    };

    const backDropHandler = (e) => {
      if (!modalWrapperRef?.current?.contains(e.target)) {
        onClose();
    }
    };
  
  
    const modalContent = show ? (
      <StyledModalOverlay>
        <StyledModalWrapper ref={modalWrapperRef}>
            <StyledModal id="modal">
            <StyledModalHeader>
                <a href="#" onClick={handleCloseClick}>
                x
                </a>
            </StyledModalHeader>
            {title && <StyledModalTitle>{title}</StyledModalTitle>}
            <StyledModalBody>{children}</StyledModalBody>
            </StyledModal>
        </StyledModalWrapper>
      </StyledModalOverlay>
    ) : null;
  
    return modalContent;
  };
  
  const StyledModalBody = styled.div`
    padding-top: 10px;
    height: 100%;
    
  `;
  const StyledModalWrapper = styled.div`
    width: 500px;
    height: 600px;
    z-index: 10;
    `;
  
  const StyledModalHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    font-size: 15px;
    
  `;
  
  const StyledModal = styled.div`
    background: white;
    width: 500px;
    height: 600px;
    border-radius: 15px;
    padding: 15px;
    z-index: 10;
  `;
  const StyledModalOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
  `;
  
  export default Modal;