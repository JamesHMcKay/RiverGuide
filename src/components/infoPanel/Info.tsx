import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { connect } from "react-redux";
import Report from "../common/Report";

import {
    addToFavourites,
    closeInfoPage,
    removeFromFavourites,
    toggleModal,
} from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IAuth, IGuide, IInfoPage } from "../../utils/types";
import FlowBadge from "../common/FlowBadge";
import { CurrentWeather } from "./CurrentWeather";
import "./Info.css";
import { WeatherForecast } from "./WeatherForecast";
import { IWeatherStore, WeatherStore } from "./WeatherStore";

// Material UI
import { Button, Chip, IconButton, Paper, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import StarBorderIcon from "@material-ui/icons/StarBorderRounded";
import StarIcon from "@material-ui/icons/StarRounded";

import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";

// Components
import FlowChart from "./FlowChart";
import InfoCard from "./InfoCard";
import MapCard from "./MapCard";

interface IInfoState {
    weatherStore: WeatherStore;
    favourited: boolean;
}

interface IInfoStateProps {
    auth: IAuth;
    infoPage: IInfoPage;
}

interface IInfoProps extends IInfoStateProps {
    toggleModal: (modal?: string) => void;
    closeInfoPage: () => void;
    guide: IGuide;
    removeFromFavourites: (guideId: string, email: string) => void;
    addToFavourites: (guideId: string, email: string) => void;
}

class Info extends Component<IInfoProps, IInfoState> {
    constructor(props: IInfoProps) {
        super(props);
        let favourited: boolean = false;
        if (props.auth.isAuthenticated) {
            favourited = props.auth.user.favourites.indexOf(
                props.infoPage.selectedGuide._id,
            ) > -1
                ? true
                : false;
        }

        this.state = {
            weatherStore: new WeatherStore(),
            favourited,
        };
    }

    public openModal(modalName: string): void {
        this.props.toggleModal(modalName);
    }

    public handleClose = (): void => this.props.closeInfoPage();

    public toggleFavourite = (): void => {
        const { favourited } = this.state;
        const guideId: string = this.props.infoPage.selectedGuide._id;
        const { email } = this.props.auth.user;

        this.setState({ favourited: !favourited });
        if (favourited) {
            this.props.removeFromFavourites(guideId, email);
        } else {
            this.props.addToFavourites(guideId, email);
        }
    }

    public getTags = (activity?: string, grade?: string, catchType?: string): JSX.Element[] => {
        const gradeTag: string | undefined = grade && "Grade " + grade;
        return (
        [activity, gradeTag, catchType]
        .filter((tag: string | undefined) => tag)
        .map((tag: string | undefined) => (
            <Chip
                key={tag}
                color="secondary"
                variant="outlined"
                label={tag}
                style={{ margin: "0 .5em" }}
            />
        )));
    }

    public getFavButton = (): JSX.Element => {
        return (
            <Tooltip
                title={
                    this.state.favourited
                        ? "Remove from favourites"
                        : "Add to favourites"
                }
                placement="right"
            >
            <IconButton onClick={this.toggleFavourite}>
                {this.state.favourited ? (
                    <StarIcon style={{ color: "#fb1" }} />
                ) : (
                    <StarBorderIcon style={{ color: "#fff" }} />
                )}
                </IconButton>
            </Tooltip>
        );
    }

    public getReportButton = (): JSX.Element => {
        return (
            <Button
            className="reporting-button"
            variant="outlined"
            onClick={this.openModal.bind(this, "addTripInfoPage")}
             >
                Report a trip here
            </Button>
        );
    }

    public getCloseButton = (): JSX.Element => {
        return (
            <IconButton
            onClick={this.handleClose}
            style={{
                color: "#fff",
                cursor: "pointer",
            }}
            >
                <CloseIcon />
            </IconButton>
        );
    }

    public getKeyFacts = (): JSX.Element => {

        return (
          <List >
            <ListItem>
              <Avatar>
                <ImageIcon />
              </Avatar>
              <ListItemText primary="Photos" secondary="Jan 9, 2014" />
            </ListItem>
            <li>
              <Divider variant="inset" />
            </li>
            <ListItem>
              <Avatar>
                <WorkIcon />
              </Avatar>
              <ListItemText primary="Work" secondary="Jan 7, 2014" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem>
              <Avatar>
                <BeachAccessIcon />
              </Avatar>
              <ListItemText primary="Vacation" secondary="July 20, 2014" />
            </ListItem>
          </List>
        );
      }

    public render(): JSX.Element {
        const {
            title,
            description,
            river,
            region,
            grade,
            catch_type,
            activity,
            gaugeName,
            markers,
        }: IGuide = this.props.infoPage.selectedGuide;

        return (
            <Grid container spacing={24} justify="space-between" className = "right-panel">
            <Grid item md={12} lg={12}>
                <AppBar position="static">
                    <Toolbar>
                    <IconButton  color="inherit" aria-label="Menu">
                        {/* <MenuIcon /> */}
                    </IconButton>
                    <Typography variant="h6" color="inherit" >
                    {title}
                    {` ${river} river  •  ${region} `}
                    </Typography>
                    {this.getTags(activity, grade, catch_type)}
                    {this.getReportButton()}
                    {this.getCloseButton()}
                    </Toolbar>
                </AppBar>
            </Grid>
                {/* <FlowBadge siteName={this.props.guide.gaugeName} /> */}
                {/* <CurrentWeather
                        lat={this.props.guide.lat || 0}
                        lon={this.props.guide.lng || 0}
                        weatherStore={this.state.weatherStore}
                /> */}
                                        {/*
                        <WeatherForecast
                            lat={this.props.guide.lat || 0}
                            lon={this.props.guide.lng || 0}
                            weatherStore={this.state.weatherStore}
                        /> */}

                        <Grid item md={12} lg={4}>
                                {this.getKeyFacts()}
                        </Grid>
                        <Grid item md={12} lg={8}>
                                {gaugeName && (<FlowChart guide={this.props.guide} />)}
                        </Grid>

                        <Grid item xs={12} sm={12}>
                            <div style={{ margin: "1em" }}>
                                <InfoCard title="Description" content={description} />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12}>

                            {markers.length > 0 && (
                                <div style={{ margin: "1em", paddingBottom: "1em" }}>
                                    <MapCard markers={markers} />
                                </div>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={12}>
                        <div
                            style={{
                                marginLeft: "93%",
                                padding: "1em 0",
                            }}
                        >
                            <Tooltip title={"Edit " + title} placement="left">
                                <Button variant="fab" color="secondary">
                                    <EditIcon />
                                </Button>
                            </Tooltip>
                        </div>
                 </Grid>
            </Grid>
        );
    }
}

function mapStateToProps(state: IState): IInfoStateProps {
    return ({
        auth: state.auth,
        infoPage: state.infoPage,
    });
}

export default connect(
    mapStateToProps,
    { closeInfoPage, addToFavourites, removeFromFavourites, toggleModal },
)(Info);
