import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { connect } from "react-redux";
import title_image from "../../img/riverwiki.jpg";
import KeyFactsCard from "./KeyFactsCard";

import {
    addToFavourites,
    closeInfoPage,
    removeFromFavourites,
    toggleModal,
} from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IAuth, IInfoPage, IListEntry, IMarker } from "../../utils/types";
import { CurrentWeather } from "./CurrentWeather";
import "./Info.css";
import { WeatherStore } from "./WeatherStore";

// Material UI
import { Button, IconButton, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

// Components
import Logbook from "../profile/Logbook";
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
    isLogbookInfo: boolean;
}

class Info extends Component<IInfoProps, IInfoState> {
    constructor(props: IInfoProps) {
        super(props);
        const favourited: boolean = false;

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

    public getFlowChart = (entry: IListEntry): JSX.Element | null => {
        if (entry.gauge_id) {
            return (
                    <Grid
                        item
                        md={12}
                        lg={12}
                        style={{marginRight: "5%", marginLeft: "5%",  marginTop: "2%", marginBottom: "2%"}}
                    >
                        <FlowChart gaugeId={entry.gauge_id} />
                    </Grid>
                );
        }
        return null;
    }

    public getDescription = (): JSX.Element | null => {
        if (this.props.infoPage.itemDetails) {
            return (
                <Grid
                    item
                    xs={12}
                    sm={12}
                    style={{marginRight: "5%", marginLeft: "5%", marginTop: "1%", marginBottom: "2%"}}
                >
                    <InfoCard title="Description" content={this.props.infoPage.itemDetails.description} />
                </Grid>
            );
        }
        return null;
    }

    public getKeyFacts = (): JSX.Element | null => {
        if (this.props.infoPage.itemDetails) {
            return (
                <Grid
                    item
                    md={12}
                    lg={12}
                    style={{marginRight: "5%", marginLeft: "5%", marginTop: "2%", marginBottom: "0"}}
                >
                    <KeyFactsCard itemDetails={this.props.infoPage.itemDetails} />
                </Grid>
            );
        }
        return null;
    }

    public getLogbook = (): JSX.Element => {
        return (
            <Grid
            item
            md={12}
            lg={12}
            style={{marginRight: "5%", marginLeft: "5%", marginTop: "2%", marginBottom: "0"}}
        >
            <Logbook/>
        </Grid>
        );
    }

    public getMap = (entry: IListEntry): JSX.Element | null => {
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
        if (markerList && markerList.length > 0) {
            return (
                <Grid
                    item
                    xs={12}
                    sm={12}
                    style={{marginRight: "5%", marginLeft: "5%", marginTop: "2%", marginBottom: "2%"}}
                >
                    <MapCard markers={markerList} />
                </Grid>
            );
        }
        return null;
    }

    public render(): JSX.Element {
        const entry: IListEntry = this.props.infoPage.selectedGuide;
        const isLogbookInfo: boolean = this.props.isLogbookInfo;
        return (
            <Grid container item xs={12} spacing={0} justify="space-between" className="right-panel" >
                <Grid
                    container
                    item
                    xs={12}
                    spacing={3}
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
                        <Button color="secondary" onClick={this.openModal.bind(this, "editModal")}>
                            <EditIcon />
                        </Button>
                    </Grid>
                </Grid>
                {isLogbookInfo && this.getLogbook()}
                {!isLogbookInfo && this.getKeyFacts()}
                {!isLogbookInfo && this.getFlowChart(entry)}
                {!isLogbookInfo && this.getDescription()}
                {this.getMap(entry)}
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
