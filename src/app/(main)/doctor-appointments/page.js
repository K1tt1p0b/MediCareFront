'use client';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Chip,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Grid,
    Divider
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
    LocationOn as LocationIcon,
    Phone as PhoneIcon,
    Email as EmailIcon
} from '@mui/icons-material';

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/doctors/me/appointments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to fetch appointments');
            }

            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.error('Error loading appointments:', error);
            setError('ไม่สามารถโหลดข้อมูลนัดหมายได้: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'booked':
                return 'primary';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            case 'no-show':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'booked':
                return 'จองแล้ว';
            case 'completed':
                return 'เสร็จสิ้น';
            case 'cancelled':
                return 'ยกเลิก';
            case 'no-show':
                return 'ไม่มา';
            default:
                return status;
        }
    };
    
    // ปรับเปลี่ยนฟังก์ชันให้รับค่าเดียวคือ appointment_datetime
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'ไม่ระบุวันเวลา';
        try {
            const date = new Date(dateTimeString);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleString('th-TH', options);
        } catch (e) {
            console.error("Invalid date time format:", dateTimeString, e);
            return 'Invalid Date';
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ScheduleIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h4">
                    นัดหมายของผู้ป่วย
                </Typography>
            </Box>

            {appointments.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        ยังไม่มีนัดหมาย
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ผู้ป่วยจะสามารถจองนัดหมายกับคุณได้หลังจากที่คุณกำหนดเวลาว่าง
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {appointments.map((appointment) => (
                        <Grid item xs={12} md={6} key={appointment.id}>
                            <Card elevation={2}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Typography variant="h6" color="primary">
                                            {appointment.patient_name}
                                        </Typography>
                                        <Chip
                                            label={getStatusText(appointment.status)}
                                            color={getStatusColor(appointment.status)}
                                            size="small"
                                        />
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <ScheduleIcon sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                {/* ใช้ชื่อคอลัมน์ที่เปลี่ยนไป */}
                                                {formatDateTime(appointment.appointment_datetime)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            ข้อมูลผู้ป่วย:
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <PhoneIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                {appointment.patient_phone || 'ไม่ระบุ'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <EmailIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                {appointment.patient_email || 'ไม่ระบุ'}
                                            </Typography>
                                        </Box>
                                        {appointment.patient_address && (
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                                <LocationIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary', mt: 0.2 }} />
                                                <Typography variant="body2">
                                                    {appointment.patient_address}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {appointment.notes && (
                                        <>
                                            <Divider sx={{ my: 2 }} />
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    หมายเหตุ:
                                                </Typography>
                                                <Typography variant="body2">
                                                    {appointment.notes}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
}