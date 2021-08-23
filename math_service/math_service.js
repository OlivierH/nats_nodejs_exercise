const { connect, StringCodec} = require("nats");

const sc = StringCodec();

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


(async () => {

const nc = await connectToNatsServerWithRetries();

if(nc === null) {
  console.error("Error: Couldn't connect to the nats server.");
  process.exit(1);
}

const sub_substract = nc.subscribe("math.substract");
(async (sub_substract) => {
  console.log(`listening for ${sub_substract.getSubject()} requests...`);
  for await (const m of sub_substract) {
      params = JSON.parse(sc.decode(m.data));
      m.respond(sc.encode(Number(params.a)-Number(params.b)));
  }
})(sub_substract);

const sub_divide = nc.subscribe("math.divide");
(async (sub_divide) => {
  console.log(`listening for ${sub_divide.getSubject()} requests...`);
  for await (const m of sub_divide) {
    params = JSON.parse(sc.decode(m.data));
    m.respond(sc.encode(Number(params.a)/Number(params.b)));  }
})(sub_divide);


})()