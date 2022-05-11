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
    const eventList = await Promise.all(emails.map(async email =>{
        const response = await gClient.events.list({
            calendarId: email,
            timeMin: (new Date()).toISOString(),
            maxResults: 366,
            singleEvents: true,
            orderBy: 'startTime',
        });
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

const createEvent = async(req,res) => {
    if(!gClient)
        gClient = await getCalendarClient();
    console.log(req)
    // var event = {
    //     'summary': 'Google I/O 2015',
    //     'location': '800 Howard St., San Francisco, CA 94103',
    //     'description': 'A chance to hear more about Google\'s developer products.',
    //     'start': {
    //       'dateTime': '2015-05-28T09:00:00-07:00',
    //       'timeZone': 'America/Los_Angeles',
    //     },
    //     'end': {
    //       'dateTime': '2015-05-28T17:00:00-07:00',
    //       'timeZone': 'America/Los_Angeles',
    //     },
    //     'attendees': [
    //       {'email': 'lpage@example.com'},
    //       {'email': 'sbrin@example.com'},
    //     ],
    //     'reminders': {
    //       'useDefault': false,
    //       'overrides': [
    //         {'method': 'email', 'minutes': 24 * 60},
    //         {'method': 'popup', 'minutes': 10},
    //       ],
    //     },
    //   };
    calendar.events.insert({
        auth: auth,
        calendarId: 'primary',
        resource: event,
      }, function(err, event) {
        if (err) {
          res.status(500).send({
            success:false,
            message:
              err.message || "Some error occurred while deleting events."
          });
        }
        res.status(200).send({
            success:true,
            message:
              "Event sucessfully deleted!"
          });
      });
} 

const deleteEvent = async(req,res) => {
    if(!gClient)
        gClient = await getCalendarClient();
    try {
        var event = req.query.id
        var calendarId = req.query.account
        var result = await gClient.events.delete({calendarId: calendarId, eventId: event,});
        result;
        res.status(200).send({
            success: true,
            message: "Event sucessfully deleted!",
        })
        
    }  catch (error) {
        res.status(500).send({
            success:false,
            message:
              error.message || "Some error occurred while retrieving events."
          });
    }
        
}

const updateAccount = async(req,res) => {

}
    

const methods = {
    GET: getEvents,
    PUT: updateAccount,
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

