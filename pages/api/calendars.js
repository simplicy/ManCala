const path = require('path');
const {google} = require('googleapis');
// place holder for the data
const users = [];
//------------------Functions----------------------------//

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
    const gClient = await getCalendarClient();
    //Check if the calendar is shared with the service account
    const eventList = await Promise.all(emails.map(async email =>{
        const response = await gClient.events.list({
            calendarId: email,
            timeMin: (new Date()).toISOString(),
            maxResults: 5,
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

const createAccount = async(req,res) => {
    
} 

const deleteAccount = async(req,res) => {
    
}

const updateAccount = async(req,res) => {

}
    

const methods = {
    GET: getEvents,
    PUT: updateAccount,
    POST: createAccount,
    DELETE: deleteAccount,
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

