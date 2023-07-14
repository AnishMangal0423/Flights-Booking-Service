const express = require("express");
const { Server_config} = require("./config");
const mountRoutes = require("./routes");


const app = express();

app.get("/", (req, res) => {
  res.json({
    name: "Anish",
    fg: "Pranu Bhandari",
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mountRoutes);



app.listen(Server_config.PORT, function exec() {
  console.log(`Starting My server at Port ${Server_config.PORT}`);
});
