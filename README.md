This is a [Next.js](https://nextjs.org/) project bootstrapped with MUI (Material UI). (This is still a work in progress) 

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn i
```
You will need to add the following to your .env file in order to start development.
NEXTAUTH_SECRET: For nextAuth hashing, you can create one using the command...

```bash
openssl rand -base64 32
```

MONGODB_URI: URI of your MongoDB instance
NEXTAUTH_URL: redirect URL for nextAuth after authenticating the user

Google is paired with nextAuth for authenticating the users using the interface. You will need to setup an OAuth consent screen and download an api key. Since the users logging into the interface will not be using their accounts for any actions, you only need access to their name and email for OAuth. Once you have the api key, place the respective information into the GOOGLE_SECRET and GOOGLE_ID environment variables.

For the backend, you will need a google service account and credentials for it. This service account handles all calendar changes and updates. After you create the service account and download a credential file, set the CRED_PATH evironment variable to the path of your cred.json file.


Finally, run the development server
```bash
npm run dev
# or
yarn run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.
