
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Card, Checkbox, Grid } from "@mui/material";
import EventModal from "./modals/EventModal"
import moment from "moment";
import React, {useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function loadEvents(events, calendars) {
  try{
    if(calendars.length){
      calendars.map(data=>{
        data.items.map(data=>{
          events.push({
            title: data.summary,
            start:data.start.dateTime || data.start.date,
            end: (data.start.dateTime ? (data.end.dateTime) : (data.start.date) ) ,
            allDay: (data.start.dateTime ? (false) : (true) ),
            attendees: data.attendees,
            details: data.description || "",
            address: data.location || "",    
          })
        })
      })
    }
  }
  catch(e){
    console.log("Error ocurrred: "+e.msg)
  }
}



export default function BigCalendar({account, calendars}){
  const [filters, setFilters] = useState([])
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState([]); 
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    event:{
      date:null,
      startTime:"--:--",
      endTime:"--:--",
    }
  })
  if(!events.length){
    calendars.map(data=>{
      filters.push(data)
    })
    account.users.map(data=>{
      selected.push(data)
    })
    console.log(selected)
    loadEvents(events, filters);
  }

    //When there is a select event this will show the editModal
  const onSelectEvent = data => { 
    console.log(data)
  }

  const getEventProps = data => {

  }
  const handleChange = data => {
    console.log("Change made!")
  }

  const onSelectSlot = data => {
    console.log(selected)
    const momentStart = moment(data.start), 
          momentEnd = moment(data.end);
    setEditMode(true);
    const details = {
      event:
      {
        date: momentStart.format("YYYY-MM-DD"),
        start: momentStart.format("HH:mm"),
        end: momentEnd.format("HH:mm"),
      }
    }
    setNewEvent(details)
    setShowModal(true);
  }

  const handleClick = (userRow) => {
    const selectedIndex = selected.find((data, index)=>{
      if(data.email==userRow.email){
        return index
      }        
    }) || -1;

    console.log(selectedIndex)
    console.log(selected)
    var newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, userRow);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (email) =>{
    const isSel = selected.find((data)=>{
      //console.log(data.summary==email)
      if(data.email==email)
       return true;
     return false;
    })
     if(typeof isSel == 'undefined')
       return false;
     return true;
   }
    //Return the calendar if events are not empty, else 
    return (
        <div>
         <Grid container spacing={2}>
         <Grid item xs={2}>
         <h4 style={{padding:"10px", marginLeft: "10px"}}>Filter View</h4>
         {account.users?.map((userRow, index) => {
           const isItemSelected = isSelected(userRow.email)
           return (
            <Card key={index} style={{padding:"10px", margin: "10px"}}>
              <Grid  container spacing={2} onClick={()=> handleClick(userRow)}>
                <Grid item xs={6}>
                  {userRow.name}
                </Grid>
                <Grid item xs={6}>
                  <Checkbox key={index} checked={isItemSelected} color="primary" />
                </Grid>
              </Grid>
            </Card>
           )                          
          })}
          </Grid>    
          <Grid item xs={10}>

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
              eventPropGetter={(event)=>{getEventProps(event)}}
              style={{ height: "30rem", width: "35rem" }}
            /> 

          </Grid>
          <EventModal show={showModal} onClose={() => setShowModal(false)}
              editing={editMode} payload={newEvent}>
          </EventModal>    
          </Grid>
        </div>
    )
}

