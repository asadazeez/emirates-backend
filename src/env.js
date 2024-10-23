import * as dotenv from "dotenv";
import { cleanEnv, port, str } from "envalid";

dotenv.config();

const env = cleanEnv(process.env, {
  ENV: str({ choices: ["local", "production"], default: "local" }),
  PORT: port({ default: 8000 }),
  USER_JWT_SECRET_KEY: str({
    default:
      "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlbjfgnbioPQW4iLCJlbWFpbCI6ImFkbWluQGVtYy5jb20ifQ.xCyQt3wQXRj8NojG-m26LS9GktX90VBxU15BoxLuTS8",
  }),
  
  JWT_EXPIRES: str({ default: "7 days" }),
 
  
});

export default env;
