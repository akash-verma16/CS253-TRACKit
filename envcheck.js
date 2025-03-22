const os = require("os");
const process = require("process");
const sqlite3 = require("sqlite3");
const path = require("path");
const fs = require("fs");

// Function to get package information
function getPackageInfo(folder) {
  const packagePath = path.join(__dirname, folder, "package.json");
  if (fs.existsSync(packagePath)) {
    return require(packagePath);
  }
  return {};
}

const backendPkg = getPackageInfo("backend");
const frontendPkg = getPackageInfo("frontend");

console.log("\n🛠️  Full Stack Environment Check 🛠️\n");

// System Info
console.log("🔹 OS Platform      :", os.platform());
console.log("🔹 OS Version       :", os.release());
console.log("🔹 CPU Model        :", os.cpus()[0].model);
console.log("🔹 Total Memory     :", (os.totalmem() / (1024 ** 3)).toFixed(2) + " GiB");

// Disk Space (Windows/Linux/macOS) in GiB
function getDiskInfo() {
  try {
    const { execSync } = require("child_process");
    let command;

    if (process.platform === "win32") {
      // Windows: Get only local fixed drives (DriveType=3)
      command = 'wmic logicaldisk where "DriveType=3" get caption,freespace,size';
      const output = execSync(command).toString();
      console.log("\n💾 Disk Info (in GiB):");

      output.split("\n").forEach((line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length === 3 && parts[0] !== "Caption") {
          const drive = parts[0];
          const freeSpaceGiB = (parseInt(parts[1], 10) / (1024 ** 3)).toFixed(2);
          const totalSizeGiB = (parseInt(parts[2], 10) / (1024 ** 3)).toFixed(2);
          console.log(`   ${drive}: Free ${freeSpaceGiB} GiB / Total ${totalSizeGiB} GiB`);
        }
      });

    } else {
      // Linux/macOS: Use df command
      command = "df -BG /";
      const output = execSync(command).toString();
      console.log("\n💾 Disk Info (in GiB):");
      output.split("\n").forEach((line) => {
        if (line.includes("/")) {
          const parts = line.trim().split(/\s+/);
          console.log(`   ${parts[0]}: Free ${parts[3]} / Total ${parts[1]}`);
        }
      });
    }

  } catch (error) {
    console.error("❌ Error retrieving disk info:", error.message);
  }
}
getDiskInfo();

// Node.js & npm
console.log("\n🟢 Node.js          :", process.version);
console.log("📦 npm Version      :", process.env.npm_version || "Not Available");

// Backend (Express) Info
console.log("\n📚 Backend (Express):");
console.log("   Express Version  :", backendPkg.dependencies?.express || "Not Found");
console.log("   SQLite Version   :", sqlite3.VERSION);
Object.entries(backendPkg.dependencies || {}).forEach(([name, version]) => {
  console.log(`   - ${name}: ${version}`);
});

// Frontend (React) Info
console.log("\n🌐 Frontend (React):");
console.log("   React Version    :", frontendPkg.dependencies?.react || "Not Found");
Object.entries(frontendPkg.dependencies || {}).forEach(([name, version]) => {
  console.log(`   - ${name}: ${version}`);
});

// Environment Variables
console.log("\n🔧 Environment Variables:");
console.log("   PORT             :", process.env.PORT || "Not Set");
console.log("   NODE_ENV         :", process.env.NODE_ENV || "development");

// Memory Usage (in GiB)
console.log("\n📊 Memory Usage:");
const memoryUsage = process.memoryUsage();
console.log("   RSS              :", (memoryUsage.rss / (1024 ** 3)).toFixed(2) + " GiB"); // Resident Set Size
console.log("   Heap Total       :", (memoryUsage.heapTotal / (1024 ** 3)).toFixed(2) + " GiB");
console.log("   Heap Used        :", (memoryUsage.heapUsed / (1024 ** 3)).toFixed(2) + " GiB");
console.log("   External         :", (memoryUsage.external / (1024 ** 3)).toFixed(2) + " GiB");

console.log("\n✅ Environment Check Complete!\n");
