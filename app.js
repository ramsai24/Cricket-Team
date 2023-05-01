const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const intializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server is running at http://localhost:3000`);
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

intializeDBAndServer();

app.get("/players/", async (request, response) => {
  const sqlQuery = `SELECT * FROM cricket_team;`;
  const playerList = await db.all(sqlQuery);
  response.send(playerList);
});
