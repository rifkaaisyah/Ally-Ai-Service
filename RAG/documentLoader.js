const fs = require("fs/promises");
const path = require("path");

async function loadScholarships() {
  try {
   const filePath = path.join(
  __dirname,
  "documents",
  "scholarship.json"
);

    const data = await fs.readFile(filePath, "utf8");

    const scholarships = JSON.parse(data);

    return scholarships;
  } catch (error) {
    console.error("Failed to load scholarships:", error);

    throw error;
  }
}

module.exports = {
  loadScholarships,
};