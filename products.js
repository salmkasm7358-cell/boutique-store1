export async function onRequest(context) {
    const { request, env } = context;
    const db = env.DB;
    const method = request.method;
    const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

    if (method === "GET") {
        try {
            const { results } = await db.prepare("SELECT * FROM products ORDER BY created_at DESC").all();
            return new Response(JSON.stringify(results), { headers });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
        }
    }
    if (method === "POST") {
        try {
            const data = await request.json();
            const stmt = db.prepare("INSERT INTO products (id, name, price, category, image, description) VALUES (?, ?, ?, ?, ?, ?)");
            await stmt.bind(data.id, data.name, data.price, data.category, data.image, data.description).run();
            return new Response(JSON.stringify({ success: true }), { headers });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
        }
    }
    if (method === "DELETE") {
        try {
            const url = new URL(request.url);
            const id = url.searchParams.get("id");
            await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
        }
    }
    return new Response("Method not allowed", { status: 405 });
}
