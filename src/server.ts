import type { Connect } from "vite";
import fs from "node:fs";
import { render } from "./entry-server";

const handler: Connect.NextHandleFunction = async (req, res) => {
  // template
  let html = await fs.promises.readFile("./index.html", "utf-8");
  html = await (req as any).viteDevServer.transformIndexHtml("/", html);

  // ssr
  const ssrResult = render();
  html = html.replace("<!--app-html-->", ssrResult.html);

  res.setHeader("content-type", "text/html").end(html);
};

export default handler;
