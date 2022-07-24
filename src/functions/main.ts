import type { Handler } from "@netlify/functions";
import { parse } from "query-string";

const handler: Handler = async (event) => {
  const body = parse(event.body || "");
  console.log(body.user_id);
  return {
    statusCode: 200,
    body: JSON.stringify({ event }),
  };
};

export { handler };
