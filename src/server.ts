import type { ViteDevServer, Connect } from "vite";
import fs from "node:fs";
import { render } from "./entry-server";

// exposed by globalThis.__viteDevServer in devPlugin
declare let __viteDevServer: ViteDevServer;

const handler: Connect.NextHandleFunction = async (_req, res) => {
  // template
  let html = await fs.promises.readFile("./index.html", "utf-8");
  html = await __viteDevServer.transformIndexHtml("/", html);

  // ssr
  const ssrResult = render();
  html = html.replace("<!--app-html-->", ssrResult.html);

  res.setHeader("content-type", "text/html").end(html);
};

export default handler;
