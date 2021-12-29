import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const EventConfirm = ({ show, onClose, title }) => {  
    const handleCloseClick = (e) => {
      e.preventDefault();
      onClose();
    };
    const onClick = (e) => {
      onClose();
    }
  
  
    const modalContent = show ? (
      <>
      <StyledModalOverlay>
        <StyledModalWrapper>
            <StyledModal id="modal">
            <StyledModalHeader>
            </StyledModalHeader>
            <StyledModalBody>
              <div>Are you sure you want to delete this event?</div>
                <StyledButton onClick={handleCloseClick}>Yes</StyledButton>
                <StyledButton onClick={()=>onClick}>No</StyledButton>
            </StyledModalBody>
            </StyledModal>
        </StyledModalWrapper>
      </StyledModalOverlay>
      
      </>
    ) : null;
    return modalContent;
  };
  const StyledButton = styled.button`
    margin: 1rem;
    flex-basis: 40%;
    padding: 0.75rem;
    color: inherit;
    text-decoration: none;
    border: 1px solid #eaeaea;
    border-radius: 10px;
    transition: color 0.15s ease, border-color 0.15s ease;
    &:hover {
      color: #0070f3;
      border-color: #0070f3;
    }
  `;
  
  const StyledModalBody = styled.div`
    padding-top: 10px;
    height: 100%;
    
  `;
  const StyledModalWrapper = styled.div`
    width: 500px;
    height: 200px;
    z-index: 10;
    `;
  
  const StyledModalHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    font-size: 15px;
    
  `;
  
  const StyledModal = styled.div`
    background: white;
    width: 400px;
    height: 150px;
    margin-left:auto;
    margin-right:auto;
    border-radius: 15px;
    padding: 15px;
    z-index: 100;
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
    background-color: rgba(0, 0, 0, .5);
    z-index: 50;
  `;
  
  export default EventConfirm;