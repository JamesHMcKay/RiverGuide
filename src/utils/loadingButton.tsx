import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import React from "react";

function loadingButton(): JSX.Element {
    return (
            <CircularProgress
            size={24}
            style={{
                color: green[500],
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -12,
                marginLeft: -12,
            }}
        />
    );
}

export default loadingButton;
