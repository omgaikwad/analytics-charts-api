const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = xlsx.utils.sheet_to_json(sheet);

  return jsonData.map((row) => ({
    feature: row["Feature"],
    age: row["Age"],
    gender: row["Gender"],
    timeSpent: row["Time Spent"],
    date: new Date(row["Date"]),
  }));
};

const parsedData = parseExcel(
  path.resolve(__dirname, "../data/frontend-developer-assignment-data.xlsx")
);
fs.writeFileSync(
  path.resolve(__dirname, "../data/parsedData.json"),
  JSON.stringify(parsedData, null, 2)
);
