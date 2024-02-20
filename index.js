const express = require('express');
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');

const app = express();
const port = 3000; // The port on which the server will be running

// Your Agora App ID and App Certificate from the Agora.io Dashboard
const appId = '52106f5b442a4cbb8e7c507b661e33f9';
const appCertificate = '567d3cba70214ff3ac32fbb26ccfcb67';

app.use(express.json());

// Endpoint to generate Agora token
// Assuming you have a function to validate user and channel
const isValidUserForChannel = async (userId, channelName) => {
  // Implement your logic here
  // For example, check against a database or a list
  // Return true if valid, false otherwise
  return true; // Placeholder
};

app.get('/api/agora-credentials', async (req, res) => {
  try {
    const userId = req.query.userId; // Assume userId is passed as a query parameter
    const channelName = req.query.channelName || 'testChannel';

    // Validate user for the channel
    const isValidUser = await isValidUserForChannel(userId, channelName);
    if (!isValidUser) {
      return res.status(403).json({error: 'Unauthorized access'});
    }

    // Continue with token generation if user is valid
    const uid = 0; // You might want to use the actual userId here if managing users on Agora's side
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs,
    );

    res.json({
      appId,
      channel: channelName,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error generating token'});
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
