const https = require('https');
const fs = require('fs');
const config = require('config');
const reach = require('@helios-interactive/reachjs');

const url = config.get('reach.url');
const api_key = config.get('reach.api_key');
const activationId = config.get('reach.activationId');

reach.setUrl(url);
reach.key = api_key;

const files = [];

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
    'meta.activationId': activationId,
    'meta.type': { nlike: 'waiver' },
  },
}, (err, res) => {
  if (err) return console.log(err);

  (function loop (i) {
    setTimeout(function () {
       request(res.body[i]);
       //decrement i and call the loop again if i > 0
       if (--i) loop(i);
    }, 2000)
    //pass the number of iterations as an argument
  })(res.body.length);
});

