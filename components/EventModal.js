import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useForm } from 'react-hook-form';
import ConfirmModal from "./EventConfirm";
import styles from '../styles/custom.module.css'

const FormModal = ({ show, onClose, editing, payload}) => {
    const [confirmModal, setConfirm] = useState(false);
    const modalWrapperRef = React.useRef();
    const confirmRef = React.useRef();
    const { register, setValue, handleSubmit, formState: { errors } } = useForm()
    const handleCloseClick = (e) => {
      e.preventDefault();
      setValue("date",null);
      setValue("startTime",null);
      setValue("endTime",null);
      onClose();
    };    

    const onSubmit =  data => {
      var form = document.getElementById("eventForm");
      form.reset();
      onClose();  
    };
    const onTrashClick = () => {
      console.log("Trash Cicked!")
      setConfirm(true);
    };
    const onEditClick = () => {
      console.log("Edit Cicked!")
      setEditMode(true);
    };

    setValue("date",payload.event.date);
    if((payload.event.start && payload.event.end) != "00:00" && "24:00"){
      setValue("startTime",payload.event.start);
      setValue("endTime",payload.event.end);
    }  
    const modalContent = <>
        { editing ? (
                <StyledModalOverlay>
                  <StyledModalWrapper ref={modalWrapperRef}>
                      <StyledModal>
                        <StyledModalHeader>
                            <a href="#" onClick={handleCloseClick}>
                            x
                            </a>
                        </StyledModalHeader>
                        <StyledModalBody>
                        <form id="eventForm" onSubmit={handleSubmit(onSubmit)}>
                          <div className={styles.row}>
                            <input  className={styles.eventTitle} type="text" cols="150" rows="1" placeholder="Title" {...register("eventTitle")} />
                          </div>
                          <div className={styles.row}>
                            <div className={styles.column}>                          
                                <label htmlFor="date">Date:</label>                        
                                <input id="date"className={styles.card} type="date" placeholder="Date" {...register("date")} />                          
                                <label htmlFor="startTime">Start Time:</label>
                                <input id="startTime" className={styles.card} type="time" placeholder="Time" {...register("startTime")} />                           
                                <label htmlFor="endTime">End Time:</label>
                                <input id="endTime" className={styles.card} type="time" title="Time" {...register("endTime")} /> 
                            </div>                            
                            <div className={styles.column}>
                                <textarea className={styles.card} type="text" cols="20" rows="4" placeholder="Details" {...register("details")} />
                                <textarea className={styles.card} type="text" cols="20" rows="2" placeholder={'Attendee emails'+"   "+'(Each on a new line)'} {...register("attendees")} />
                                <textarea className={styles.card} type="text" cols="20" rows="1" placeholder="Address" {...register("location")} />
                                <button className={styles.submitButton} name="submitButton" type="submit" placeholder="">Submit</button>  
                            </div>                          
                          </div>                         
                        </form>
                        </StyledModalBody>
                      </StyledModal>
                  </StyledModalWrapper>
                </StyledModalOverlay>
                 ) :
                (
                <StyledModalOverlay>
                  <StyledModalWrapper ref={modalWrapperRef}>
                    <StyledModal>
                      <StyledModalHeader>
                            <div className={styles.edit} onClick={()=>onEditClick()}>
                              
                                <img src="/n-edit.svg"   alt="edit" className="icons" />
                              
                            </div>  
                            <div className={styles.edit} onClick={()=>onTrashClick()}>
                              <a href="#">                                
                                <img src="/trash-can.svg" alt="delete" className="icons" /> 
                              </a>
                            </div>  
                            <div className={styles.column}/>
                            <div className={styles.column}/>
                          <a href="#" onClick={handleCloseClick} className={styles.x}>
                          x
                          </a>
                      </StyledModalHeader>
                      <StyledModalBody>
                      <ConfirmModal ref={confirmRef} onClose={() => setShowModal(false)} show={confirmModal} className="card">
                      </ConfirmModal>
                      <form id="eventForm" onSubmit={handleSubmit(onSubmit)}>
                          <div className={styles.row}>
                            <div className={styles.column}>                          
                              Event Viewing!                        
                            </div>
                            <div className={styles.column}>
                              <p className={styles.card} type="text" cols="20" rows="25" placeholder="Details" {...register("details", {})} />
                            </div>                          
                          </div>    
                        </form>
                      </StyledModalBody>
                    </StyledModal>
                  </StyledModalWrapper>
              </StyledModalOverlay>
              )
            }
        <style jsx>{`
        label {
          padding: 20px;
        }
        textarea {
          resize:none;
        }
        
        input {
          display:flex;
          width:80%;
        }
      `}</style>
      </>;
  
    if(show)
        return modalContent;
    else
        return null;
};
  
  const StyledModalBody = styled.div`
    padding-top: 10px;
    height: 100%;
  `;
  const StyledModalWrapper = styled.div`
    width: 550px;
    height: 680px;
    z-index: 10;
  `;
  
  const StyledModalHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    font-size: 15px;
    
  `;
  
  const StyledModal = styled.div`
    background: white;
    width: 550px;
    height: 680px;
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
    z-index: 9;
  `;
  
  export default FormModal;