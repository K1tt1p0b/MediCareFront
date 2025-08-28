export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/doctors/me/appointments`, {
            headers: {
                'Authorization': authHeader || '',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return Response.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization');
        const body = await request.json();
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/doctors/me/time-slots`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return Response.json(data, { status: 201 });
    } catch (error) {
        console.error('Error creating time slot:', error);
        return Response.json({ error: 'Failed to create time slot' }, { status: 500 });
    }
}