import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Avatar,
    Button,
    Divider,
    CircularProgress,
} from '@mui/material';

const UserListing = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://3.110.40.53/api/api/users');
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, []);

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
                    User Listing
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Browse the latest user uploads and their profiles
                </Typography>
            </Box>
            <Grid container spacing={4}>
                {users.map((user) => (
                    <Grid item xs={12} key={user._id}>
                        <Card elevation={3}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar
                                        sx={{ width: 56, height: 56, mr: 2 }}
                                        src={`http://3.110.40.53/api/uploads/profile-pics/${user.avatar}`}
                                    />
                                    <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
                                </Box>
                                <Box mt={2}>
                                    <Typography variant="body2">{user.bio}</Typography>
                                </Box>
                            </CardContent>
                            <Divider />
                            <CardContent>
                                <Grid container spacing={2}>
                                    {user.videos.slice(0, 3).map((video) => (
                                        <Grid item xs={12} sm={6} md={4} key={video._id}>
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
                                        </Grid>
                                    ))}
                                </Grid>
                                {user.videos.length > 3 && (
                                    <Box mt={2} textAlign="center">
                                        <Button
                                            component={Link}
                                            to={`/user/${user._id}/videos`}
                                            variant="outlined"
                                            color="primary"
                                        >
                                            View All Videos
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default UserListing;
