export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const specialty = searchParams.get('specialty');
        const authHeader = request.headers.get('authorization');
        
        let url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/doctors`;
        if (specialty) {
            url += `?specialty=${encodeURIComponent(specialty)}`;
        }
        
        const response = await fetch(url, {
            headers: {
                'Authorization': authHeader,
            },
        });

        if (!response.ok) {
            return new Response('Failed to fetch doctors', { status: response.status });
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