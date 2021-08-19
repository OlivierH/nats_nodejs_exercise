const express = require('express')
const app = express()
const port = 3000
const { connect, StringCodec } = require("nats");

async function main() {
// to create a connection to a nats-server:
const nc = await connect({ servers: "127.0.0.1:4222" });

// create a codec
const sc = StringCodec();
// create a simple subscriber and iterate over messages
// matching the subscription
const sub = nc.subscribe("hello");
(async () => {
  for await (const m of sub) {
    console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
  }
  console.log("subscription closed");
})();

nc.publish("hello", sc.encode("world"));
nc.publish("hello", sc.encode("again"));


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
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
  console.log(`Example app listening at http://localhost:${port}`)
})

}

main();