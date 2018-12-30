
require('dotenv').load();
describe('Test Suite', function() {
  
  it('We should be able to reach the internet', function () {

    function checkInternet(cb) {
      require('dns').lookup('google.com',function(err) {
            if (err && err.code == "ENOTFOUND") {
                cb(false);
            } else {
                cb(true);
            }
        })
    }

    // example usage:
    checkInternet(function(isConnected) {
      isConnected.should.equal(true);
    });
    
  });
});