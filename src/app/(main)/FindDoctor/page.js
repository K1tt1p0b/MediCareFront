'use client';

import React, { useState, useEffect } from 'react';
import { 
    Button, 
    TextField, 
    Box, 
    Typography, 
    Container, 
    Card, 
    CardContent, 
    Grid, 
    CircularProgress
} from '@mui/material';
import axios from 'axios';

export default function FindDoctorPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // ไม่ต้องมี state ของ user และโค้ด Navbar อีกต่อไป

    const handleSearch = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setDoctors([]);

        try {
            const response = await axios.get(`http://localhost:3001/api/doctors?specialty=${searchQuery}`);
            setDoctors(response.data);
            if (response.data.length === 0) {
                setError('ไม่พบแพทย์ในสาขาที่ค้นหา');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการค้นหา');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* ลบ AppBar และ Toolbar ทั้งหมดจากที่นี่ */}
            
            {/* Main content of the page */}
            <Container component="main" maxWidth="md" sx={{ mt: 8, mb: 4 }}>
                <Card elevation={6} sx={{ p: 4 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
                                ยินดีต้อนรับสู่ Medicare
                            </Typography>
                            <Typography component="p" variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                                ค้นหาแพทย์เฉพาะทางที่คุณต้องการได้อย่างง่ายดาย
                            </Typography>
                            <Box component="form" onSubmit={handleSearch} noValidate sx={{ mt: 1, width: '100%' }}>
                                <TextField 
                                    fullWidth
                                    label="ป้อนสาขาที่ต้องการค้นหา (เช่น ทันตกรรม, ศัลยกรรม)"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'ค้นหา'}
                                </Button>
                            </Box>
                            
                            {error && (
                                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                                    {error}
                                </Typography>
                            )}

                            <Grid container spacing={3} sx={{ mt: 4 }}>
                                {doctors.map((doctor, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Card elevation={3}>
                                            <CardContent>
                                                <Typography variant="h6" component="div">
                                                    {doctor.full_name}
                                                </Typography>
                                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                                    {doctor.specialty}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <Box component="span" sx={{ fontWeight: 'bold' }}>รหัสแพทย์:</Box> {doctor.id}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}