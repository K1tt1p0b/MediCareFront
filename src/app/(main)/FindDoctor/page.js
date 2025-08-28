'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Button, 
    TextField, 
    Box, 
    Typography, 
    Container, 
    Card, 
    CardContent, 
    Grid, 
    CircularProgress,
    Avatar,
    Chip,
    Alert,
    Paper,
    InputAdornment,
    IconButton,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonIcon from '@mui/icons-material/Person';

export default function FindDoctorPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // โหลดข้อมูลหมอทั้งหมดเมื่อเริ่มต้น
    useEffect(() => {
        loadAllDoctors();
    }, []);

    const loadAllDoctors = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch('/api/doctors', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setDoctors(data);
            } else {
                setError('ไม่สามารถโหลดข้อมูลแพทย์ได้');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        if (!searchQuery.trim()) {
            loadAllDoctors();
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch(`/api/doctors?specialty=${encodeURIComponent(searchQuery)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setDoctors(data);
                if (data.length === 0) {
                    setError('ไม่พบแพทย์ในสาขาที่ค้นหา');
                }
            } else {
                setError('เกิดข้อผิดพลาดในการค้นหา');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการค้นหา');
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = (doctorId) => {
        router.push(`/appointment?doctorId=${doctorId}`);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        loadAllDoctors();
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            py: 4,
            backgroundColor: '#white'
        }}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Paper elevation={2} sx={{ 
                        background: '#ffffff', 
                        borderRadius: 3, 
                        p: 4,
                        border: '1px solidrgb(148, 148, 148)'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                            <MedicalServicesIcon sx={{ fontSize: 60, color: 'primary.main', mr: 2 }} />
                        </Box>
                        <Typography 
                            component="h1" 
                            variant="h3" 
                            sx={{ 
                                mb: 2, 
                                fontWeight: 'bold',
                                color: 'text.primary'
                            }}
                        >
                            ค้นหาแพทย์เฉพาะทาง
                        </Typography>
                        <Typography 
                            component="p" 
                            variant="h6" 
                            sx={{ 
                                color: 'text.secondary',
                                maxWidth: '600px',
                                mx: 'auto'
                            }}
                        >
                            ค้นหาแพทย์เฉพาะทางที่คุณต้องการได้อย่างง่ายดาย
                        </Typography>
                    </Paper>
                </Box>

                {/* Search Section */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Paper elevation={2} sx={{ 
                        background: '#ffffff', 
                        borderRadius: 3, 
                        p: 4,
                        border: '1px solid #e0e0e0',
                        maxWidth: '800px',
                        width: '100%'
                    }}>
                        <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
                            ค้นหาแพทย์ตามสาขา
                        </Typography>
                        <Box component="form" onSubmit={handleSearch} noValidate>
                            <Grid container spacing={2} alignItems="center" justifyContent="center">
                                <Grid item xs={12} sm={8} md={6}>
                                    <TextField 
                                        fullWidth
                                        label="ป้อนสาขาที่ต้องการค้นหา"
                                        placeholder="เช่น ทันตกรรม, ศัลยกรรม, อายุรกรรม, กุมารเวชกรรม..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: searchQuery && (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={handleClearSearch}
                                                        edge="end"
                                                        size="small"
                                                    >
                                                        <ClearIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                '&:hover fieldset': {
                                                    borderColor: 'primary.main',
                                                },
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} md={3}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={loading}
                                        sx={{ 
                                            height: '56px', 
                                            borderRadius: 2
                                        }}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                                    >
                                        {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                        <Alert 
                            severity="error" 
                            sx={{ 
                                borderRadius: 2,
                                maxWidth: '800px',
                                width: '100%',
                                '& .MuiAlert-icon': {
                                    fontSize: 28
                                }
                            }}
                            action={
                                <Button color="inherit" size="small" onClick={handleClearSearch}>
                                    ล้างการค้นหา
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    </Box>
                )}

                {/* Doctors Grid */}
                {doctors.length > 0 && (
                    <Paper elevation={2} sx={{ 
                        background: '#ffffff', 
                        borderRadius: 3, 
                        p: 4,
                        border: '1px solid #e0e0e0'
                    }}>
                        <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
                            รายการแพทย์ที่พบ ({doctors.length} คน)
                        </Typography>
                        <Grid container spacing={3}>
                            {doctors.map((doctor) => (
                                <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                                    <Card 
                                        elevation={3} 
                                        sx={{ 
                                            height: '100%', 
                                            borderRadius: 2,
                                            transition: 'all 0.3s ease-in-out',
                                            border: '1px solid #e0e0e0',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                                borderColor: 'primary.main'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                            {/* Doctor Header */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                <Avatar 
                                                    sx={{ 
                                                        width: 70, 
                                                        height: 70, 
                                                        mr: 3, 
                                                        bgcolor: 'primary.main',
                                                        fontSize: '1.5rem',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {doctor.full_name ? doctor.full_name.charAt(0) : 'D'}
                                                </Avatar>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography 
                                                        variant="h6" 
                                                        component="div" 
                                                        sx={{ 
                                                            fontWeight: 'bold',
                                                            color: 'text.primary',
                                                            mb: 1
                                                        }}
                                                    >
                                                        {doctor.full_name}
                                                    </Typography>
                                                    <Chip 
                                                        label={doctor.specialty} 
                                                        color="primary" 
                                                        size="medium" 
                                                        variant="outlined"
                                                        sx={{ 
                                                            borderRadius: 1,
                                                            fontWeight: 'medium',
                                                            borderWidth: 1
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            <Divider sx={{ my: 2, borderColor: '#e0e0e0' }} />

                                            {/* Action Buttons */}
                                            <Box sx={{ mt: 'auto', pt: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    onClick={() => handleBookAppointment(doctor.id)}
                                                    sx={{ 
                                                        mb: 2,
                                                        borderRadius: 2,
                                                        py: 1.5
                                                    }}
                                                    startIcon={<PersonIcon />}
                                                >
                                                    จองนัดหมาย
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    fullWidth
                                                    size="medium"
                                                    sx={{ 
                                                        borderRadius: 2,
                                                        py: 1.5,
                                                        borderWidth: 1,
                                                        '&:hover': {
                                                            borderWidth: 1,
                                                            background: 'rgba(102, 126, 234, 0.1)'
                                                        }
                                                    }}
                                                >
                                                    ดูรายละเอียด
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}

                {/* Empty State */}
                {doctors.length === 0 && !loading && !error && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Paper elevation={2} sx={{ 
                            background: '#ffffff', 
                            borderRadius: 3, 
                            p: 6, 
                            textAlign: 'center',
                            border: '1px solid #e0e0e0',
                            maxWidth: '600px',
                            width: '100%'
                        }}>
                            <MedicalServicesIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
                            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                                ไม่พบข้อมูลแพทย์
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                ลองค้นหาด้วยคำค้นหาอื่น หรือติดต่อผู้ดูแลระบบ
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={loadAllDoctors}
                                sx={{ borderRadius: 2, px: 4 }}
                            >
                                โหลดข้อมูลใหม่
                            </Button>
                        </Paper>
                    </Box>
                )}

                {/* Loading State */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <Paper elevation={2} sx={{ 
                            background: '#ffffff', 
                            borderRadius: 3, 
                            p: 4,
                            border: '1px solid #e0e0e0'
                        }}>
                            <CircularProgress size={60} sx={{ color: 'primary.main' }} />
                            <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
                                กำลังโหลดข้อมูล...
                            </Typography>
                        </Paper>
                    </Box>
                )}
            </Container>
        </Box>
    );
}