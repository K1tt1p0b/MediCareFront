'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    TextField,
    Grid,
    Avatar,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';

export default function AppointmentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const doctorId = searchParams.get('doctorId');
    
    const [doctor, setDoctor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);  // เพิ่ม state นี้
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (doctorId) {
            loadDoctorDetails();
            loadAvailableSlots();
        }
    }, [doctorId]);

    const loadDoctorDetails = async () => {
        try {
            const response = await fetch(`/api/doctors/${doctorId}`);
            if (response.ok) {
                const data = await response.json();
                setDoctor(data);
            }
        } catch (error) {
            console.error('Error loading doctor details:', error);
        }
    };

    const loadAvailableSlots = async () => {
        try {
            const response = await fetch(`/api/doctors/${doctorId}/slots`);
            if (response.ok) {
                const data = await response.json();
                // กรองเฉพาะ time slots ที่ว่าง (is_booked = 0)
                const availableData = data.filter(slot => !slot.is_booked);
                setAvailableSlots(availableData);
            }
        } catch (error) {
            console.error('Error loading available slots:', error);
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชันเลือก time slot - แก้ไขให้เลือกได้แค่อันเดียว
    const handleSlotSelect = (slot) => {
        console.log('Selecting slot:', slot);
        // ถ้าเลือก slot เดิม ให้ยกเลิกการเลือก
        if (selectedSlot && selectedSlot.id === slot.id) {
            setSelectedSlot(null);
        } else {
            // เลือก slot ใหม่ (ยกเลิกอันเก่า)
            setSelectedSlot(slot);
        }
    };

    const handleSubmit = async () => {
        if (!selectedSlot) {
            setError('กรุณาเลือกช่วงเวลาที่ต้องการนัดหมาย');
            return;
        }
        
        try {
            setError(null);
            setSuccess(null);
            
            const token = localStorage.getItem('token');
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    doctor_id: doctorId,
                    time_slot_id: selectedSlot.id,
                    notes: notes
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                setSuccess('จองนัดหมายสำเร็จแล้ว!');
                // รีเซ็ตฟอร์ม
                setSelectedSlot(null);
                setNotes('');
                // รีโหลด time slots
                loadAvailableSlots();
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'เกิดข้อผิดพลาดในการจองนัดหมาย');
            }
        } catch (error) {
            console.error('Error creating appointment:', error);
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return {
            date: date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
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

    if (!doctor) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">ไม่พบข้อมูลแพทย์</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                จองนัดหมายกับแพทย์
            </Typography>

            {/* Doctor Information */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                        {doctor.full_name.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h6">{doctor.full_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            สาขา: {doctor.specialty}
                        </Typography>
                        <Chip label="แพทย์" color="primary" size="small" />
                    </Box>
                </Box>
            </Paper>

            {/* Error/Success Messages */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {/* Time Slot Selection */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    เลือกช่วงเวลาที่ต้องการนัดหมาย
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    ช่วงเวลาที่ว่าง (เลือก 1 ช่วงเวลา)
                </Typography>
                
                <Grid container spacing={2}>
                    {availableSlots.map((slot, index) => {
                        const isSelected = selectedSlot && selectedSlot.id === slot.id;
                        
                        return (
                            <Grid item key={`slot-${slot.id}-${index}`}>
                                <Button
                                    variant={isSelected ? 'contained' : 'outlined'}
                                    onClick={() => handleSlotSelect(slot)}
                                    sx={{ 
                                        minWidth: '120px',
                                        mb: 1,
                                        mr: 1,
                                        backgroundColor: isSelected ? 'primary.main' : 'transparent',
                                        color: isSelected ? 'white' : 'primary.main',
                                        border: isSelected ? 'none' : '2px solid',
                                        borderColor: 'primary.main',
                                        '&:hover': {
                                            backgroundColor: isSelected ? 'primary.dark' : 'primary.light',
                                            color: isSelected ? 'white' : 'primary.main'
                                        },
                                        transition: 'all 0.2s ease-in-out',
                                        boxShadow: isSelected ? 3 : 1
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            {formatDateTime(slot.start_time).date}
                                        </Typography>
                                        <Typography variant="body2">
                                            {formatDateTime(slot.start_time).time}
                                        </Typography>
                                        {isSelected && (
                                            <Box sx={{ mt: 0.5 }}>
                                                <Typography variant="caption" sx={{ color: 'white' }}>
                                                    ✓ เลือกแล้ว
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Button>
                            </Grid>
                        );
                    })}
                </Grid>
            </Paper>

            {/* Notes */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                    อาการเบื้องต้น หรือเหตุผลที่ต้องพบแพทย์
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="อาการเบื้องต้น หรือเหตุผลที่ต้อง..."
                />
            </Paper>

            {/* Submit Button */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!selectedSlot}
                    size="large"
                >
                    ยืนยันการนัดหมาย
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => router.back()}
                    size="large"
                >
                    ยกเลิก
                </Button>
            </Box>
        </Container>
    );
}