import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import styles from '../styles/custom.module.css'
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const AccountModal = ({ show, onClose}) => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const modalWrapperRef = React.useRef();
    const handleCloseClick = (e) => {
      e.preventDefault();
      onClose();
    };
    const onSubmit = async data => {
      const req = await fetch('/api/accounts', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          }) 
      const json = await req.json()
      if(json.success == true){
        onClose();
        router.reload(window.location.pathname);
      }
      else {
        toast(json.message)

      }               
    }
  
    const modalContent = show ? (
      <StyledModalOverlay>
        <StyledModalWrapper ref={modalWrapperRef}>
            <StyledModal id="modal">
            <StyledModalHeader>
                <a href="#" onClick={handleCloseClick}>
                x
                </a>
            </StyledModalHeader>
            
            <StyledModalBody>
              <form className={styles.grid} onSubmit={handleSubmit(onSubmit)}>
                <h3>Add Client</h3>
                  <div>
                      <input className={styles.card} type="text" placeholder="Friendly Account Name" {...register("friendlyName", {required:true})} />
                  </div>
                  <div>
                      <input className={styles.card} type="number" placeholder="Account Number" {...register("accountID", {required: true, minLength: 4, maxLength:4})} />
                  </div>
                  <div>
                      <input className={styles.card} type="email" placeholder="Account Email" {...register("calendarID", {required:true, })} />
                  </div>
                  <input className={styles.card} href="/dashboard/manage"name="submitButton" type="submit" />                
              </form>
            </StyledModalBody>
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
    width: 300px;
    height: 520px;
    z-index: 10;
  `;
  
  const StyledModalHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    font-size: 15px;
    
  `;
  
  const StyledModal = styled.div`
    background: white;
    width: 300px;
    height: 520px;
    border-radius: 15px;
    padding: 15px;
    z-index: 1;
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
    z-index: 8;
  `;
  export default AccountModal;