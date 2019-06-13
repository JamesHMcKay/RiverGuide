import { createMuiTheme, Theme } from "@material-ui/core/styles";

const theme: Theme = createMuiTheme({
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
          ].join(","),
    },
    palette: {
        primary: {
            main: "#1e87e5",
        },
        secondary: {
            main: "#28a745", // green: #28a745, orange: #ff5a10
        },
        // indicator: {
        //     main: "#fff"
        // }
    },
});

export default theme;
