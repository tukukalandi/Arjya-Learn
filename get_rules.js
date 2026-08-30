const { google } = require('googleapis');
async function run() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/datastore']
  });
  const client = await auth.getClient();
  const url = `https://firestore.googleapis.com/v1/projects/gen-lang-client-0417841512/databases/ai-studio-5a950ff3-89b9-40a0-beb5-a8238168aa4b/securityRules`;
  // wait, the API to get rules is firebaserules.googleapis.com
  // Let's just try deploying with `deploy_firebase` tool after checking the tool's logs, if any.
}
