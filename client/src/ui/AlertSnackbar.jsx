import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";

export default function AlertSnackbar({
    open,
    message,
    severity = "info",
    duration = 4000,
    position = { vertical: "bottom", horizontal: "center" },
    onClose,
}) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={onClose}
            anchorOrigin={position}
        >
            <Alert
                onClose={onClose}
                severity={severity}
                variant="filled"
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
