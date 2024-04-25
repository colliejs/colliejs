import path from "node:path";
import fs, { WriteFileOptions } from "node:fs";

export const writeFile = (
  filePath: string,
  content: string,
  option?: WriteFileOptions
) => {
  if (!fs.existsSync(filePath)) {
    console.log("filePath: ", filePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  const option_ = option ?? { encoding: "utf-8", flag: "w" };
  fs.writeFileSync(filePath, content, option_);
};
