import path from "path";

export const getFilePath = (file) =>
  "uploads" + file.path.split(path.sep + "uploads").at(1);
