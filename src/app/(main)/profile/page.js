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
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import axios from 'axios';

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit mode

    useEffect(() => {
        // Check for logged-in user token
        const token = localStorage.getItem('loggedInUser');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        
        // Fetch user data from the backend to pre-fill the form
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                // Add Authorization header to the request
                const response = await axios.get('http://localhost:3001/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }); 
                const userData = response.data;
                setFormData({
                    full_name: userData.full_name,
                    email: userData.email,
                    phone_number: userData.phone_number,
                    address: userData.address,
                });
            } catch (err) {
                setError('เกิดข้อผิดพลาดในการดึงข้อมูลโปรไฟล์');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('loggedInUser');
            // Add Authorization header to the request
            const response = await axios.put('http://localhost:3001/users/me', {
                full_name: formData.full_name,
                email: formData.email,
                phone_number: formData.phone_number,
                address: formData.address,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setDialogMessage('อัปเดตโปรไฟล์สำเร็จแล้ว!');
                setOpenDialog(true);
                setIsEditing(false); // Switch back to view mode after successful update
            }
        } catch (err) {
            setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
            <Card elevation={6} sx={{ p: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
                            ข้อมูลโปรไฟล์
                        </Typography>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                {!isEditing ? (
                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            <strong>ชื่อ-นามสกุล:</strong> {formData.full_name}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            <strong>อีเมล:</strong> {formData.email}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            <strong>เบอร์โทรศัพท์:</strong> {formData.phone_number}
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            <strong>ที่อยู่:</strong> {formData.address}
                                        </Typography>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={() => setIsEditing(true)}
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            แก้ไขโปรไฟล์
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box component="form" onSubmit={handleUpdateProfile} noValidate sx={{ mt: 1, width: '100%' }}>
                                        <TextField
                                            margin="normal"
                                            fullWidth
                                            label="ชื่อ-นามสกุล"
                                            name="full_name"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            margin="normal"
                                            fullWidth
                                            label="อีเมล"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            margin="normal"
                                            fullWidth
                                            label="เบอร์โทรศัพท์"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            margin="normal"
                                            fullWidth
                                            label="ที่อยู่"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />

                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                            disabled={loading}
                                        >
                                            {loading ? <CircularProgress size={24} /> : 'อัปเดตโปรไฟล์'}
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={() => setIsEditing(false)}
                                            sx={{ mt: 1 }}
                                        >
                                            ยกเลิก
                                        </Button>
                                    </Box>
                                )}
                            </>
                        )}
                        {error && <Typography color="error" variant="body2">{error}</Typography>}
                    </Box>
                </CardContent>
            </Card>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>{"สถานะการอัปเดต"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}