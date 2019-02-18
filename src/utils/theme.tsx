import { createMuiTheme, Theme } from "@material-ui/core/styles";

const theme: Theme = createMuiTheme({
    typography: {
        useNextVariants: true,
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
