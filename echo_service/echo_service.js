const { connect, } = require("nats");

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

const sub = nc.subscribe("echo");
(async (sub) => {
  console.log(`listening for ${sub.getSubject()} requests...`);
  for await (const m of sub) {
    m.respond(m.data);
  }
})(sub);
})()