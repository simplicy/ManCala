This is a [Next.js](https://nextjs.org/) project bootstrapped with MUI (Material UI). (This is still a work in progress) 

## Getting Started

First, install the dependencies:

```bash
yarn i
```
You will need to add the following to your .env file in order to start development.

NextAuth is used for authentication and it needs NEXTAUTH_SECRET set as an environment variable, you can create one using the command...

```bash
openssl rand -base64 32
```

Place the URI of your MongoDB instance in the MONGODB_URI environment variable. Before you enter production change the NEXTAUTH_URL from https://localhost:3000 to your apps URL. 

Google is paired with nextAuth for authenticating the users using the interface. You will need to setup an OAuth consent screen (Internal and testing only) and download an API key. Since the users logging into the interface will not be using their accounts for any actions, you only need access to their name and email for OAuth. Once you have the API key, place the respective information into the GOOGLE_SECRET and GOOGLE_ID environment variables.

For the backend, you will need a google service account and credentials for it. This service account handles all calendar changes and updates. After you create the service account and download a credential file, set the CRED_PATH evironment variable to the path of your cred.json file.


Finally, run the development server
```bash
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

## Usage

To start managing calendars, the client (user whos calendar is to be managed) should share their desired calendar to your service account email with editing access. Once that is done, you can create an "Account" or Group in the Dashboard. Once an Account is created you can add client to it. The client will be the individuals who shared their calendars to the service account. You can group as many client and have the same users in multiple accounts. 

The users logging into the interface will use their domain google account. Once on the homepage they can go to any created account and start managing client calendars. They can update, delete, and create new events using the service account as a middle-man. No need to share passwords or have everyone share their calendar to several people. 

## Known Issues

1. Currently there is an issue with how the dashboard is handled. It currently does not update live when a user is added.
2. Logging is a little broken and not as clean as I would like. This will be fixed in a future update. 
3. Attendee adding does not work currently because of google policy. Alternatives are being looked into. 
