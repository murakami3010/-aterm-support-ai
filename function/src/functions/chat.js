const { app } = require('@azure/functions');

const log = (context, level, message, data) => {
    const ts = new Date().toISOString();
    const prefix = `[${ts}] [${level}]`;
    if (data !== undefined) {
        context.log(`${prefix} ${message}`, typeof data === "object" ? JSON.stringify(data, null, 2) : data);
    } else {
        context.log(`${prefix} ${message}`);
    }
};

app.http('chat', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const reqId = Date.now().toString(36);
        log(context, "INFO", `[${reqId}] Chat function started`);

        let body;
        try {
            body = await request.json();
            log(context, "INFO", `[${reqId}] Request - model: ${body.model}, messages: ${body.messages?.length ?? 0}`);
        } catch (parseErr) {
            log(context, "ERROR", `[${reqId}] Failed to parse request body: ${parseErr.message}`);
            return { status: 400, jsonBody: { error: "Invalid JSON in request body" } };
        }

        let response;
        try {
            response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.CLAUDE_API_KEY,
                    "anthropic-version": "2023-06-01"
                },
                body: JSON.stringify(body)
            });
            log(context, "INFO", `[${reqId}] Claude API response status: ${response.status} ${response.statusText}`);
        } catch (fetchErr) {
            log(context, "ERROR", `[${reqId}] Network error calling Claude API: ${fetchErr.message}`);
            log(context, "ERROR", `[${reqId}] Stack: ${fetchErr.stack}`);
            return { status: 502, jsonBody: { error: "Failed to reach Claude API", detail: fetchErr.message } };
        }

        let data;
        try {
            data = await response.json();
        } catch (jsonErr) {
            log(context, "ERROR", `[${reqId}] Failed to parse Claude API response as JSON: ${jsonErr.message}`);
            return { status: 502, jsonBody: { error: "Invalid JSON from Claude API", detail: jsonErr.message } };
        }

        if (!response.ok) {
            log(context, "ERROR", `[${reqId}] Claude API error - status: ${response.status}, type: ${data?.error?.type}, message: ${data?.error?.message}`);
            return {
                status: response.status,
                jsonBody: { error: data?.error?.message ?? "Claude API error", type: data?.error?.type, detail: data }
            };
        }

        log(context, "INFO", `[${reqId}] Success - stop_reason: ${data.stop_reason}, input_tokens: ${data.usage?.input_tokens}, output_tokens: ${data.usage?.output_tokens}`);
        return { status: 200, jsonBody: data };
    }
});