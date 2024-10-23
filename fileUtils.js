
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { cwd } from "process";

export const getUploaderDir = (filePath) => {
  const dir = join(cwd(), `/uploads/${filePath}/`);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
};
export const getRootDir = () => {
  return cwd();
};