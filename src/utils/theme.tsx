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
            main: "#ffffff", // green: #28a745, orange: #ff5a10
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
      subtitle2: {
        fontSize: "1.3em",
        fontWeight: 400,
      },
      h1: {
        fontSize: "3em",
        [breakpoints.down(1500)]: {
          fontSize: "2em",
        },
        [breakpoints.down("md")]: {
          fontSize: "1.5em",
        },
      },
      h2: {
        fontSize: "1.5em",
        fontWeight: 600,
        [breakpoints.down(1500)]: {
          fontSize: "1.3em",
        },
        [breakpoints.down("md")]: {
          fontSize: "1em",
        },
      },
      h3: {
        fontSize: "1.5em",
        fontWeight: "bold",
        [breakpoints.down("md")]: {
          fontSize: "1.5em",
        },
      },
      h4: {
        fontSize: "2em",
        [breakpoints.down(1500)]: {
          fontSize: "1.5em",
        },
        [breakpoints.down("md")]: {
          fontSize: "1.5em",
        },
      },
    },
  },
};

export default theme;
