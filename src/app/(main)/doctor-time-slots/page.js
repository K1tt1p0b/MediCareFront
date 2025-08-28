'use client';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControlLabel,
    Switch,
    Alert,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    CardActions,
    Chip,
    IconButton,
    Tooltip,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';

export default function DoctorTimeSlots() {
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);
    const [formData, setFormData] = useState({
        start_time: '',
        end_time: '',
        is_booked: false
    });

    useEffect(() => {
        loadTimeSlots();
    }, []);

    const loadTimeSlots = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/doctors/me/time-slots', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch time slots');
            }

            const data = await response.json();
            setTimeSlots(data);
        } catch (error) {
            console.error('Error loading time slots:', error);
            setError('ไม่สามารถโหลดข้อมูลเวลาว่างได้');
        } finally {
            setLoading(false);
        }
    };

    const resetFormData = () => {
        setFormData({
            start_time: '',
            end_time: '',
            is_booked: false
        });
    };

    const handleCreateSlot = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/doctors/me/time-slots', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowCreateForm(false);
                resetFormData();
                loadTimeSlots();
            }
        } catch (error) {
            console.error('Error creating time slot:', error);
        }
    };

    const handleUpdateSlot = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/doctors/me/time-slots/${editingSlot.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setEditingSlot(null);
                resetFormData();
                loadTimeSlots();
            }
        } catch (error) {
            console.error('Error updating time slot:', error);
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (!confirm('คุณแน่ใจหรือไม่ที่จะลบช่วงเวลานี้?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/doctors/me/time-slots/${slotId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadTimeSlots();
            }
        } catch (error) {
            console.error('Error deleting time slot:', error);
        }
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateRange = (startTime, endTime) => {
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        
        // ถ้าเป็นวันเดียวกัน
        if (startDate.toDateString() === endDate.toDateString()) {
            return `${startDate.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })} เวลา ${startDate.toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit'
            })} - ${endDate.toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit'
            })}`;
        }
        
        // ถ้าเป็นคนละวัน
        return `${startDate.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })} ${startDate.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit'
        })} ถึง ${endDate.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })} ${endDate.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit'
        })}`;
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

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ScheduleIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h4">
                    จัดการเวลาว่าง
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">
                        ตารางเวลาของคุณ
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setShowCreateForm(true)}
                    >
                        เพิ่มช่วงเวลาใหม่
                    </Button>
                </Box>

                {timeSlots.length === 0 ? (
                    <Alert severity="info">
                        ยังไม่มีตารางเวลา กรุณาเพิ่มช่วงเวลาการรับผู้ป่วย
                    </Alert>
                ) : (
                    <Grid container spacing={2}>
                        {timeSlots.map((slot) => (
                            <Grid item xs={12} md={6} lg={4} key={slot.id}>
                                <Card elevation={2}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h6" color="primary">
                                                {formatDateRange(slot.start_time, slot.end_time)}
                                            </Typography>
                                            <Chip
                                                label={slot.is_booked ? 'ไม่ว่าง' : 'ว่าง'}
                                                color={slot.is_booked ? 'error' : 'success'}
                                                size="small"
                                            />
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                วันที่: {formatDateTime(slot.start_time)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                เวลา: {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton
                                            onClick={() => {
                                                setEditingSlot(slot);
                                                setFormData({
                                                    start_time: slot.start_time,
                                                    end_time: slot.end_time,
                                                    is_booked: slot.is_booked
                                                });
                                            }}
                                            size="small"
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDeleteSlot(slot.id)}
                                            size="small"
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>

            {/* Create/Edit Form Dialog */}
            <Dialog 
                open={showCreateForm || !!editingSlot} 
                onClose={() => {
                    setShowCreateForm(false);
                    setEditingSlot(null);
                    resetFormData();
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingSlot ? 'แก้ไขช่วงเวลา' : 'เพิ่มช่วงเวลาใหม่'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="เวลาเริ่ม"
                                type="datetime-local"
                                value={formData.start_time || ''}
                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="เวลาสิ้นสุด"
                                type="datetime-local"
                                value={formData.end_time || ''}
                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={!formData.is_booked}
                                        onChange={(e) => setFormData({ ...formData, is_booked: !e.target.checked })}
                                    />
                                }
                                label="ช่วงเวลาว่าง"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setShowCreateForm(false);
                        setEditingSlot(null);
                        resetFormData();
                    }}>
                        ยกเลิก
                    </Button>
                    <Button 
                        onClick={editingSlot ? handleUpdateSlot : handleCreateSlot}
                        variant="contained"
                    >
                        {editingSlot ? 'อัปเดต' : 'สร้าง'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
} 