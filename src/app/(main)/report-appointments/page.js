'use client';

import { useState, useEffect } from 'react';

// Helper: ดึงวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD สำหรับค่าเริ่มต้น
const getTodayString = () => {
    const today = new Date();
    // ปรับ Timezone ให้เป็นของไทย (UTC+7) เพื่อให้ได้วันที่ที่ถูกต้อง
    const offset = 7 * 60 * 60 * 1000;
    const localDate = new Date(today.getTime() + offset);
    return localDate.toISOString().split('T')[0];
};

export default function AppointmentReportPage() {
    const [date, setDate] = useState(getTodayString());
    const [reportData, setReportData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // เริ่มต้นเป็น true สำหรับการโหลดครั้งแรก
    const [error, setError] = useState(null);

    // ทำการตรวจสอบสิทธิ์และดึงข้อมูลครั้งแรกเมื่อ Component โหลด
    useEffect(() => {
        // Set document title when component mounts
        document.title = 'รายงานสรุปการนัดหมาย';

        const checkAuthAndFetchInitialReport = async () => {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            if (!token || !['admin', 'doctor'].includes(user.role)) {
                // Redirect using standard browser API
                window.location.href = '/login';
                return;
            }
            // ดึงข้อมูลรายงานสำหรับวันปัจจุบันเมื่อโหลดหน้าครั้งแรก
            await fetchReport(date, token);
        };
        checkAuthAndFetchInitialReport();
    }, []); // Dependency array ว่างเพื่อให้ทำงานครั้งเดียว

    const fetchReport = async (reportDate, token) => {
        setIsLoading(true);
        setError(null);
        setReportData(null); // ล้างข้อมูลเก่าก่อนดึงข้อมูลใหม่

        // หากไม่ได้ส่ง token มา ให้ดึงจาก localStorage
        const authToken = token || localStorage.getItem('token');
        if (!authToken) {
            setError('ไม่พบ Token สำหรับยืนยันตัวตน กรุณาล็อกอินอีกครั้ง');
            setIsLoading(false);
            return;
        }

        try {
            // **สำคัญ**: แก้ไข URL ของ API server ตามที่อยู่จริงของคุณ
            const response = await fetch(`http://localhost:3001/reports/appointments?date=${reportDate}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || `เกิดข้อผิดพลาด: ${response.statusText}`);
            }

            setReportData(data);
        } catch (err) {
            setError(err.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์เพื่อดึงข้อมูลรายงานได้');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateReport = (e) => {
        e.preventDefault();
        fetchReport(date);
    };

    // แสดงสถานะ Loading ขณะกำลังตรวจสอบสิทธิ์และดึงข้อมูลครั้งแรก
    if (isLoading && !reportData && !error) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">รายงานสรุปการนัดหมาย</h1>

                {/* Filter Section */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">เลือกข้อมูลที่ต้องการ</h2>
                    <form onSubmit={handleGenerateReport} className="flex flex-col sm:flex-row items-center gap-4">
                        <div>
                            <label htmlFor="report-date" className="block text-sm font-medium text-gray-700 mb-1">เลือกวันที่</label>
                            <input
                                type="date"
                                id="report-date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="self-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-gray-400"
                            >
                                {isLoading ? 'กำลังโหลด...' : 'สร้างรายงาน'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Report Display Section */}
                {isLoading && <div className="text-center p-4">กำลังโหลดข้อมูล...</div>}
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                        <strong className="font-bold">เกิดข้อผิดพลาด: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {reportData && !isLoading && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4">
                            สรุปข้อมูล ณ วันที่ {new Date(reportData.report_date + 'T00:00:00').toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </h2>
                        
                        <div className="text-center bg-gray-50 p-6 rounded-lg my-6">
                            <p className="text-lg text-gray-600">จำนวนนัดหมายทั้งหมด</p>
                            <p className="text-5xl font-bold text-blue-600 mt-2">{reportData.total_appointments}</p>
                        </div>

                        {reportData.total_appointments > 0 ? (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">แยกตามสถานะ:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {Object.entries(reportData.status_summary).map(([status, count]) => (
                                        <div key={status} className="bg-white p-4 border border-gray-200 rounded-lg text-center">
                                            <p className="font-semibold text-gray-600 capitalize">{status}</p>
                                            <p className="text-3xl font-bold text-gray-800 mt-1">{count}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                <p>ไม่พบข้อมูลการนัดหมายในวันที่เลือก</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

