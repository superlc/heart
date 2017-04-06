/**
 * Created by cluo on 2017/4/4.
 */
var express = require('express');
var router = express.Router();
const https = require('https');
const http = require('http');
const querystring = require('querystring');
const url = require('url');
const pinyin = require('node-pinyin');

const MAP_KEY = 'QB3BZ-KK3WU-ABOVH-2FSPJ-4MKJS-57BMZ';
const WEATHER_KEY = '435292af43a44b7d96eedf1407acb0b2';

/* GET home page. */
router.get('/', function(request, response, next) {
    var params = url.parse(request.url,true).query;
    //维度
    var lat = params.lat || '22.543099'
    //经度
    var lng = params.lng || '114.05786'

    //是否查询实时天气
    var path = params.now == 1 ? '/v5/now' : '/v5/weather';

    getCity(lat,lng,function (location) {
        //response.send(location)
        var city = location.result.address_component.city;
        var cityPinyin = pinyin(city,{
            style: 'normal'
        });

        var cityStr = '';
        for(var i = 0 ; i < cityPinyin.length - 1 ; i++){
            cityStr = cityStr + cityPinyin[i][0]
        }

        getWeatherInfo(cityStr,path,function (weather) {
            response.send(weather)
        })
    })
});

function getWeatherInfo(city,path,cb) {

    var postData = querystring.stringify({
        key: WEATHER_KEY,
        city : city
    });

    console.log(postData)

    var options = {
        hostname: 'free-api.heweather.com',
        port: 443,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    var req = https.request(options, (res) => {
        res.on('data', (d) => {
            cb(d)
        });
    });
    req.on('error', (e) => {
        console.error(e);
    });
    req.write(postData);

    console.log(req)
    req.end();
}

function getCity(lat,lng,cb) {
    http.get(`http://apis.map.qq.com/ws/geocoder/v1/?location=${lat},${lng}&key=${MAP_KEY}`,function (res) {
        res.on('data',function (chunck) {
            var location = JSON.parse(chunck.toString());
            cb(location);
        })
    }).on('error',function (err) {
        console.log(err)
    })
}

module.exports = router;
