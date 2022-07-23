import { Handler } from "@netlify/functions";
import { text } from "../payload";

const handler: Handler = async (_event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: text }),
  };
};

export { handler };
