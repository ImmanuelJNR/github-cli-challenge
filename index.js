let express = require("express");
let app = express();
const https = require("https");

const PORT = 3000;

app.listen(PORT, () => {
  console.log("app is listening on port 3000");
});

console.log("Enter GitHub username:");

let userName = "";

process.stdin.on("data", (input) => {
  userName = input.toString().trim(); // Convert input to string and remove extra spaces

  console.log(`Fetching recent activity for: ${userName}`);

  // Now you can use `username` in your API request

  const options = {
    hostname: "api.github.com",
    path: `/users/${userName}/events`,
    method: "GET",
    headers: {
      "User-Agent": "MyNodeApp",
      Accept: "application/vnd.github.v3+json",
    },
  };

  https
    .get(options, (response) => {
      // console.log(response.statusCode);
      console.log("Status Code:", response.statusCode);
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (!Array.isArray(json) || json.length === 0) {
            return res.status(404).json;
          }

          const activities = json.map((event) => {
            return `- ${event.type} in ${event.repo.name} at ${event.created_at}`;
          });

          console.log("Recent GitHub Activity:");
          activities.forEach((activity) => console.log(activity));
          // console.log(json);

          // response.json({ username: activities });
        } catch (error) {
          console.error("Error parsing JSON:", error.message);
        }
        // data.toString();
      });
    })
    .on("error", (err) => {
      console.log("error:", err.message);
    });
});

// https://api.github.com/users/ImmanuelJNR/events

// app.get("/:username", (req, res) => {
//   const username = req.params.username.trim(); // Get username from URL
//   if (!username) {
//     return res.json({
//       error:
//         "No GitHub username provided. Please enter a username in the terminal.",
//     });
//   }

// });
