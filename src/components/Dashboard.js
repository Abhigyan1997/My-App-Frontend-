import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Grid,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Divider,
    Snackbar,
    Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Dashboard = () => {
    const [user, setUser] = useState({});
    const [bio, setBio] = useState('');
    const [videoData, setVideoData] = useState({
        title: '',
        description: '',
        file: null
    });
    const [videos, setVideos] = useState([]);
    const [profilePic, setProfilePic] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://3.110.40.53/api/api/user', {
                    headers: { 'x-auth-token': token }
                });
                setUser(response.data);
                setBio(response.data.bio || '');
                setProfilePic(response.data.avatar || ''); // Assuming avatar path is provided by backend
                fetchVideos(); // Fetch videos on initial load
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    const fetchVideos = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://3.110.40.53/api/api/user/videos', {
                headers: { 'x-auth-token': token }
            });
            setVideos(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handleBioSubmit = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://3.110.40.53/api/api/user/bio', { bio }, {
                headers: { 'x-auth-token': token }
            });
            setSnackbarSeverity('success');
            setSnackbarMessage('Bio updated successfully');
            setSnackbarOpen(true);
        } catch (error) {
            console.error(error);
            setSnackbarSeverity('error');
            setSnackbarMessage('Error updating bio');
            setSnackbarOpen(true);
        }
    };

    const handleVideoChange = (e) => {
        setVideoData({ ...videoData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setVideoData({ ...videoData, file: e.target.files[0] });
    };

    const handleVideoSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('title', videoData.title);
        formData.append('description', videoData.description);
        formData.append('video', videoData.file);

        try {
            setUploading(true);
            const response = await axios.post('http://3.110.40.53/api/api/user/video', formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploading(false);
            setVideoData({ title: '', description: '', file: null });
            fetchVideos(); // Fetch updated list of videos after successful upload
            handleCloseUploadModal();
            setSnackbarSeverity('success');
            setSnackbarMessage('Video uploaded successfully');
            setSnackbarOpen(true);
        } catch (error) {
            setUploading(false);
            if (error.response && error.response.status === 413) {
                setErrorMessage('File size too large. Please upload a smaller file (max 6MB).');
            } else {
                console.error(error);
                setErrorMessage('Error uploading video');
            }
        }
    };

    const handleOpenUploadModal = () => {
        setOpenUploadModal(true);
    };

    const handleCloseUploadModal = () => {
        setOpenUploadModal(false);
    };

    const handleAvatarChange = (e) => {
        setAvatarFile(e.target.files[0]);
        handleAvatarSubmit(); // Trigger avatar upload immediately
    };

    const handleAvatarSubmit = async () => {
        if (!avatarFile) return; // Exit early if no file selected

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        try {
            setUploadingAvatar(true);
            const response = await axios.post('http://3.110.40.53/api/api/user/avatar', formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadingAvatar(false);
            setProfilePic(response.data.avatar); // Update the profile picture state
            setSnackbarSeverity('success');
            setSnackbarMessage('Avatar uploaded successfully');
            setSnackbarOpen(true);
        } catch (error) {
            setUploadingAvatar(false);
            if (error.response && error.response.status === 413) {
                setErrorMessage('File size too large. Please upload a smaller file (max 6MB).');
            } else {
                console.error(error);
                setErrorMessage('Error uploading avatar');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login'; // Redirect to login page
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <Avatar alt={user.firstName} src={profilePic} sx={{ width: 100, height: 100 }} />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            style={{ display: 'none' }}
                            id="avatarInput"
                        />
                        <label htmlFor="avatarInput">
                            <IconButton color="primary" component="span">
                                <EditIcon />
                            </IconButton>
                        </label>
                        {uploadingAvatar && (
                            <Box mt={2} display="flex" alignItems="center">
                                <Typography variant="body1" sx={{ mr: 2 }}>Uploading...</Typography>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Typography variant="h6">
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body1">Email: {user.email}</Typography>
                        <Typography variant="body1">Phone Number: {user.phoneNumber}</Typography>
                        <Box mt={2}>
                            <IconButton color="primary" onClick={handleLogout}>
                                <ExitToAppIcon /> Logout
                            </IconButton>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Bio Card */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Bio
                        </Typography>
                        <TextField
                            fullWidth
                            label="Bio"
                            value={bio}
                            onChange={handleBioChange}
                            multiline
                            rows={4}
                            variant="outlined"
                        />
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleBioSubmit}
                            startIcon={<EditIcon />}
                        >
                            Update Bio
                        </Button>
                    </CardActions>
                </Card>

                {/* Upload Video Button */}
                <Box mt={3}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenUploadModal}
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload Video
                    </Button>
                </Box>

                {/* Upload Video Dialog */}
                <Dialog open={openUploadModal} onClose={handleCloseUploadModal}>
                    <DialogTitle>Upload Video</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={videoData.title}
                            onChange={handleVideoChange}
                            required
                            sx={{ mt: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={videoData.description}
                            onChange={handleVideoChange}
                            multiline
                            rows={2}
                            variant="outlined"
                            sx={{ mt: 2 }}
                        />
                        <input
                            type="file"
                            accept="video/mp4"
                            onChange={handleFileChange}
                            required
                            style={{ display: 'block', marginTop: '16px' }}
                        />
                        {/* Uploading Progress Indicator */}
                        {uploading && (
                            <Box mt={2} display="flex" alignItems="center">
                                <Typography variant="body1" sx={{ mr: 2 }}>Uploading...</Typography>
                                <CircularProgress size={24} />
                            </Box>
                        )}
                        {/* Error Message Display */}
                        {errorMessage && (
                            <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                                {errorMessage}
                            </Typography>
                        )}
                    </DialogContent>
                    {/* Dialog Actions */}
                    <DialogActions>
                        <Button onClick={handleCloseUploadModal} color="secondary">
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleVideoSubmit}
                            disabled={uploading}
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar for Feedback */}
                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                {/* Display Uploaded Videos */}
                <Box mt={3}>
                    {videos.map((video) => (
                        <Card key={video._id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{video.title}</Typography>
                                <Typography variant="body1">{video.description}</Typography>
                                {/* Video Player */}
                                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
                                    <video controls width="100%" height="auto" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                                        <source src={`http://3.110.40.53/api/${video.path}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </CardContent>
                            {/* Optionally, add actions like edit or delete for each video */}
                        </Card>
                    ))}
                </Box>

            </Box>
        </Container>
    );
};

export default Dashboard;
