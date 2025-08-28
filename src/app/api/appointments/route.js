export async function POST(request) {
    try {
        const authHeader = request.headers.get('authorization');
        const body = await request.json();
        
        console.log('Frontend sending data:', body);
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/appointments`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader || '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        console.log('Backend response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.log('Backend error:', errorData);
            throw new Error(`HTTP error! status: ${response.status}: ${errorData.error || 'Unknown error'}`);
        }

        const data = await response.json();
        return Response.json(data, { status: 201 });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return Response.json({ 
            error: 'Failed to create appointment',
            details: error.message 
        }, { status: 500 });
    }
} 