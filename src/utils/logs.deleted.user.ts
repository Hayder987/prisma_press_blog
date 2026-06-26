
import fs from "fs/promises";
import path from "path";

export const deletedUserLogs = async (result: any) => {
  const logDir = path.join(process.cwd(), "logs");
  await fs.mkdir(logDir, { recursive: true });

  const logPath = path.join(logDir, "deleted-users.txt");


  let content = "";
  try {
    content = await fs.readFile(logPath, "utf-8");
  } catch {}


  if (content.trim() === "") {
    const header =
      "SL  | Name                 | Email                     | Role    | Deleted Time\n" +
      "----|----------------------|---------------------------|---------|--------------------------\n";

    await fs.writeFile(logPath, header);
    content = header;
  }

  // Serial Number
  const serial = content
    .split("\n")
    .filter(
      (line) =>
        line.trim() &&
        !line.startsWith("SL") &&
        !line.startsWith("----")
    ).length + 1;

  const row =
    `${serial.toString().padEnd(3)} | ` +
    `${result.name.padEnd(20)} | ` +
    `${result.email.padEnd(25)} | ` +
    `${result.role.padEnd(7)} | ` +
    `${new Date().toLocaleString()}\n`;

  await fs.appendFile(logPath, row);
};
