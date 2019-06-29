import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    closeInfoPage,
    removeFromFavourites,
    toggleModal,
} from "../../actions/actions";
import { addToFavourites } from "../../actions/getAuth";
import title_image from "../../img/riverwiki.jpg";
import { IState } from "../../reducers/index";
import { IAuth, IInfoPage, IListEntry, ILogComplete, ILogListItem, IMarker, IUserDetails } from "../../utils/types";
import { CurrentWeather } from "./CurrentWeather";
import "./Info.css";
import KeyFactsCard from "./KeyFactsCard";
import { WeatherStore } from "./WeatherStore";

// Material UI
import { Button, Hidden, IconButton, Tooltip } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import CloseIcon from "@material-ui/icons/Close";
// import EditIcon from "@material-ui/icons/Edit";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

// Components
import Logbook from "../profile/Logbook";
import FlowChart from "./FlowChart";
import InfoCard from "./InfoCard";
import LatestData from "./LatestData";
import MapCard from "./MapCard";

const logTypes: string[] = [
    "Public",
    "My logs",
];

const columnOrder: Array<keyof ILogListItem> = [
    "start_date_time",
    "username",
    "rating",
    "participants",
    "flow",
  ];

interface IInfoState {
    selectedType: string;
    descriptionHidden: boolean;
}

interface IInfoStateProps {
    auth: IAuth;
    infoPage: IInfoPage;
    weatherStore: WeatherStore;
    log: ILogComplete[];
    userDetails: IUserDetails;
    loadingSpinner: string;
}

interface IInfoProps extends IInfoStateProps {
    toggleModal: (modal?: string) => void;
    closeInfoPage: () => void;
    removeFromFavourites: (guideId: string, email: string) => void;
    addToFavourites: (userDetails: IUserDetails) => void;
    isLogbookInfo: boolean;
    viewHeight: string;
}

class Info extends Component<IInfoProps, IInfoState> {
    constructor(props: IInfoProps) {
        super(props);
        this.state = {
            selectedType: "Public",
            descriptionHidden: false,
        };
    }

    public openModal(modalName: string): void {
        this.props.toggleModal(modalName);
    }

    public handleClose = (): void => this.props.closeInfoPage();

    public toggleFavourite = (isFav: boolean): void => {
        const guideId: string = this.props.infoPage.selectedGuide.id;

        if (isFav) {
            const newUserDetails: IUserDetails = {
                ...this.props.userDetails,
                user_favourites: this.props.userDetails.user_favourites.filter(
                    (item: string) => item !== guideId,
                ),
            };

            this.props.addToFavourites(newUserDetails);
        } else {
            const newUserDetails: IUserDetails = {
                ...this.props.userDetails,
                user_favourites: this.props.userDetails.user_favourites.concat(guideId),
            };
            this.props.addToFavourites(newUserDetails);
        }
    }

