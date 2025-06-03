import { createServer } from "vite";
import serve from "serve";

const server = serve("dist", {
  port: 8080,
  ignore: ['node_modules']
});
