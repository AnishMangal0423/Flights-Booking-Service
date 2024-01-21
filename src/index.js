const express = require("express");
const { Server_config , Queue} = require("./config");
const mountRoutes = require("./routes");
const Cron = require('./utils/common/cron-jobs')

const app = express();

const timeout = require('connect-timeout');
// Set a higher timeout value (in milliseconds)
app.use(timeout('60s'));

app.get("/", (req, res) => {
  res.json({
    name: "Anish",
    fg: "Inside Booking-servic",
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mountRoutes);

app.use('/bookingService/api', mountRoutes)



app.listen(Server_config.PORT, async function exec() {
  console.log(`Starting My server at Port ${Server_config.PORT}`);
  Cron();
  await Queue.connectQueue();

});
