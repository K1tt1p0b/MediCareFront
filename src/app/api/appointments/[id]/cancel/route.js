export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const authHeader = request.headers.get('authorization');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/appointments/${id}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': authHeader,
            },
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