let express = require("express"),
path = require('path'),
bodyParser = require('body-parser')
cors = require('cors'),
https = require('https');

let app = express();
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}))
app.use(express.static('src'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.get('/invoices', function(req, res){
    res.sendFile(path.join(__dirname,'/src/invoices.html'))
})
app.get('/invoices-list', function(req, res){
    let request = https.request({
        protocol:'https:',
        port: 443,
        hostname: 'api-et.hellocash.net',
        path: '/invoices',
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcmluY2lwYWwiOiIxMjQ4MzQwIiwic3lzdGVtIjoibHVjeSIsImdyb3VwIjoiYnVzaW5lc3MiLCJ1c2VybmFtZSI6IjEyNDgzNDAiLCJjaGFpbiI6WyJwYXNzd29yZCJdLCJpYXQiOjE2MDc2NzE2MzMsImV4cCI6MTYwNzc1ODAzM30.UCE39fjxInuxgs41AoajVoYYlf341xlknNIFwfvPX3U'
        }
    }, response => {
        let requestBody = [];
        response.on('data', data => {
            requestBody.push(data)
        })
        response.on('end', () => {
            let data = Buffer.concat(requestBody).toString()
            console.log(data)
            res.send(data)
        });
    })
      
    request.on('error', error => {
        console.error(error)
        res.send(error)
    })
    
    request.end()
})
app.post('/buy-now', async function (req, res) {
    let Now = new Date()
    let request = https.request({
        protocol:'https:',
        port: 443,
        hostname: 'api-et.hellocash.net',
        path: '/invoices',
        method: 'POST',
        json: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcmluY2lwYWwiOiIxMjQ4MzQwIiwic3lzdGVtIjoibHVjeSIsImdyb3VwIjoiYnVzaW5lc3MiLCJ1c2VybmFtZSI6IjEyNDgzNDAiLCJjaGFpbiI6WyJwYXNzd29yZCJdLCJpYXQiOjE2MDc2NzE2MzMsImV4cCI6MTYwNzc1ODAzM30.UCE39fjxInuxgs41AoajVoYYlf341xlknNIFwfvPX3U'
        }
    }, response => {
        let requestBody = [];
        response.on('data', data => {
            requestBody.push(data)
        })
        response.on('end', ()=>{
            let data = Buffer.concat(requestBody).toString()
            console.log(data)
            res.send(data)
        });
    })
      
    request.on('error', error => {
        console.error(error)
        res.send(error)
    })
    
    let data = JSON.stringify({    
        "amount": parseInt(req.body.Price),
        "description": `Hi ${req.body.BuyerName} | You have ${req.body.Price}Birr Payment for ${req.body.Name}(${req.body.Description}) item.`,
        "from": `+251${req.body.PhoneNumber}`,
        "currency": "ETB",
        "tracenumber": `Biruk_invoice-${""+Now.getHours()+""+Now.getMinutes()+""+Now.getSeconds()+""}`,
        "notifyfrom": true,
        "notifyto": true,
        "expires": `${new Date(Now.setDate(Now.getDate() + 30)).toISOString()}`
    });

    request.write(data);

    request.end()
});
let server = app.listen(8081, function(){
    let port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});
