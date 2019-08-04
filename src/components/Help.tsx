import { createStyles, Divider, List, ListItem, Theme } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Route, Switch } from "react-router-dom";
import about from "../content/about.json";
import code_of_conduct from "../content/code_of_conduct.json";
import privacy_statement from "../content/privacy_statement.json";
import terms_of_service from "../content/terms_of_service.json";

const drawerWidth: string = "25%";

export interface IHelpPages {
    route: string;
    content: string[];
    title: string;
    effectiveDate?: string;
    linkTitle: string;
}

export const helpPages: IHelpPages[] = [
    {
        route: "/about",
        content: [about.about],
        title: "Data for good",
        linkTitle: "Data for good",
    },
    {
        route: "/legal/terms",
        content: [terms_of_service.introduction, terms_of_service.body],
        title: "RiverGuide Terms of Service",
        effectiveDate: "August 3 2019",
        linkTitle: "Terms of Service",
    },
    {
        route: "/legal/privacy",
        content: [privacy_statement.introduction, privacy_statement.body],
        title: "RiverGuide Privacy Statement",
        effectiveDate: "August 3 2019",
        linkTitle: "Privacy Statement",
    },
    {
        route: "/legal/conduct",
        content: [code_of_conduct.code_of_conduct],
        title: "RiverGuide Code of Conduct",
        effectiveDate: "August 3 2019",
        linkTitle: "Code of Conduct",
    },
];

const styles: any = (theme: Theme): any => createStyles({
    root: {
        display: "flex",
        borderTop: "1px solid #e6e6eb",
        overflowY: "scroll",
      },
      drawer: {
        [theme.breakpoints.up("sm")]: {
          paddingTop: "20px",
          width: drawerWidth,
          flexShrink: 0,
        },
      },
      appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up("sm")]: {
          width: `calc(100% - ${drawerWidth}px)`,
        },
      },
      menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
          display: "none",
        },
      },
      toolbar: theme.mixins.toolbar,
      drawerPaper: {
        width: drawerWidth,
      },
      content: {
        // flexGrow: 1,
        width: "100%",
        padding: theme.spacing(3),
        [theme.breakpoints.up("sm")]: {
            width: "58.3%",
          },
      },
      textBody: {
        display: "flex",
        width: "90%",
        [theme.breakpoints.up("sm")]: {
            width: "70%",
        },
        marginLeft: "auto",
        marginRight: "auto"},

  });

export const CONTENT_HEIGHT_MOBILE: string = "67vh";
export const CONTENT_HEIGHT: string = "82vh";

export interface IHelpState {
    route: string;
}

export interface IHelpProps {
    history: any;
    classes: any;
}

class Help extends Component<IHelpProps, IHelpState> {
    constructor(props: IHelpProps) {
        super(props);
        this.state = {
            route: "/legal/terms",
        };
    }

    public changePage = (route: string): void => {
        this.setState({
            route,
        });
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.textBody}>
                    <nav className={classes.drawer} aria-label="mailbox folders">
                        <Hidden xsDown implementation="css">
                            <List>
                                {helpPages.map((item: IHelpPages) =>
                                    <ListItem key={item.linkTitle}>
                                        <Link
                                            style={{textDecoration: "bold"}}
                                            to={item.route}
                                            onClick={(e: any): void => {this.changePage(item.route); }}
                                        >
                                            {item.linkTitle}
                                        </Link>
                                    </ListItem>,
                                    )}
                                </List>
                        </Hidden>
                    </nav>
                    <Switch>
                    {helpPages.map((item: IHelpPages) =>
                                    <Route
                                    exact
                                    path={item.route}
                                 >
                                    <main className={classes.content}>
                                    <Typography variant="h2" gutterBottom>
                                        {item.title}
                                    </Typography>
                                    {item.effectiveDate &&
                                        <Typography
                                            variant="subtitle1"
                                            gutterBottom
                                            style={{color: "#6d6d78", paddingTop: "20px", paddingBottom: "20px"}}
                                        >
                                            {"Effective " + item.effectiveDate}
                                        </Typography>
                                    }

                                    <Divider/>
                                    {item.content.map((item: string) =>
                                        <div>
                                            <Typography
                                                component="div"
                                                style={{
                                                    paddingTop: "20px",
                                                    paddingBottom: "30px",
                                                    textAlign: "justify",
                                                }}>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: item,
                                                    }}
                                                />
                                            </Typography>
                                            <Divider/>
                                        </div>,
                                        )}
                                    </main>
                                </Route>,
                        )}
                    </Switch>
                    </div>
            </div>
        );
    }
}

export default connect(
    null,
    ({}),
)(withStyles(styles)(Help));
