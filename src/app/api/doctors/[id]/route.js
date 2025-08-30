export async function GET(request, { params }) {
    try {
        const { id } = await params;
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/doctors/${id}`, {
            headers: {
                'Authorization': request.headers.get('authorization'),
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Doctor not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error fetching doctor:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}