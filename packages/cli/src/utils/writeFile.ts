import path from "node:path";
import fs, { WriteFileOptions } from "node:fs";

export function writeFile(
  file: string,
  content: string,
  option?: WriteFileOptions
) {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
  }
  fs.writeFileSync(
    file,
    content,
    option ?? { encoding: "utf-8", flag: "w" }
  );
}
