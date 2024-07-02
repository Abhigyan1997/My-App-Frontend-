import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
} from '@mui/material';

const UserVideos = () => {
    const { userId } = useParams();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserVideos = async () => {
            try {
                const response = await axios.get(`http://3.110.40.53/api/api/user/${userId}/videos`);
                setVideos(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false); // Stop loading even if there's an error
            }
        };
        fetchUserVideos();
    }, [userId]);

    if (loading) {
        return (
            <Container maxWidth="md">
                <Box sx={{ mt: 5, textAlign: 'center' }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 5, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    User Videos
                </Typography>
                <Grid container spacing={4}>
                    {videos.map((video) => (
                        <Grid item xs={12} sm={6} md={4} key={video._id}>
                            <Card elevation={3}>
                                <CardMedia
                                    component="video"
                                    src={`http://3.110.40.53/api/${video.path}`}
                                    controls
                                    title={video.title}
                                    sx={{ height: 140 }}
                                />
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {video.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {video.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default UserVideos;
