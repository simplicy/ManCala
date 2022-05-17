
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Card, Checkbox, colors, Grid } from "@mui/material";
import EventModal from "./modals/EventModal"
import moment from "moment";
import React, {useState, useEffect} from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCallback } from "react";
import { Toaster } from "react-hot-toast";
import { useRouter } from 'next/router';
import { DisabledByDefault } from "@mui/icons-material";
const localizer = momentLocalizer(moment);

var eventColors = []
//Returns an array of events given an array of calendars from the google
//calendar api and an array of selected accounts
function getEvents(calendars, selected) {
  const getColor = (email) => {
    for(let i = 0; i<eventColors.length;i++){
      if(email==eventColors[i].email){
        return eventColors[i].color
      }
    }
    return "darkgrey"
  }
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
            var eventColor = getColor(data.organizer.email);
            //console.log(eventColor)
            if(data.start.date){
              newEvents.push({
                eventID: data.id,
                title: data.summary,
                date: (new Date(data.start.date)).toDateString(),
                start: moment(data.start.date).toDate(),
                end: moment(data.start.date).toDate(),
                organizer: data.organizer.email,
                allDay: true,
                attendees: data.attendees,
                details: data.description || "",
                address: data.location || "",
                color: eventColor,

              })
            }
            else{
              newEvents.push({
                eventID: data.id,
                title: data.summary,
                date: (new Date(data.start.dateTime)).toDateString(),
                start: moment(data.start.dateTime).toDate(),
                end: moment(data.end.dateTime).toDate(),
                organizer: data.organizer.email,
                allDay: false,
                attendees: data.attendees,
                details: data.description || "",
                address: data.location || "",
                color: eventColor,
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
  const router = useRouter();
  const [disabled, setDisabled] = useState([])
  const [newEventMode, setNewEventMode] = useState(false);
  const [init, setInit] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState([]); 
  const [events, setEvents] = useState([]);
  const [workingCals, setWorkingCals] = useState(calendars)
  const [newEvent, setNewEvent] = useState({
      date:"",
      startTime:"--:--",
      endTime:"--:--",
  })
  //Initially fills the selected accounts list (select all) and loads the events into the calendar
  //Causes issues...
  //check if calendar is empty and if it is disable ability to check off user on filter view
  //Also make sure routes are checked so non admins do not have access to dashboard
  //make first user to login with google the admin. lock down admin routes. 
  if(calendars.length && events != null && 
    !events.length && !selected.length && 
    init == false){
    setInit(true)
    account.users.map(data=>{
      if(eventColors.length<account.users.length)
        eventColors.push({email:data.email,color:'#'+Math.floor(Math.random()*16777215).toString(16)})
      selected.push(data)
    })
    calendars.map(cal =>{
      console.log(cal)
      if(cal.items.length==0){
        disabled.push(cal.summary)
        console.log(document.getElementById(cal.summary))
      }
    })
    console.log(disabled)
    setEvents(getEvents(workingCals, selected));
  }

  //When there is a select event this will show the editModal
  const onSelectEvent = data => {
    //check to make sure that the event is one of the account users
    console.log("selected")
    setNewEventMode(false);
    setNewEvent(data)
    setShowModal(true);
  }
  
  //Props for events in the calendar, can set styles from here
  const eventPropGetter = useCallback(
    (event, color, end, isSelected) => ({
      ...(isSelected && {
        style: {
          backgroundColor: '#000',
        },
      }),
      ...(!isSelected && {
        style: {
          backgroundColor: event.color,
        }}),
      ...(event.color=="darkgrey" && {
        style:{
          backgroundColor:"darkgrey",
          pointerEvents: "none"
        }
      })
    }),
    []
  )

  //fetches the events again from google after they have been updated. 
  //Could be cut out and made quicker by locally updating the events list
  //Then the fetch is only done on initial load
  const reloadEvents = async () => {
    const userEmails = account.users.map(data =>{
      return data.email
    }).join(",")
  
    const api = await fetch('http://localhost:3000/api/calendars/?emails='+userEmails, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const apiResponse = await (api.json())
    const newCals = await apiResponse.data;
    setWorkingCals(newCals)
    setEvents(getEvents(newCals, selected));
  }
  const isDisabled = (email) =>{
    for(let i=0;i<disabled.length;i++){
      if(disabled[i] == email)
        return true
    }
    return false
  }
  //On selecting a slot, will pop open a modal with selected time data prefilled
  const onSelectSlot = data => {
    const momentStart = moment(data.start), 
          momentEnd = moment(data.end);
    setNewEventMode(true);
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
      if(data.email === userRow.email && document.getElementById(userRow.email)){
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
    setEvents(getEvents(workingCals, newSelected));
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
        <>
          <Toaster/>
         <Grid container  spacing={1}>
         <Grid item  xs={2}>
         <h4 style={{padding:"10px", marginLeft: "10px"}}>Filter View</h4>
         <div overflow="hidden" style={{maxHeight:"25rem", overflowY: "auto"}}>
          {account.users?.map((userRow, index) => {
            const isItemSelected = isSelected(userRow.email)
            const isItemDisabled = isDisabled(userRow.email)
            return (
              <Card key={index} style={{padding:"10px", margin: "10px"}}>
                <Grid  container  spacing={2} onClick={()=> {if(!isDisabled(userRow.email)){handleClick(userRow)}}}>
                  <Grid item xs={6}>
                    {userRow.name}
                  </Grid>
                  <Grid item xs={6}>
                    <Checkbox key={index} id={userRow.email} disabled={isItemDisabled} checked={isItemSelected} color="primary" />
                  </Grid>
                </Grid>
              </Card>
            )                          
            })}
         </div>
          </Grid>    
          <Grid item xs={10}>

            <Calendar
              defaultDate={moment().toDate()}
              defaultView="month"
              drilldownView='day'
              views={['month','day','week']}
              eventPropGetter={eventPropGetter}
              events={events}
              localizer={localizer}
              selectable={true}
              onSelectSlot={(slotInfo)=>{onSelectSlot(slotInfo)}}
              onSelectEvent={(event)=>{onSelectEvent(event)}}
              onDoubleClickEvent={(event)=>{onSelectEvent(event)}}
              style={{ height: "30rem", width: "50rem" }}
            /> 

          </Grid>
          <EventModal 
            show={showModal} 
            onClose={() => setShowModal(false)}
            newEventMode={newEventMode} 
            payload={newEvent}
            reloadEvents={() => reloadEvents()}
            account={account}
          >
          </EventModal>    
          </Grid>
        </>
    )
}

