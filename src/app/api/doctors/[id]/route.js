export async function GET(request, { params }) {
    try {
        const { id } = await params;  // เพิ่ม await ตรงนี้
        const authHeader = request.headers.get('authorization');

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/doctors/${id}`, {
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
        console.error('Error fetching doctor:', error);
        return Response.json({ error: 'Failed to fetch doctor' }, { status: 500 });
    }
} 