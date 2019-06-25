import { createMuiTheme, Theme } from "@material-ui/core/styles";

const defaultTheme: Theme = createMuiTheme({
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

const { breakpoints } = defaultTheme;

const theme: Theme = {
  ...defaultTheme,
  overrides: {
    MuiTypography: {
        subtitle1: {
        fontSize: "16px",
        [breakpoints.down("md")]: {
          fontSize: "16px",
        },
      },
      h2: {
        fontSize: "3em",
        [breakpoints.down("md")]: {
          fontSize: "1.5em",
        },
      },
    },
  },
};

export default theme;
