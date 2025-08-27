'use client';

import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from 'axios';

export default function RegisterPage() {
    // State to hold form data
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
    });
    // State to hold and display registration errors
    const [error, setError] = useState('');
    // State for the success dialog box
    const [openDialog, setOpenDialog] = useState(false);
    // State to hold the message to display in the dialog
    const [dialogMessage, setDialogMessage] = useState('');

    // Handle input field changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle the registration form submission
    const handleRegister = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setError(''); // Clear any previous errors

        try {
            // Make a POST request to the backend API.
            // The URL is set to port 3001 to avoid conflict with Next.js's default port.
            const response = await axios.post('http://localhost:3001/auth/register', formData);
            
            // Check for a successful response (status code 201 Created)
            if (response.status === 201) {
                // Set the success message and open the dialog
                setDialogMessage('Registration successful! You are now a patient. Please log in.');
                setOpenDialog(true);
            }
        } catch (err) {
            // Handle errors from the API call
            // Display the specific error message from the server or a generic one
            setError(err.response?.data || 'Registration failed. Please try again.');
        }
    };

    // Handle closing the dialog box
    const handleCloseDialog = () => {
        setOpenDialog(false);
        window.location.href = '/login'; // Navigate to the login page after closing the dialog
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
            <Card elevation={6} sx={{ p: 4 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
                            สมัครสมาชิก
                        </Typography>
                        <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1, width: '100%' }}>
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
                            <TextField 
                                margin="normal" 
                                required 
                                fullWidth 
                                label="ชื่อ-นามสกุล" 
                                name="fullName"
                                value={formData.fullName} 
                                onChange={handleChange} 
                            />

                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained" 
                                sx={{ mt: 3, mb: 2 }}
                            >
                                สมัครสมาชิก
                            </Button>
                            {error && <Typography color="error" variant="body2">{error}</Typography>}
                        </Box>
                        <a href="/login">
                            <Button variant="text" sx={{ mt: 1 }}>
                                กลับไปหน้าเข้าสู่ระบบ
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
                <DialogTitle>{"Registration Status"}</DialogTitle>
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
