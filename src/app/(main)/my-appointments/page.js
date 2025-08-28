'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
    Paper,
    CircularProgress,
    Alert,
    Divider
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person'; // ยังคงใช้สำหรับไอคอนใน empty state

export default function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                // หากไม่มี token ให้ redirect ไปหน้า login
                router.push('/login');
                return;
            }

            // เรียก API เพื่อดึงข้อมูลนัดหมายของผู้ใช้
            const response = await fetch('/api/appointments/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            } else {
                setError('ไม่สามารถโหลดรายการนัดหมายได้');
            }
        } catch (err) {
            console.error('Error loading appointments:', err);
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชันสำหรับจัดรูปแบบวันที่และเวลา
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return { date: 'ไม่ระบุวัน', time: 'ไม่ระบุเวลา' };
        try {
            const date = new Date(dateTimeString);
            const dateOptions = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            const timeOptions = { 
                hour: '2-digit', 
                minute: '2-digit' 
            };
            return {
                date: date.toLocaleDateString('th-TH', dateOptions),
                time: date.toLocaleTimeString('th-TH', timeOptions)
            };
        } catch (e) {
            console.error("Invalid date time format:", dateTimeString, e);
            return { date: 'Invalid Date', time: 'Invalid Time' };
        }
    };

    // ฟังก์ชันสำหรับกำหนดสีของ Chip ตามสถานะ
    const getStatusColor = (status) => {
        switch (status) {
            case 'booked':
                return 'primary';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    // ฟังก์ชันสำหรับกำหนดข้อความสถานะ
    const getStatusText = (status) => {
        switch (status) {
            case 'booked':
                return 'จองแล้ว';
            case 'completed':
                return 'เสร็จสิ้น';
            case 'cancelled':
                return 'ยกเลิกแล้ว';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Paper elevation={2} sx={{ 
                    background: '#ffffff', 
                    borderRadius: 3, 
                    p: 4,
                    border: '1px solid rgb(148, 148, 148)'
                }}>
                    <CalendarTodayIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
                        รายการนัดหมายของฉัน
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        ดูนัดหมายที่คุณได้จองไว้ทั้งหมด
                    </Typography>
                </Paper>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Appointments List */}
            {appointments.length > 0 ? (
                <Grid container spacing={3}>
                    {appointments.map((appointment) => {
                        const { date, time } = formatDateTime(appointment.start_time);
                        
                        return (
                            <Grid item xs={12} md={6} key={appointment.id}>
                                <Card elevation={3} sx={{ 
                                    borderRadius: 3,
                                    border: '1px solid rgb(148, 148, 148)',
                                    '&:hover': {
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                    }
                                }}>
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Header */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                นัดหมาย #{appointment.id.slice(0, 8)}
                                            </Typography>
                                            <Chip 
                                                label={getStatusText(appointment.status)} 
                                                color={getStatusColor(appointment.status)}
                                                size="small"
                                            />
                                        </Box>

                                        <Divider sx={{ my: 2, borderColor: 'rgb(148, 148, 148)' }} />

                                        {/* Doctor Info */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                            <Avatar sx={{ 
                                                width: 50, 
                                                height: 50, 
                                                mr: 2, 
                                                bgcolor: 'primary.main' 
                                            }}>
                                                {appointment.doctor_name ? appointment.doctor_name.charAt(0) : 'D'}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                                    {appointment.doctor_name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    แพทย์
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Appointment Details */}
                                        <Box sx={{ mb: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {date}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {time}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            ) : (
                /* Empty State */
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Paper elevation={2} sx={{ 
                        background: '#ffffff', 
                        borderRadius: 3, 
                        p: 6, 
                        textAlign: 'center',
                        border: '1px solid rgb(148, 148, 148)',
                        maxWidth: '500px',
                        width: '100%'
                    }}>
                        <CalendarTodayIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
                        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                            ยังไม่มีนัดหมาย
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            คุณยังไม่มีนัดหมายที่กำลังจะมาถึงหรือนัดหมายที่ผ่านมา
                        </Typography>
                        {/* ปุ่มจองนัดหมายถูกลบออกแล้ว เพราะเป็นหน้าสำหรับดูอย่างเดียว */}
                    </Paper>
                </Box>
            )}
        </Container>
    );
}