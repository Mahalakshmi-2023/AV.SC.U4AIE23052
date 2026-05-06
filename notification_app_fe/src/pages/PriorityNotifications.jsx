import {
    Container,
    Typography
} from "@mui/material";

import { useEffect, useState } from "react";

import API from "../services/api";

import NotificationCard
from "../components/NotificationCard";

export default function PriorityNotifications() {

    const [notifications, setNotifications] =
        useState([]);

    useEffect(() => {

        fetchNotifications();

    }, []);

    function calculateScore(notification) {

        const weights = {
            Placement: 3,
            Result: 2,
            Event: 1
        };

        return (
            weights[notification.Type] * 1000000000
            +
            new Date(notification.Timestamp).getTime()
        );
    }

    async function fetchNotifications() {

        try {

            const response =
                await API.get(
                    "/notifications?limit=50"
                );

            const sorted =
                response.data.notifications
                    .map((n) => ({
                        ...n,
                        score: calculateScore(n)
                    }))
                    .sort((a, b) =>
                        b.score - a.score
                    )
                    .slice(0, 10);

            setNotifications(sorted);

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
                Priority Notifications
            </Typography>

            {
                notifications.map((notification) => (

                    <NotificationCard
                        key={notification.ID}
                        notification={notification}
                        viewed={false}
                    />
                ))
            }

        </Container>
    );
}