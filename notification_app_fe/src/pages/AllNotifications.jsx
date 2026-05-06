import {
    Container,
    Typography,
    MenuItem,
    Select,
    Pagination
} from "@mui/material";

import { useEffect, useState } from "react";

import API from "../services/api";

import NotificationCard
from "../components/NotificationCard";

export default function AllNotifications() {

    const [notifications, setNotifications] =
        useState([]);

    const [page, setPage] = useState(1);

    const [type, setType] = useState("");

    useEffect(() => {

        fetchNotifications();

    }, [page, type]);

    async function fetchNotifications() {

        try {

            let url =
                `/notifications?page=${page}&limit=10`;

            if (type) {
                url += `&notification_type=${type}`;
            }

            const response =
                await API.get(url);

            setNotifications(
                response.data.notifications
            );

        } catch (error) {

            console.log(error);
        }
    }

    return (

        <Container sx={{ marginTop: 4 }}>

            <Typography
                variant="h4"
                gutterBottom
            >
                All Notifications
            </Typography>

            <Select
                fullWidth
                value={type}
                onChange={(e) =>
                    setType(e.target.value)
                }
                sx={{ marginBottom: 3 }}
            >

                <MenuItem value="">
                    All
                </MenuItem>

                <MenuItem value="Event">
                    Event
                </MenuItem>

                <MenuItem value="Result">
                    Result
                </MenuItem>

                <MenuItem value="Placement">
                    Placement
                </MenuItem>

            </Select>

            {
                notifications.map((notification) => (

                    <NotificationCard
                        key={notification.ID}
                        notification={notification}
                        viewed={Math.random() > 0.5}
                    />
                ))
            }

            <Pagination
                count={10}
                page={page}
                onChange={(e, value) =>
                    setPage(value)
                }
                sx={{ marginTop: 3 }}
            />

        </Container>
    );
}