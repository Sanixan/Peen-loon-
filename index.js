const path = require("path");
const express = require("express");
const app = express();
global.loading = require("./utils/log.js");
const { spawn } = require('child_process');
let botProcess;

async function onBot() {
    botProcess = spawn('node', ['main.js'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });

    botProcess.on('close', (code) => {
        if (code === 2) {
            console.log('Restarting bot...'.red);
            onBot();
        } else if (code !== 0) {
            console.error(`Bot process exited with code ${code}`);
        }
    });
}

onBot();

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/includes/cover/index.html"));
});
app.listen(2024, () => {
  global.loading.log(
    `Bot is running on port: 2024`,
    "SYSTEM",
  );
});