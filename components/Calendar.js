import React, {useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import styles from '../styles/custom.module.css'
import NewEventModal from "./EventModal"
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);


export default function BigCalendar(){
    
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [events] = useState([{
      events: 
      {
        title: String,
        start: Date,
        end: Date,
        attendees: {
          name: {
            email:String,
            phoneNum:String,
          },
        },
        emails:{
          email: String,
        },
        allDay: Boolean,
      },
    }]);
    const [newEvent, setNewEvent] = useState({
      event:{
        date:null,
        startTime:"--:--",
        endTime:"--:--",
      }
    })
    //Check maps data to the events list in React Big Calendar
    //googleCalEvents will instead be called from here through the Cloudflare api
    /*
    var len = 0;
    try{
        if(googleCalEvents.length>0){ 
          len = googleCalEvents.length
          if(events.length-1 != googleCalEvents.length){
          googleCalEvents.map(data=>{
              events.push({
                  title: data.summary,
                  start: (new Date(data.start.dateTime || data.start.date)),
                  end: (new Date(data.start.dateTime ? (data.end.dateTime) : (data.start.date) )) ,
                  allDay: (data.start.dateTime ? (false) : (true) )   
              })
          })
          console.log(events)
        }
      }
    } catch (error){
      console.log(error)
    }
    */
    //When there is a select event this will show the editModal
    const onSelectEvent = data => { 
      
    }
    
    const onSelectSlot = data => {
      setEditMode(true);
      try{
        const momentStart = moment(data.start), 
            momentEnd = moment(data.end);
        setNewEvent({
            event:
            {
              date: momentStart.format("YYYY-MM-DD"),
              start: momentStart.format("HH:mm"),
              end: momentEnd.format("HH:mm"),
            }
          })
        setShowModal(true);
      }
      catch (err){
        console.log(err)
      }
    }
    //Return the calendar if events are not empty, else 
    return (
        <>
            <div className={styles.calendar}>
            <Calendar
                    defaultDate={moment().toDate()}
                    defaultView="month"
                    drilldownView='day'
                    views={['month','day','week']}
                    events={events}
                    localizer={localizer}
                    selectable={true}
                    onSelectSlot={(slotInfo)=>{onSelectSlot(slotInfo)}}
                    onSelectEvent={(event)=>{onSelectEvent(event)}}
                    onDoubleClickEvent={(event)=>{onSelectEvent(event)}}
                    style={{ height: "550px" }}
            />          
            </div> 
            <div>
                <NewEventModal show={showModal} onClose={() => setShowModal(false)}
                    editing={editMode} payload={newEvent}>
                </NewEventModal>    
            </div>
        </>
    )
}