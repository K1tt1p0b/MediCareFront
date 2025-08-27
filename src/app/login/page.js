'use client';

import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from 'axios';

export default function LoginPage() {
    // State to hold form data
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    // State to hold and display login errors
    const [error, setError] = useState('');
    // State for the success dialog box
    const [openDialog, setOpenDialog] = useState(false);
    // State to hold the message to display in the dialog
    const [dialogMessage, setDialogMessage] = useState('');

    // Handle input field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle the login form submission
    const handleLogin = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setError(''); // Clear any previous errors

        try {
            // Make a POST request to the backend API.
            const response = await axios.post('http://localhost:3001/auth/login', formData);
            
            // Check for a successful response and that a token exists
            if (response.status === 200 && response.data.token) {
                // Store the token and user's full name from the API response
                localStorage.setItem('loggedInUser', response.data.token);
                localStorage.setItem('username', response.data.user.full_name);

                // Set the success message and open the dialog
                setDialogMessage(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับคุณ ${response.data.user.full_name}`);
                setOpenDialog(true);
            }
        } catch (err) {
            // Handle errors from the API call
            // Display the specific error message from the server or a generic one
            setError(err.response?.data?.message || 'เข้าสู่ระบบล้มเหลว กรุณาตรวจสอบชื่อผู้ใช้และรหัสผ่าน');
        }
    };

    // Handle closing the dialog box
    const handleCloseDialog = () => {
        setOpenDialog(false);
        // Navigate to the main page after closing the dialog
        window.location.href = '/FindDoctor';
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
            <Card elevation={6} sx={{ p: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
                            เข้าสู่ระบบ
                        </Typography>
                        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
                            <TextField 
                                margin="normal" 
                                required 
                                fullWidth 
                                label="ชื่อผู้ใช้" 
                                name="username" 
                                value={formData.username} 
                                onChange={handleChange} 
                            />
                            <TextField 
                                margin="normal" 
                                required 
                                fullWidth 
                                label="รหัสผ่าน" 
                                name="password" 
                                type="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                            />

                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained" 
                                sx={{ mt: 3, mb: 2 }}
                            >
                                เข้าสู่ระบบ
                            </Button>
                            {error && <Typography color="error" variant="body2">{error}</Typography>}
                        </Box>
                        <a href="/register">
                            <Button variant="text" sx={{ mt: 1 }}>
                                ยังไม่มีบัญชี? สมัครสมาชิก
                            </Button>
                        </a>
                    </Box>
                </CardContent>
            </Card>
            {/* The Dialog component for displaying success or status messages */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>{"สถานะการเข้าสู่ระบบ"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} autoFocus>
                        ตกลง
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}