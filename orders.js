export async function onRequest(context) {
    const { request, env } = context;
    const db = env.DB;
    const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

    if (request.method === "GET") {
        try {
            const { results } = await db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
            return new Response(JSON.stringify(results), { headers });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
        }
    }
    if (request.method === "POST") {
        try {
            const data = await request.json();
            const stmt = db.prepare("INSERT INTO orders (id, customer_name, phone, city, address, total, status, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            await stmt.bind(data.id, data.customer_name, data.phone, data.city, data.address, data.total, 'جديد', JSON.stringify(data.items)).run();
            return new Response(JSON.stringify({ success: true }), { headers });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
        }
    }
    return new Response("Method not allowed", { status: 405 });
}
