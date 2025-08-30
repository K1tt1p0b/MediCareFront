export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/doctors/me`, {
            headers: {
                'Authorization': authHeader,
            },
        });

        if (!response.ok) {
            return new Response('Failed to fetch doctor profile', { status: response.status });
        }

        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function PUT(request) {
    try {
        const body = await request.json();
        const authHeader = request.headers.get('authorization');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/doctors/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader,
            },
            body: JSON.stringify(body),
        });

        const data = await response.text();
        
        return new Response(data, {
            status: response.status,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    } catch (error) {
        return new Response('Internal Server Error', { status: 500 });
    }
}