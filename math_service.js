const { connect, StringCodec} = require("nats");

const sc = StringCodec();

(async () => {

const nc = await connect({ servers: "127.0.0.1" });

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