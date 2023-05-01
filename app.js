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

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  console.log(request.body);
  //   console.log(playerList);
  //  const {
  //     playerId, player_name, jersey_number, role;
  //   } = playerList;
  //   console.log(playerId);
  const sqlQuery = `
  INSERT INTO
        cricket_team ( player_name, jersey_number, role)
  VALUES
    (
        
        '${playerName}',
        ${jerseyNumber},
        '${role}'
    );`;
  const update = await db.run(sqlQuery);
  const playerIds = update.lastID;
  response.send({ playerId: playerIds });
  //console.log("success");
});

//API 3
app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;

  const sqlQuery = `
    SELECT * FROM cricket_team WHERE player_id = ${playerId};
  `;
  const list = await db.get(sqlQuery);

  response.send(list);
});

//API 4

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;

  const sqlQuery = ` UPDATE cricket_team 
      SET 
        player_name = '${playerName}',
        jersey_number = ${jerseyNumber},
        role = '${role}'
    WHERE 
        player_id = ${playerId}`;

  await db.run(sqlQuery);
  response.send("Player Details Updated");
});

//API 5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;

  const sqlQuery = `
   DELETE FROM cricket_team  WHERE player_id = ${playerId};`;

  await db.run(sqlQuery);
  response.send("Player Removed");
});

module.exports = app;
