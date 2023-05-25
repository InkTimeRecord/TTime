const fs = require('fs')
const download = require("download");
exports.default = async function () {
    if (process.platform === "win32" && !fs.existsSync("./build/VC_redist.x64.exe")) {
        fs.writeFileSync(
          './build/VC_redist.x64.exe',
          await download('https://aka.ms/vs/17/release/VC_redist.x64.exe', {
            rejectUnauthorized: false
          })
        )
    }
}
