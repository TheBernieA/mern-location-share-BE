const express = require("express");
const bodyParser = require("body-parser");

const placesRouter = require("./routes/palces-routes");
const userRouter = require('./routes/users-routes')
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());
app.use("/api/places", placesRouter);
app.use('/api/users', userRouter);

app.use((req, res, next) => {
    throw new HttpError('Could not find route', 404)
});

//ERROR HANDLING MIDDLEWARE
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occured" });
});

app.listen(3000);
