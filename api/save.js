const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  oAuth2Client.setCredentials(JSON.parse(process.env.TOKEN));
  callback(oAuth2Client);
}

const spreadsheetId = '1GV5Uv98N_0Q_m0fVRqVPZO0-fMljM1RIU8lBjcw3nWo';
function saveAnswers(auth, answers, callback) {
  const sheets = google.sheets({ version: 'v4', auth });
  let values = [answers];
  let resource = {
    values,
  };
  sheets.spreadsheets.values.append(
    {
      spreadsheetId,
      range: 'Blad1',
      valueInputOption: 'RAW',
      resource,
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const data = res.data;
      if (data) {
        callback();
      } else {
        console.log('No data found.');
      }
    }
  );
}

module.exports = async (req, res) => {
  const answers = req.body.answers;
  authorize(JSON.parse(process.env.CREDENTIALS), auth => {
    saveAnswers(auth, answers, () => {
      res.json({
        success: true,
      });
    });
  });

  // res.json({
  //   body: req.body,
  //   query: req.query,
  //   cookies: req.cookies,
  //   ...process.env
  // });
};
