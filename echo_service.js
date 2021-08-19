const { connect, } = require("nats");

(async () => {
const nc = await connect({ servers: "127.0.0.1" });

const sub = nc.subscribe("echo");
(async (sub) => {
  console.log(`listening for ${sub.getSubject()} requests...`);
  for await (const m of sub) {
    m.respond(m.data);
  }
})(sub);
})()