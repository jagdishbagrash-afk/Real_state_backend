const dotenv = require("dotenv");
dotenv.config();

require("./dbconfigration");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  // origin: "*", // Allowed origins
    origin: "https://cadmaxpro.com",  // your frontend domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: '*', // Allow all headers
  credentials: true,
  optionsSuccessStatus: 200, // for legacy browsers
}

app.use(cors(corsOptions));
app.use(express.json({ limit: '5000mb' }));
app.use(express.urlencoded({ extended: true, limit: "5000mb" }));


app.get("/", (req, res) => {
  res.json({
    msg: 'Hello World',
    status: 200,
  });
});


const PORT = process.env.REACT_APP_SERVER_DOMAIN || 5000;
app.use("/api", require("./Routes/AuthRoute"));

app.use("/api", require("./Routes/jobAddRoutes"));
app.use("/api", require("./Routes/ProjectRoute"));
app.use("/api", require("./Routes/teamRoutes"));
app.use("/api", require("./Routes/BlogRoute"));
app.use("/api", require("./Routes/CarrerRoute"));

app.use("/api", require("./Routes/ContactRoute"));


const server = app.listen(PORT, () => console.log("Server is running at port : " + PORT));
server.timeout = 360000; 

// pm2 start npm --name "Real_state_backend" -- run dev