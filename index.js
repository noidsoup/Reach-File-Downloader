const https = require('https');
const fs = require('fs');
require('dotenv').config();

const reach = require('@helios-interactive/reachjs');

reach.setUrl(process.env.REACH_URL);
reach.key = process.env.API_KEY;

const request = (file) => {
  if (file === undefined) return;
  const fileObj = fs.createWriteStream(`files/${file.experienceId}.jpg`);
  https.get(file.url, function(response) {
    console.log(`downloading ${file.url}...`);
    response.pipe(fileObj);
  });
};

reach.get('files', {
  limit: 999,
  where: {
    'meta.activationId': process.env.ACTIVATION_ID,
    'meta.type': { nlike: 'waiver' },
  },
}, (err, res) => {
  if (err) return console.log(err);

  (function loop (i) {
    setTimeout(function () {
       request(res.body[i]);
       //decrement i and call the loop again if i > 0
       if (--i) loop(i);
    }, 1000)
    //pass the number of iterations as an argument
  })(res.body.length);
});

