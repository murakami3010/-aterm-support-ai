
module.exports = async function (context, req) {
  const body     = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  context.log("Claude response:", data);
  context.res = {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  };
};