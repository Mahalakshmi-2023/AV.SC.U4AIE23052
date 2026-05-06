import {
    Card,
    CardContent,
    Typography,
    Chip
} from "@mui/material";

export default function NotificationCard({
    notification,
    viewed
}) {

    const getColor = () => {

        if (notification.Type === "Placement")
            return "success";

        if (notification.Type === "Result")
            return "primary";

        return "warning";
    };

    return (
        <Card
            sx={{
                marginBottom: 2,
                backgroundColor:
                    viewed ? "#f5f5f5" : "#ffffff",
                borderLeft:
                    viewed
                        ? "4px solid gray"
                        : "4px solid #1976d2"
            }}
        >

            <CardContent>

                <Typography variant="h6">
                    {notification.Message}
                </Typography>

                <Chip
                    label={notification.Type}
                    color={getColor()}
                    sx={{ marginTop: 1 }}
                />

                <Typography
                    variant="body2"
                    sx={{ marginTop: 1 }}
                >
                    {notification.Timestamp}
                </Typography>

            </CardContent>

        </Card>
    );
}