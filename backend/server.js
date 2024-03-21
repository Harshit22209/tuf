const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const redis = require("redis");
const axios = require("axios");
const config = require("./config.js");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log(config.db);
// Create connection to MySQL databa
const db = mysql.createConnection({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: 16006,
  ssl: {
    mode: "REQUIRED",
    ca: fs.readFileSync("./backend/ca.pem").toString(),
  },
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL database");
});

const redisClient = redis.createClient({
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
const connect = async () => {
  await redisClient.connect();
};
connect();
const headers = {
  "content-type": "application/json",
  "Content-Type": "application/json",
  "X-RapidAPI-Key": config.rapid.key,
  "X-RapidAPI-Host": config.rapid.host,
};
const submit = async (input) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions",
    params: {
      base64_encoded: "false",
      fields: "*",
      wait: "true",
    },
    headers: headers,
    data: input,
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
const languages = { java: 62, python: 71, cpp: 54, javascript: 63 };

// API endpoint for submitting code snippet
app.post("/submit", async (req, res) => {
  const { username, language, stdin, sourceCode } = req.body;
  const timestamp = new Date().toISOString();
  const input = {
    source_code: sourceCode,
    language_id: languages[language],
    stdin: stdin,
  };
  const output = await submit(input);

  if (output.status.id != 3) {
    console.log(1);
    res.status(500).json({ message: output.status.description });
  } else {
    console.log(2);
    const sql =
      "INSERT INTO code_snippets (username, language, stdin, source_code, stdout) VALUES (?, ?, ?, ?,?)";
    const flag = true;
    try {
      const [result] = await db.promise().query(sql, [
        username,
        language,
        stdin,
        sourceCode,
        output["stdout"],
      ]);
      await redisClient.FLUSHALL();
      res.status(201).json({ message: "Code snippet submitted successfully" });
    } catch {
      console.log("error")
      res.status(500).json({ message: "Error Submitting code snippet" });
    }
  }
});

app.get("/codeSnippets", async (req, res) => {
  // console.log("bro");
  const data = await redisClient.get("submissions");
  if (data) {
    res.status(200).json(JSON.parse(data));

  }
  else{
  const sql =
    "SELECT username, language, stdin, stdout,LEFT(source_code, 100) AS source_code_preview, timestamp FROM code_snippets";
  db.query(sql, async (err, result) => {
    if (err) {
      res.status(500).json({ message: "Failed to fetch code snippets" });
    } else {
      // Cache fetched data in Redis

      await redisClient.setEx("submissions", 3600, JSON.stringify(result));
      res.status(200).json(result);
    }
  });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
