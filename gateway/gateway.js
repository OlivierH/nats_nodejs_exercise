const express = require('express')
const app = express()
const port = 3000
const { connect, StringCodec } = require("nats");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

async function connectToNatsServer() {
  try{
    // to create a connection to a nats-server:
    return await connect({ servers: "http://nats_server" });
  } catch (error) {
    return null;
  }
}

async function connectToNatsServerWithRetries() {
  while(true) {
    const nc = await connectToNatsServer();
    if(nc !== null) {
      return nc;
    }
    console.log("Couldn't connect to nats server, waiting 5 seconds before retrying.");
    await sleep(5000);
  }
}



async function main() {
const nc = await connectToNatsServerWithRetries();

if(nc === null) {
  console.error("Error: Couldn't connect to the nats server.");
  process.exit(1);
}

// create a codec
const sc = StringCodec();
  
app.get('/math/substract/:a/:b', (req, res) => {
    const a = req.params.a
    const b = req.params.b    
    if(isNaN(a) || isNaN(b)) {
        res.status(400);
        res.send('Substracts only accept numeric parameters.'); 
        return;
    }
    nc.request("math.substract", sc.encode(JSON.stringify({"a": a, "b": b})))   .then((m) => {
        res.send(sc.decode(m.data));
      })
      .catch((err) => {
        console.log(`problem with request: ${err.message}`);
      });  })
  app.get('/math/divide/:a/:b', (req, res) => {
    const a = req.params.a
    const b = req.params.b    
    if(isNaN(a) || isNaN(b)) {
        res.status(400);
        res.send('Divide only accept numeric parameters.'); 
        return;
    }
    if(b == 0) {
        res.status(400);
        res.send('Divide second parameter cannot be zero.'); 
        return;
    }
    
    nc.request("math.divide", sc.encode(JSON.stringify({"a": a, "b": b})))
    .then((m) => {
        res.send(sc.decode(m.data));
      })
      .catch((err) => {
        console.log(`problem with request: ${err.message}`);
      });
  })
  app.get('/echo/:str', (req, res) => {
    nc.request("echo", sc.encode(req.params.str))
    .then((m) => {
        res.send(sc.decode(m.data));
      })
      .catch((err) => {
        console.log(`problem with request: ${err.message}`);
      });
    
  })

  app.listen(port, () => {
    console.log(`Gateway is up and running at http://localhost:${port}`)
  })
  

}

main();