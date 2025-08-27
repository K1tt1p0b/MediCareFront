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
    Box
} from '@mui/material';

function Navbar() {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter();
    const open = Boolean(anchorEl);

    useEffect(() => {
        // ดึงชื่อผู้ใช้จาก localStorage เพื่อตรวจสอบสถานะการล็อกอิน
        const loggedInUsername = localStorage.getItem('username'); 
        if (loggedInUsername) {
            setUser(loggedInUsername);
        }
    }, []);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser'); // Token
        localStorage.removeItem('username');
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
                        <Button color="inherit" onClick={() => navigateTo('/FindDoctor')}>หน้าหลัก</Button>
                        <Button color="inherit" onClick={() => navigateTo('/appointment')}>จองนัดหมายกับแพทย์</Button>
                        <Button color="inherit" onClick={() => navigateTo('/my-appointments')}>ดูรายการนัดหมาย</Button>
                        <Button color="inherit" onClick={handleMenu}>{user}</Button>
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

export default function MainLayout({ children }) {
    return (
        <Box>
            <Navbar />
            <main>{children}</main>
        </Box>
    );
}