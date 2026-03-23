require("dotenv").config();
const app = require("./src/App");
const connectDb = require("./src/config/db");

connectDb();
Port = process.env.PORT || 5000;
app.listen(Port, () => {
  console.log(`http://localhost:${Port}`);
});
