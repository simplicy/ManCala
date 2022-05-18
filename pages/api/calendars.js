import { interpolateAs } from 'next/dist/shared/lib/router/router';

const path = require('path');
const {google} = require('googleapis');
// place holder for the data
const users = [];
//------------------Functions----------------------------//
var gClient;
//More error logging needed
async function getCalendarClient(){
  // Create a new JWT client using the key file downloaded from the Google Developer Console
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.env.CRED_PATH, 'cred.json'),
    scopes: 'https://www.googleapis.com/auth/calendar',
  });

  const client = await auth.getClient();
  // Obtain a new calendar client, making sure you pass along the auth client
  const calendarClient = await google.calendar({
    version: 'v3',
    auth: client,
  });
  return calendarClient;
}

async function getCalendarEvents(emails) {
    if(!gClient)
        gClient = await getCalendarClient();
    //Check if the calendar is shared with the service account
    var ourDate = new Date();
    //Change it so that it is 7 days in the past.
    var pastDate = ourDate.getDate() - 30;
    ourDate.setDate(pastDate);
    const eventList = await Promise.all(emails.map(async email =>{
        const response = await gClient.events.list({
            calendarId: email,
            timeMin: ourDate.toISOString(),
            maxResults: 200,
            singleEvents: true,
            orderBy: 'startTime',
        }).catch(err =>{
            console.log("No account found")
            return ({
                data:{
                    summary: email,
                    items: []
                }                
            })})
        //console.log(response)
        return response.data
    }))
    return eventList
}

const getEvents = async(req,res) => {
    console.log("Getting Events")
    const emails = req.query.emails.split(",")
    try {
        const events = await getCalendarEvents(emails);
        res.status(200).send({
            success: true,
            data: events,
        })
        
    }  catch (error) {
        res.status(500).send({
            success:false,
            message:
              error.message || "Some error occurred while retrieving events."
          });
    }
}

const createEvent = async (req,res) => {
    var payload = req.body;
    var locale = "";
    var address = payload.addr1;
    if(payload.addr2 != "")
        address = address+', '+payload.addr2;
    if(payload.addr1 && payload.city && payload.state && payload.zip)
        locale = (address+','+payload.city+', '+payload.state+' '+payload.zip);
    console.log(payload)
    var event = {
        'summary': payload.eventTitle,
        'location':  locale,
        'description': payload.details,
        'start': {
          'dateTime': (new Date(Date.parse(payload.date+'T'+payload.startTime))),
          'timeZone': 'America/New_York',
        },
        'end': {
          'dateTime': (new Date(Date.parse(payload.date+'T'+payload.endTime))),
          'timeZone': 'America/New_York',
        },
        'attendees': [],
      };
      if(payload.attendees){
          var attn = payload.attendees.split("\n")
          attn.map(item=>{
              event.attendees.push({email:item})
          })
      }
    if(!gClient)
        gClient = await getCalendarClient();
    try{   
        var result = await gClient.events.insert({calendarId: payload.organizer,resource: event,});
        console.log(result)
        if(result.status==200)
            res.status(200).send({
                success: true,
                message: "Event sucessfully created!",
            })
        else
            res.status(500).send({
                success: false,
                message: "Some error occurred during the update process. Please try again later.",
            })
    } catch  (error) {
        res.status(500).send({
            success:false,
            message:
              error.message || "Some error occurred while retrieving events."
          });
    }
   
} 

const deleteEvent = async(req,res) => {
    if(!gClient)
        gClient = await getCalendarClient();
    try {
        var event = req.query.id
        var calendarId = req.query.account
        var result = await gClient.events.delete({calendarId: calendarId, eventId: event,});
        if(result.status==204)
            res.status(200).send({
                success: true,
                message: "Event sucessfully deleted!",
            })
        else
            res.status(500).send({
                success: false,
                message: "Some error occurred during the delete process. Please try again later.",
            })
    }  catch (error) {
        res.status(500).send({
            success:false,
            message:
              error.message || "Some error occurred while retrieving events."
          });
    }
        
}

const updateEvent = async(req,res) => {
    var payload = req.body;
    var locale = "";
    var address = payload.addr1;
    if(payload.addr2 != "")
        address = address+', '+payload.addr2;
    if(payload.addr1 && payload.city && payload.state && payload.zip)
        locale = (address+','+payload.city+', '+payload.state+' '+payload.zip);
    const eventID = req.query.eventId;
    var event = {
        'summary': payload.eventTitle,
        'location':  locale,
        'description': payload.details,
        'start': {
        'dateTime': (new Date(Date.parse(payload.date+'T'+payload.startTime))),
        'timeZone': 'America/New_York',
        },
        'end': {
        'dateTime': (new Date(Date.parse(payload.date+'T'+payload.endTime))),
        'timeZone': 'America/New_York',
        },
        'attendees': [],
    };
    if(payload.attendees){
        var attn = payload.attendees.split("\n")
        attn.map(item=>{
            event.attendees.push({email:item})
        })
    }
    if(!gClient)
        gClient = await getCalendarClient();
    try{   
        var result = await gClient.events.update({calendarId: payload.organizer,eventId: eventID, resource: event,});
        if(result.status==200)
            res.status(200).send({
                success: true,
                message: "Event sucessfully updated!",
            })
        else
            res.status(500).send({
                success: false,
                message: "Some error occurred during the update process. Please try again later.",
            })
    } catch  (error) {
        res.status(500).send({
            success:false,
            message:
            error.message || "Some error occurred while updating the event."
        });
    }
}
    

const methods = {
    GET: getEvents,
    PUT: updateEvent,
    POST: createEvent,
    DELETE: deleteEvent,
}


export default async function handler(req, res) {
    const { method } = req
    
    const methodHandler = methods[method]


    if (!methodHandler) {
        res.status(400).json({
            success: false,
            message: 'Method not found'
        })
    }

    await methodHandler(req, res)
    
}

export const config = {
    api:{
        externalResolver: true,
    },
}

