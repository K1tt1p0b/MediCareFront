'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Menu,
    MenuItem,
    Box,
    Container
} from '@mui/material';

function Navbar() {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter();
    const open = Boolean(anchorEl);

    useEffect(() => {
        // ดึงข้อมูล user จาก localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setAnchorEl(null);
        router.push('/login');
    };

    const navigateTo = (path) => {
        router.push(path);
        handleClose();
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigateTo('/FindDoctor')}>
                    Medicare
                </Typography>
                
                {/* ตรวจสอบสถานะ user ถ้ามี (ล็อกอินแล้ว) ให้แสดงเมนูสำหรับสมาชิก */}
                {user ? (
                    <>
                        {/* แสดงเมนูตาม role */}
                        {user.role === 'patient' && (
                            <>
                                <Button color="inherit" onClick={() => navigateTo('/FindDoctor')}>หน้าแรก</Button>
                                <Button color="inherit" onClick={() => navigateTo('/my-appointments')}>ดูรายการนัดหมาย</Button>
                            </>
                        )}
                        
                        {user.role === 'doctor' && (
                            <>
                                <Button color="inherit" onClick={() => navigateTo('/doctor-appointments')}>ดูนัดหมายคนไข้</Button>
                                <Button color="inherit" onClick={() => navigateTo('/doctor-time-slots')}>จัดการเวลาว่าง</Button>
                                <Button color="inherit" onClick={() => navigateTo('/report-appointments')}>ดูรายงานการนัดหมาย</Button>
                            </>
                        )}
                        
                        {user.role === 'admin' && (
                            <>
                                <Button color="inherit" onClick={() => navigateTo('/admin')}>จัดการผู้ใช้</Button>
                                <Button color="inherit" onClick={() => navigateTo('/report-appointments')}>ดูรายงานการนัดหมาย</Button>
                            </>
                        )}
                        
                        <Button color="inherit" onClick={handleMenu}>คุณ{user.full_name}</Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => navigateTo('/profile')}>โปรไฟล์</MenuItem>
                            <MenuItem onClick={handleLogout}>ออกจากระบบ</MenuItem>
                        </Menu>
                    </>
                ) : (
                    /* ถ้ายังไม่ล็อกอิน ให้แสดงเมนูสำหรับบุคคลทั่วไป */
                    <>
                        <Button color="inherit" onClick={() => navigateTo('/login')}>เข้าสู่ระบบ</Button>
                        <Button color="inherit" onClick={() => navigateTo('/register')}>สมัครสมาชิก</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

// สร้างคอมโพเนนต์ Footer
function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto', // คำสั่งสำคัญที่ทำให้ footer อยู่ด้านล่างสุด
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                <Typography variant="body1">
                    Medicare - บริการสุขภาพครบวงจร
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {'Copyright © '}
                    Medicare {new Date().getFullYear()}
                    {'.'}
                </Typography>
            </Container>
        </Box>
    );
}


export default function MainLayout({ children }) {
    return (
        // ปรับ Box หลักให้เป็น flex container เพื่อให้ footer อยู่ด้านล่างสุด
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            {/* ใช้ component="main" และให้ขยายเต็มพื้นที่ที่เหลือ */}
            <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Box>
            <Footer />
        </Box>
    );
}