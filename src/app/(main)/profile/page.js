'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Paper,
    Avatar,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LockIcon from '@mui/icons-material/Lock';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [doctorData, setDoctorData] = useState(null); // <--- เพิ่ม state นี้
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [changePasswordDialog, setChangePasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        address: ''
    });
    // เพิ่ม state สำหรับการแก้ไขข้อมูลแพทย์
    const [doctorFormData, setDoctorFormData] = useState({
        license_number: '',
        bio: ''
    });

    const router = useRouter();

    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const response = await fetch('/api/users/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setFormData({
                full_name: userData.full_name || '',
                email: userData.email || '',
                phone_number: userData.phone_number || '',
                address: userData.address || ''
            });

            // ตรวจสอบว่าผู้ใช้เป็นแพทย์หรือไม่
            if (userData.role === 'doctor') {
                // สมมติว่ามี endpoint สำหรับดึงข้อมูลแพทย์
                const doctorResponse = await fetch('/api/doctors/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (doctorResponse.ok) {
                    const docData = await doctorResponse.json();
                    setDoctorData(docData);
                    setDoctorFormData({
                        license_number: docData.license_number || '',
                        bio: docData.bio || ''
                    });
                }
            }

        } else {
            setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
        }
    } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
        setLoading(false);
    }
};

    const handleEdit = () => {
        setEditing(true);
        setError('');
        setSuccess('');
    };

    const handleCancel = () => {
        setEditing(false);
        setFormData({
            full_name: user.full_name || '',
            email: user.email || '',
            phone_number: user.phone_number || '',
            address: user.address || ''
        });
        setError('');
        setSuccess('');
    };

    const handleSave = async () => {
    try {
        const token = localStorage.getItem('token');
        
        // อัปเดตข้อมูลผู้ใช้ทั่วไป
        const userResponse = await fetch('/api/users/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (!userResponse.ok) {
            const errorData = await userResponse.text();
            setError(errorData || 'ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้');
            return;
        }

        // ถ้าเป็นหมอ ให้อัปเดตข้อมูลหมอด้วย
        if (user.role === 'doctor') {
            const doctorResponse = await fetch('/api/doctors/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(doctorFormData)
            });

            if (!doctorResponse.ok) {
                const errorData = await doctorResponse.text();
                setError(errorData || 'ไม่สามารถอัปเดตข้อมูลแพทย์ได้');
                return;
            }
        }

        setSuccess('อัปเดตข้อมูลสำเร็จ!');
        setEditing(false);
        await loadUserProfile(); // โหลดข้อมูลใหม่ทั้งหมดหลังบันทึกสำเร็จ
    } catch (error) {
        setError('เกิดข้อผิดพลาดในการอัปเดตข้อมูล');
    }
};

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('รหัสผ่านใหม่ไม่ตรงกัน');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/me/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (response.ok) {
                setSuccess('เปลี่ยนรหัสผ่านสำเร็จ!');
                setChangePasswordDialog(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                const errorData = await response.text();
                setError(errorData || 'ไม่สามารถเปลี่ยนรหัสผ่านได้');
            }
        } catch (error) {
            setError('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={60} />
                </Box>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">ไม่พบข้อมูลผู้ใช้</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Paper elevation={2} sx={{ 
                    background: '#ffffff', 
                    borderRadius: 3, 
                    p: 4,
                    border: '1px solid rgb(148, 148, 148)'
                }}>
                    <Avatar sx={{ 
                        width: 100, 
                        height: 100, 
                        mx: 'auto', 
                        mb: 3, 
                        bgcolor: 'primary.main',
                        fontSize: '2.5rem'
                    }}>
                        {user.full_name ? user.full_name.charAt(0) : 'U'}
                    </Avatar>
                    <Typography variant="h4" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
                        โปรไฟล์ของฉัน
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        จัดการข้อมูลส่วนตัวและบัญชีของคุณ
                    </Typography>
                </Paper>
            </Box>

            {/* Error and Success Alerts */}
            {error && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>
                    {success}
                </Alert>
            )}

            {/* Profile Information */}
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ 
                        background: '#ffffff', 
                        borderRadius: 3,
                        border: '1px solid rgb(148, 148, 148)'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    ข้อมูลส่วนตัว
                                </Typography>
                                {!editing ? (
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={handleEdit}
                                    >
                                        แก้ไข
                                    </Button>
                                ) : (
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<CancelIcon />}
                                            onClick={handleCancel}
                                        >
                                            ยกเลิก
                                        </Button>
                                        <Button
                                            variant="contained"
                                            startIcon={<SaveIcon />}
                                            onClick={handleSave}
                                        >
                                            บันทึก
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            <Divider sx={{ mb: 3, borderColor: 'rgb(148, 148, 148)' }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="ชื่อ-นามสกุล"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                        disabled={!editing}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="ชื่อผู้ใช้"
                                        value={user.username || ''}
                                        disabled
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="อีเมล"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        disabled={!editing}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="เบอร์โทรศัพท์"
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                                        disabled={!editing}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="ที่อยู่"
                                        multiline
                                        rows={3}
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        disabled={!editing}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                                
                            </Grid>
                            {user.role === 'doctor' && (
    <>
        <Grid item xs={12}>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                ข้อมูลแพทย์
            </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                fullWidth
                label="หมายเลขใบอนุญาต"
                value={doctorFormData.license_number}
                onChange={(e) => setDoctorFormData({...doctorFormData, license_number: e.target.value})}
                disabled={!editing}
                sx={{ mb: 2 }}
            />
        </Grid>
        <Grid item xs={12}>
            <TextField
                fullWidth
                label="ประวัติส่วนตัว"
                multiline
                rows={4}
                value={doctorFormData.bio}
                onChange={(e) => setDoctorFormData({...doctorFormData, bio: e.target.value})}
                disabled={!editing}
                sx={{ mb: 2 }}
            />
        </Grid>
    </>
)}
                        </CardContent>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ 
                        background: '#ffffff', 
                        borderRadius: 3,
                        border: '1px solid rgb(148, 148, 148)'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                                ข้อมูลบัญชี
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    สถานะ
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {user.role === 'admin' ? 'ผู้ดูแลระบบ' : 
                                     user.role === 'doctor' ? 'แพทย์' : 'ผู้ป่วย'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    วันที่สมัคร
                                </Typography>
                                <Typography variant="body1">
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString('th-TH') : 'ไม่ระบุ'}
                                </Typography>
                            </Box>

                            <Button
                                variant="outlined"
                                fullWidth
                                startIcon={<LockIcon />}
                                onClick={() => setChangePasswordDialog(true)}
                                sx={{ borderRadius: 2 }}
                            >
                                เปลี่ยนรหัสผ่าน
                            </Button>
                        </CardContent>
                    </Paper>
                </Grid>
            </Grid>

            {/* Change Password Dialog */}
            <Dialog open={changePasswordDialog} onClose={() => setChangePasswordDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>เปลี่ยนรหัสผ่าน</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            fullWidth
                            label="รหัสผ่านปัจจุบัน"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="รหัสผ่านใหม่"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="ยืนยันรหัสผ่านใหม่"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setChangePasswordDialog(false)}>
                        ยกเลิก
                    </Button>
                    <Button onClick={handleChangePassword} variant="contained">
                        เปลี่ยนรหัสผ่าน
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}