const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes");
const bodyparser = require("body-parser");

const app = express();
app.use(bodyparser.json());
app.use(
  bodyparser.urlencoded({
    extended: false,
  })
);

app.use("/api", apiRouter);

app.listen(process.env.PORT || "3000", () => {
  console.log(`server is running on port ${process.env.PORT || 3000}`);
});

// http://localhost:3000/api/generate-pdf
// http://localhost:3000/api/getlist
// http://localhost:3000/api/updateItem
//http://localhost:3000/api/insertItem
