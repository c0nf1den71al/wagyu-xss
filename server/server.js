const express = require("express");
const db = require("./db");
const { createEvent } = require("./controllers/eventControllers");

// Config
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
app.use(cors({
    origin: '*'
}));
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoute");
const eventViewerRoutes = require("./routes/eventViewerRoute");
const implantRoutes = require("./routes/implantRoute");
const payloadRoutes = require("./routes/payloadRoute");
const commandRoutes = require("./routes/commandRoute");
const exploitRoutes = require("./routes/exploitRoute");
const hostRoutes = require("./routes/hostRoute");

app.use("/api/v1/", authRoutes)
app.use("/api/v1/events", eventViewerRoutes);
app.use("/api/v1/payloads", payloadRoutes);
app.use("/api/v1/command", commandRoutes);
app.use("/", implantRoutes);
app.use("/", hostRoutes);
app.use("/", exploitRoutes); // Keep me last

app.listen(process.env.PORT || 3000, () => {
  console.log(`Team server is listening on port ${process.env.PORT || 3000}`);
  try {
    createEvent("Team Server", `Team Server is up and running on port ${process.env.PORT || 3000}`, "success");
  } catch (err) {
    const errors = handle(err)
    console.log(errors);
  }
});