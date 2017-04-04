/**
 * Created by cluo on 2017/4/4.
 */
var express = require('express');
var router = express.Router();
const https = require('https');
const querystring = require('querystring');
const url = require('url');

/* GET home page. */
router.get('/', function(request, response, next) {
    var params = url.parse(request.url,true).query;
    var city = params.city || 'shenzhen';

    console.log(city)

    var postData = querystring.stringify({
        key:'435292af43a44b7d96eedf1407acb0b2',
        city : city
    });

    var options = {
        hostname: 'free-api.heweather.com',
        port: 443,
        path: '/v5/weather',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    var req = https.request(options, (res) => {

        res.on('data', (d) => {
            response.send(JSON.parse(d))
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });

    req.write(postData);

    req.end();

});

module.exports = router;