    public getFavButton = (): JSX.Element => {
        if (this.props.loadingSpinner === "favButton") {
            return (
                <CircularProgress/>
            );
        }

        const guideId: string = this.props.infoPage.selectedGuide.id;
        const isFav: boolean = this.props.userDetails.user_favourites.filter(
            (item: string) => item === guideId,
        ).length > 0;

        return (
            <Tooltip
                title={
                    isFav
                        ? "Remove from favourites"
                        : "Add to favourites"
                }
                placement="right"
            >
            <IconButton
                onClick={(): void => {this.toggleFavourite(isFav); }}
            >
                {isFav ? (
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
                style={{height: "fit-content", color: "white", borderColor: "white", float: "right"}}
                onClick={this.openModal.bind(this, "addTripInfoPage")}
             >
                Log a trip
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
                        <LatestData />
                        <FlowChart gaugeId={entry.gauge_id} />
                    </Grid>
                );
        }
        return null;
    }

    public toggleDescription = (): void => {
        this.setState({
            descriptionHidden: !this.state.descriptionHidden,
        });
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
                    <Button onClick={this.toggleDescription}> "Hide description"</Button>
                    {!this.state.descriptionHidden && <InfoCard
                        title="Description"
                        content={this.props.infoPage.itemDetails.description}
                        />
                    }
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

    public selectTypeClick(type: string): void {
        this.setState({
            selectedType: type,
        });
    }

    public getButtonColor(type: string): "inherit" | "primary" | "secondary" | "default" | undefined {
        if (type === this.state.selectedType) {
            return "primary";
        }
        return "default";
    }

    public getButtonVariant(type: string):
        "text" | "outlined" | "contained" | undefined {
        if (type === this.state.selectedType) {
            return "contained";
        }
        return "outlined";
    }

    public getButtons = (): JSX.Element[] => {
            const result: JSX.Element[] = logTypes.map((item: string) =>
                <Button
                    style = {{marginLeft: "10px"}}
                    variant={this.getButtonVariant(item)}
                    color={this.getButtonColor(item)} key={item}
                    onClick = {(): void => this.selectTypeClick(item)}
                >
                    {item}
                </Button>);
            return result;
    }

    public getLogBookEntries = (): ILogComplete[] => {
        if (this.state.selectedType === "Public") {
            return this.props.infoPage.logs || [];
        }
        return this.props.log.filter((item: ILogComplete) => item.guide_id === this.props.infoPage.selectedGuide.id);
    }

    public getLogbook = (): JSX.Element => {
        return (
            <Grid
            container
            item
            md={12}
            lg={12}
            justify="space-between"
            style={{marginRight: "5%", marginLeft: "5%",  marginTop: "2%", marginBottom: "2%"}}
        >
            {/* <Grid container item xs={12} spacing={10} justify="space-between"> */}
            <Grid container item md={6} lg={6} justify="flex-start">
                <Typography variant="h5" gutterBottom>
                    Logbook
                </Typography>
            </Grid>
            <Grid container item md={6} lg={6} justify="flex-end">
                    {this.getButtons()}
            </Grid>
            <Logbook log={this.getLogBookEntries()} columnOrder={columnOrder} publicPage={true}/>
        </Grid>
        // </Grid>
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
            <Grid
                container
                item xs={12}
                spacing={0}
                justify="space-between"
                style={{float: "right"}}
                className="right-panel"
            >
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
                                    <Typography variant="h2" style={{color: "white"}}>
                                    {entry.display_name}
                                    </Typography>
                                    <Typography variant="h6" style={{color: "white"}}>
                                    {`${entry.river_name} river  •  ${entry.region} `}
                                    </Typography>
                            </div>
                            <Hidden smDown>
                                {this.props.auth.isAuthenticated && this.getFavButton()}
                            </Hidden>
                    </Grid>
                    <Grid container item md={1} lg={1} justify="flex-end">
                            <Hidden smDown>
                                {this.getCloseButton()}
                            </Hidden>
                        </Grid>
                    <Grid
                        container
                        item
                        spacing={0}
                        justify="space-between"
                        style={{display: "flex", flexDirection: "row"}}
                    >
                        {/* <Grid item sm={12} md={12} justify="flex-start"> */}
                            <CurrentWeather
                                lat={entry.position.lat || 0}
                                lon={entry.position.lon || 0}
                                weatherStore={this.props.weatherStore}
                                onClick= {this.openModal.bind(this, "weatherModal")}
                                textColor = {"white"}
                            />
                        {/* </Grid>
                        <Grid item sm={12} md={12} justify="flex-end"> */}
                            {this.props.auth.isAuthenticated && this.getReportButton()}
                            {/* {this.props.auth.isAuthenticated &&
                                <Button color="secondary" onClick={this.openModal.bind(this, "editModal")}>
                                    <EditIcon />
                                </Button>
                            } */}
                        {/* </Grid> */}
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
        log: state.log,
        userDetails: state.userDetails,
        loadingSpinner: state.loadingSpinner,
    });
}

export default connect(
    mapStateToProps,
    { closeInfoPage, addToFavourites, removeFromFavourites, toggleModal },
)(Info);
