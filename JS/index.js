const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json()) 
app.use(cors());

const PORT = 4001

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
})

app.post('/api-network/request', (req,res)=>{
    const data = req.body
    console.log(data)
    //fetch required request 
    const requestOptions = {
        method: data.Method
    }
    if (data.Body){
        requestOptions.body = data.Body
    }
    fetch(data.Endpoint, requestOptions)
    .then((newRes) => { 
        newRes.text()
        .then(text => {
            res.send({status:newRes.status, statusText: newRes.statusText, text:text});
        })
        .catch(_ => {
            newRes.json()
            .then(json => {
                res.send({status:newRes.status, statusText: newRes.statusText, json:json});
            })
        })
    })
    .catch(err => {
        res.status(500).send(err)
    })
})

//Tell server your online
const TARGET_IP = "127.0.0.1"
const TARGET_PORT = "4000"
const requestOptions = {
    method:"POST",
    body:JSON.stringify(
        {
            port:PORT.toString(),
            //ip: "" - use to set custom ip
        }
    ),
    redirect: 'follow',
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
}
fetch(`http://${TARGET_IP}:${TARGET_PORT}/api/healthcheck`, requestOptions)
.then(response => response.text())
.then(result => console.log(result))
.catch(error => console.log('error', error));