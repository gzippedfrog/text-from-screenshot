const fs = require("fs/promises");
var os = require("os");
const util = require("util");
const axios = require("axios");
const exec = util.promisify(require("child_process").exec);
require("dotenv").config();

const apiEndpoint = "https://vision.api.cloud.yandex.net/vision/v1";

async function screenshotAndSend() {
  try {
    const timestamp = Date.now();
    switch (os.platform()) {
      case "linux":
        await exec(`import -window root ${timestamp}.jpg`);
        break;
      case "darwin":
        await exec(`screencapture ${timestamp}.jpg`);
        break;
      default:
        throw new Error("unsupported OS");
    }

    const img = await fs.readFile(`${timestamp}.jpg`, {
      encoding: "base64"
    });

    console.log("Sendig...");

    const res = await axios({
      url: `${apiEndpoint}/batchAnalyze`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.IAM_TOKEN}`
      },
      data: {
        folderId: process.env.FOLDER_ID,
        analyze_specs: [
          {
            content: img,
            features: [
              {
                type: "TEXT_DETECTION",
                text_detection_config: {
                  language_codes: ["*"]
                }
              }
            ]
          }
        ]
      }
    });

    const { results } = res.data;
    await fs.writeFile(`${timestamp}.txt`, JSON.stringify(results, null, 4));
  } catch (error) {
    console.log("Error:", error.message);
  }
}

module.exports.screenshotAndSend = screenshotAndSend

