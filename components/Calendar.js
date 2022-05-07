
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Card, Checkbox, Grid } from "@mui/material";
import EventModal from "./modals/EventModal"
import moment from "moment";
import React, {useState, useEffect} from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

//Returns an array of events given an array of calendars from the google
//calendar api and an array of selected accounts
function getEvents(calendars, selected) {
  console.log(calendars)
  const newEvents = []
  try{
    //check if any calendars are available
    if(calendars.length){
      //make a new list of only the selected calendars
      var newCal = []
      selected.map(sel=>{
        calendars.find(cal=>{
          if(cal.summary==sel.email)
            newCal.push(cal)
       })
      })
      //Map events from selected calendars into an array of events
      newCal.map(calendar=>{
          calendar.items.map(data=>{
            //converts googles dateTime to a valid date since date is
            if(data.start.date){
              newEvents.push({
                title: data.summary,
                date: (new Date(data.start.date)).toDateString(),
                start: moment(data.start.date).toDate(),
                end: moment(data.start.date).toDate(),
                allDay: true,
                attendees: data.attendees,
                details: data.description || "",
                address: data.location || "",    
              })
            }
            else{
              newEvents.push({
                title: data.summary,
                date: (new Date(data.start.dateTime)).toDateString(),
                start: moment(data.start.dateTime).toDate(),
                end: moment(data.end.dateTime).toDate(),
                allDay: false,
                attendees: data.attendees,
                details: data.description || "",
                address: data.location || "",    
              })
            }
          })
      })
      return newEvents
    }
  }
  catch(e){
    console.log("Error ocurrred: "+e.msg)
  }
}


//Calendar view that will be exported by the module
export default function BigCalendar({account, calendars}){
  const [editMode, setEditMode] = useState(false);
  const [init, setInit] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState([]); 
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
      date:"",
      startTime:"--:--",
      endTime:"--:--",
  })
  //Initially fills the selected accounts list (select all) and loads the events into the calendar
  //Causes issues...
  if(events != null && !events.length && !selected.length && init == false){
    setInit(true)
    console.log("Reloaded")
    account.users.map(data=>{
      selected.push(data)
    })
    setEvents(getEvents(calendars, selected));
  }

  //When there is a select event this will show the editModal
  const onSelectEvent = data => { 
    console.log(data)
    setEditMode(false);
    setNewEvent(data)
    setShowModal(true);
  }

  const getEventProps = data => {

  }

  //On selecting a slot, will pop open a modal with selected time data prefilled
  const onSelectSlot = data => {
    const momentStart = moment(data.start), 
          momentEnd = moment(data.end);
    setEditMode(true);
    const details = {
      date: momentStart.format("YYYY-MM-DD"),
      start: momentStart.format("HH:mm"),
      end: momentEnd.format("HH:mm"),
    }
    setNewEvent(details)
    setShowModal(true);
  }
  //Handles the click of the Filter View, lets user select which accounts they want to have in their 
  //calendar view.
  const handleClick = (userRow) => {
    var selectedIndex = -1
    selected.find((data, index)=>{
      if(data.email === userRow.email){
        selectedIndex = index
      }        
    });
    var newSelected = [];
    if (selectedIndex == -1) {
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
    setEvents(getEvents(calendars, newSelected));
  };
  //Checkbox function to see if it is in the selected list or not. 
  const isSelected = (email) =>{
    const isSel = selected.find((data)=>{
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
         <Grid container spacing={1}>
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
              style={{ height: "30rem", width: "50rem" }}
            /> 

          </Grid>
          <EventModal 
            show={showModal} 
            onClose={() => setShowModal(false)}
            editing={editMode} 
            payload={newEvent}
            account={account}
          >
          </EventModal>    
          </Grid>
        </div>
    )
}

