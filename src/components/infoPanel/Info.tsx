import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { connect } from "react-redux";
import title_image from "../../img/riverwiki.jpg";
import Report from "../common/Report";
import KeyFactsCard from "./KeyFactsCard";

import {
    addToFavourites,
    closeInfoPage,
    removeFromFavourites,
    toggleModal,
} from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IAuth, IGuide, IInfoPage, IListEntry, IMarker } from "../../utils/types";
import FlowBadge from "../common/FlowBadge";
import { CurrentWeather } from "./CurrentWeather";
import "./Info.css";
import { IWeatherStore, WeatherStore } from "./WeatherStore";

// Material UI
import { Button, Chip, IconButton, Paper, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

// Components
import FlowChart from "./FlowChart";
import InfoCard from "./InfoCard";
import MapCard from "./MapCard";

interface IInfoState {
    favourited: boolean;
}

interface IInfoStateProps {
    auth: IAuth;
    infoPage: IInfoPage;
    weatherStore: WeatherStore;
}

interface IInfoProps extends IInfoStateProps {
    toggleModal: (modal?: string) => void;
    closeInfoPage: () => void;
    removeFromFavourites: (guideId: string, email: string) => void;
    addToFavourites: (guideId: string, email: string) => void;
}

class Info extends Component<IInfoProps, IInfoState> {
    constructor(props: IInfoProps) {
        super(props);
        let favourited: boolean = false;
        // if (props.auth.isAuthenticated) {
        //     favourited = props.auth.user.favourites.indexOf(
        //         props.infoPage.selectedGuide.id,
        //     ) > -1
        //         ? true
        //         : false;
        // }

        this.state = {
            favourited,
        };
    }

    public openModal(modalName: string): void {
        this.props.toggleModal(modalName);
    }

    public handleClose = (): void => this.props.closeInfoPage();

    public toggleFavourite = (): void => {
        const { favourited } = this.state;
        const guideId: string = this.props.infoPage.selectedGuide.id;
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
                    <FavoriteIcon style={{ color: "#fb1" }} />
                ) : (
                    <FavoriteBorder style={{ color: "#fff" }} />
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
            style={{height: "fit-content", color: "white", borderColor: "white"}}
            onClick={this.openModal.bind(this, "addTripInfoPage")}
             >
                Log a trip here
            </Button>
        );
    }

    public getCloseButton = (): JSX.Element => {
        return (
            <Button
            onClick={this.handleClose}
            style={{
                color: "white",
                cursor: "pointer",
            }}
            >
                <CloseIcon />
            </Button>
        );
    }

    public render(): JSX.Element {
        const entry: IListEntry = this.props.infoPage.selectedGuide;
        let markerList: IMarker[] | undefined =
            this.props.infoPage.itemDetails && this.props.infoPage.itemDetails.markerList;
        if (!markerList) {
            const marker: IMarker = {
                name: "Location",
                lat: entry.position.lat,
                lng: entry.position.lon || 0,
                id: "1",
                description: "",
                category: "",
            };
            markerList = [marker];
        }

        return (
            <Grid container item xs={12} spacing={0} justify="space-between" className="right-panel" >
            {/* <img src={title_image} alt="Feature image" /> */}
                <Grid
                    container
                    item xs={12}
                    spacing={24}
                    justify="space-between"
                    style={{
                        height: "200px",
                        margin: "0px",
                        backgroundImage: `url(${title_image})`,
                        backgroundRepeat: "no-repeat"}}>
                    <Grid container item md={11} lg={11} justify="flex-start">
                            <div className="toolbar-middle">
                                    <Typography variant="h3" style={{color: "white"}}>
                                    {entry.display_name}
                                    </Typography>
                                    <Typography variant="h6" style={{color: "white"}}>
                                    {`${entry.river_name} river  •  ${entry.region} `}
                                    </Typography>
                            </div>
                            {this.getFavButton()}
                    </Grid>
                    <Grid container item md={1} lg={1} justify="flex-end">
                    {/* {this.getTags("", "", "")} */}
                            {this.getCloseButton()}
                    </Grid>
                    <Grid container item md={6} lg={6} justify="flex-start">
                        <CurrentWeather
                            lat={entry.position.lat || 0}
                            lon={entry.position.lon || 0}
                            weatherStore={this.props.weatherStore}
                            onClick= {this.openModal.bind(this, "weatherModal")}
                            textColor = {"white"}
                        />
                    </Grid>
                    <Grid container item md={6} lg={6} justify="flex-end">
                    {this.getReportButton()}
                    </Grid>
                </Grid>

                {/* <FlowBadge siteName={this.props.entry.gaugeName} /> */}
                {this.props.infoPage.itemDetails &&
                    <Grid
                        item
                        md={12}
                        lg={12}
                        style={{marginRight: "5%", marginLeft: "5%", marginTop: "2%", marginBottom: "0"}}
                        >
                        <KeyFactsCard itemDetails={this.props.infoPage.itemDetails} />
                    </Grid>
                }
                {entry.gauge_id &&
                <Grid
                item
                md={12}
                lg={12}
                style={{marginRight: "5%", marginLeft: "5%",  marginTop: "2%", marginBottom: "2%"}}
                >
                       <FlowChart gaugeId={entry.gauge_id} />
                </Grid> }

                {this.props.infoPage.itemDetails &&
                <Grid
                item
                xs={12}
                sm={12}
                style={{marginRight: "5%", marginLeft: "5%", marginTop: "1%", marginBottom: "2%"}}
                >
                        <InfoCard title="Description" content={this.props.infoPage.itemDetails.description} />
                </Grid>}
                <Grid
                item
                xs={12}
                sm={12}
                style={{marginRight: "5%", marginLeft: "5%", marginTop: "2%", marginBottom: "2%"}}
                >
                    {markerList && markerList.length > 0 && (
                            <MapCard markers={markerList} />
                    )}
                </Grid>
                <Grid item xs={12} sm={12}>
                    <div
                        style={{
                            marginLeft: "93%",
                            padding: "1em 0",
                        }}
                    >
                        <Tooltip title={"Edit " + entry.display_name} placement="left">
                            <Button color="secondary" onClick={this.openModal.bind(this, "editModal")}>
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
        weatherStore: state.weatherStore,
    });
}

export default connect(
    mapStateToProps,
    { closeInfoPage, addToFavourites, removeFromFavourites, toggleModal },
)(Info);
