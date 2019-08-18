import { Button, Hidden, IconButton, Tooltip } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
    closeInfoPage,
    toggleModal,
} from "../../actions/actions";
import { addToFavourites } from "../../actions/getAuth";
import title_image from "../../img/riverwiki.jpg";
import { IState } from "../../reducers/index";
import {
    IAuth,
    IExpansionPanels,
    IInfoPage,
    IListEntry,
    ILogComplete,
    ILogListItem,
    IUser,
    IUserDetails,
} from "../../utils/types";
import Logbook from "../profile/Logbook";
import { CurrentWeather } from "./CurrentWeather";
import ExpansionHead from "./ExpansionHead";
import FlowChart from "./FlowChart";
import "./Info.css";
import InfoCard from "./InfoCard";
import KeyFactsCard from "./KeyFactsCard";
import LatestData from "./LatestData";
import MapCard from "./MapCard";
import { WeatherStore } from "./WeatherStore";

const logTypes: string[] = [
    "Public",
    "My logs",
];

const columnOrder: Array<keyof ILogListItem> = [
    "username",
    "rating",
    "participants",
    "flow",
    "start_date_time",
];

const columnOrderMobile: Array<keyof ILogListItem> = [
    "start_date_time",
    "username",
    "flow",
  ];

interface IInfoState {
    selectedType: string;
}

interface IInfoStateProps {
    auth: IAuth;
    infoPage: IInfoPage;
    weatherStore: WeatherStore;
    log: ILogComplete[];
    userDetails: IUserDetails;
    loadingSpinner: string;
    expansionPanels: IExpansionPanels;
    tabIndex: string;
}

interface IInfoProps extends IInfoStateProps {
    toggleModal: (modal?: string) => void;
    closeInfoPage: () => void;
    addToFavourites: (userDetails: IUser) => void;
    isLogbookInfo: boolean;
    viewHeight: string;
}

class Info extends Component<IInfoProps, IInfoState> {
    constructor(props: IInfoProps) {
        super(props);
        this.state = {
            selectedType: this.props.isLogbookInfo ? "My logs" : "Public",
        };
    }

    public openModal(modalName: string): void {
        this.props.toggleModal(modalName);
    }

    public handleClose = (): void => this.props.closeInfoPage();

    public toggleFavourite = (isFav: boolean): void => {
        const guideId: string = this.props.infoPage.selectedGuide.id;

        if (isFav) {
            const newUserDetails: IUser = {
                ...this.props.auth.user,
                user_favourites: this.props.auth.user.user_favourites.filter(
                    (item: string) => item !== guideId,
                ),
            };

            this.props.addToFavourites(newUserDetails);
        } else {
            const newUserDetails: IUser = {
                ...this.props.auth.user,
                user_favourites: this.props.auth.user.user_favourites.concat(guideId),
            };
            this.props.addToFavourites(newUserDetails);
        }
    }

    public onFavClick = (isFav: boolean): void => {
        if (this.props.auth.isAuthenticated) {
            this.toggleFavourite(isFav);
        } else {
            this.props.toggleModal("loginModal");
        }
    }

    public getFavButton = (): JSX.Element => {
        if (this.props.loadingSpinner === "favButton") {
            return (
                <CircularProgress/>
            );
        }

        const guideId: string = this.props.infoPage.selectedGuide.id;
        const isFav: boolean = this.props.auth.isAuthenticated &&
            this.props.auth.user.user_favourites &&
            this.props.auth.user.user_favourites.filter(
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
                onClick={(): void => {this.onFavClick(isFav); }}
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

    public getReportButton = (color: string): JSX.Element => {
        return (
            <div style={{float: "right", display: "flex"}}>
                {/* {this.props.auth.user.role === "riverguide_editor" && */}
                    <Button
                    variant="outlined"
                    style={{height: "fit-content", color, borderColor: color, marginRight: "10px"}}
                    onClick={(): void => {this.props.toggleModal("editModal"); }}
                    >
                        Edit
                    </Button>
                {/* } */}
                <Button
                    className="reporting-button"
                    variant="outlined"
                    style={{height: "fit-content", color, borderColor: color, marginRight: "10px"}}
                    onClick={this.openModal.bind(this, "addTripInfoPage")}
                >
                    Log a trip
                </Button>
            </div>
        );
    }

    public getCloseButton = (): JSX.Element => {
        return (
            <Tooltip
                title={"Close"}
                placement="top"
            >
            <Button
                onClick={this.handleClose}
                style={{
                    color: "white",
                    cursor: "pointer",
                }}
                component={RouterLink}
                to={`/${this.props.tabIndex}/`}
            >
                <CloseIcon />
            </Button>
            </Tooltip>
        );
    }

    public getFlowChart = (entry: IListEntry): JSX.Element | null => {
        if (entry.gauge_id) {
            return (
                    <Grid
                        item
                        md={12}
                        lg={12}
                        style={{
                            marginRight: "5%",
                            marginLeft: "5%",
                            marginTop: "2%",
                            marginBottom: "2%",
                            width: "100%",
                        }}
                    >
                        <LatestData />
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
                    <InfoCard
                        title="Description"
                        content={this.props.infoPage.itemDetails.description}
                        attribution={this.props.infoPage.itemDetails.attribution}
                    />
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
                    style={{marginRight: "5%", marginLeft: "5%", marginTop: "2%", marginBottom: "0", width: "100%"}}
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
                    key={item}
                    style = {{marginLeft: "10px"}}
                    variant={this.getButtonVariant(item)}
                    // color={this.getButtonColor(item)}
                    onClick = {(): void => this.selectTypeClick(item)}
                >
                    {item}
                </Button>,
            );
            return result;
    }

    public getLogBookEntries = (): ILogComplete[] => {
        if (this.state.selectedType === "Public") {
            return this.props.infoPage.logs || [];
        }
        return this.props.log.filter((item: ILogComplete) => item.guide_id === this.props.infoPage.selectedGuide.id);
    }

    public getLogbook = (): JSX.Element => {
        const visible: boolean = this.props.expansionPanels.logBook;
        return (
            <Grid
                item
                md={12}
                lg={12}
                style={{marginRight: "5%", marginLeft: "5%",  marginTop: "2%", marginBottom: "2%", width: "100%"}}
            >
                <div>
                <ExpansionHead title={"Log book"} panelName={"logBook"}/>
                {visible && <div className="flow-chart-buttons">
                        {this.getButtons()}
                    </div>}
                    {visible && <div><Hidden smDown>
                    <Logbook log={this.getLogBookEntries()} columnOrder={columnOrder} publicPage={true}/>
                </Hidden>
                    <Hidden mdUp>
                    <Logbook log={this.getLogBookEntries()} columnOrder={columnOrderMobile} publicPage={true}/>
                </Hidden></div>}
                </div>
            </Grid>
        );
    }

    public getMap = (entry: IListEntry): JSX.Element | null => {
        const guideId: string | undefined =
            this.props.infoPage.selectedGuide ? this.props.infoPage.selectedGuide.id : "";
        return (
            <Grid
                item
                xs={12}
                sm={12}
                style={{marginRight: "5%", marginLeft: "5%", marginTop: "2%", marginBottom: "2%"}}
            >
                <MapCard guideId={guideId}/>
            </Grid>);
    }

    public getMapButton = (): JSX.Element => {
        return (
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={(): void => {this.props.toggleModal("mapModal"); }}
                    style={{
                        height: "fit-content",
                        color: "black",
                        borderColor: "black",
                        marginRight: "15px",
                    }}
                >
                    {"Site map"}
               </Button>
        );
    }

    public getHeaderMobile = (entry: IListEntry, isData: boolean): JSX.Element => {
        return (
            <Grid
                container
                spacing={1}
                justify="space-between"
                style={{
                    margin: "20px 20px 0px 20px",
                }}
            >
            <Grid container item md={11} lg={11} justify="flex-start">
                    <div className="toolbar-middle">
                            <Typography variant="h2" style={{color: "black"}}>
                            {entry.display_name}
                            </Typography>
                            <Typography variant="h6" style={{color: "black"}}>
                            {`${entry.river_name}`}
                            </Typography>
                    </div>
            </Grid>
            {!isData &&
                        <Grid
                        container
                        item
                        spacing={0}
                        style={{display: "flex", flexDirection: "row"}}
                    >
                            {this.getMapButton()}
                        {(this.props.auth.isAuthenticated) && this.getReportButton("black")}
                    </Grid>
            }

        </Grid>
        );
    }

    public getEditButton = (color: string): JSX.Element => {
        return (
            <Button
                variant="outlined"
                style={{height: "fit-content", color, borderColor: color, float: "right"}}
                onClick={(): void => {this.props.toggleModal("editModal"); }}
            >
               Edit
            </Button>
        );
    }

    public getHeader = (entry: IListEntry, isData: boolean): JSX.Element => {
        const titleLength: number = entry.display_name.length;
        const titleSize: string = titleLength > 40 ? "h4" : "h1";
        return (
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
                            <Typography variant={titleSize as "h1" | "h3"} style={{color: "white"}}>
                            {entry.display_name}
                            </Typography>
                            <Typography variant="h6" style={{color: "white"}}>
                            {`${entry.river_name}`}
                            </Typography>
                    </div>
                        {this.getFavButton()}
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
                    <CurrentWeather
                        lat={entry.position.lat || 0}
                        lon={entry.position.lon || 0}
                        weatherStore={this.props.weatherStore}
                        onClick= {this.openModal.bind(this, "weatherModal")}
                        textColor = {"white"}
                        iconHeight={"60px"}
                        tempSize={"20px"}
                    />
                    {/* {(this.props.auth.isAuthenticated && !isData) && this.getEditButton("white")} */}
                    {(this.props.auth.isAuthenticated && !isData) && this.getReportButton("white")}
            </Grid>
        </Grid>
        );
    }

    public render(): JSX.Element {
        const entry: IListEntry = this.props.infoPage.selectedGuide;
        const isData: boolean = entry.activity === "data";
        const isLogbookInfo: boolean = this.props.isLogbookInfo;
        return (
            <Grid
                container
                item xs={12}
                spacing={0}
                justify="space-between"
                style={{float: "right", height: this.props.viewHeight}}
                className="right-panel"
            >
                <Hidden smDown>
                    {this.getHeader(entry, isData)}
                </Hidden>
                <Hidden mdUp>
                    {this.getHeaderMobile(entry, isData)}
                </Hidden>
                {/* {isLogbookInfo && this.getLogbook()} */}
                {!isLogbookInfo && this.getKeyFacts()}
                {!isLogbookInfo && this.getDescription()}
                {!isLogbookInfo && this.getFlowChart(entry)}
                {!isLogbookInfo && this.getMap(entry)}
                {!isData && this.getLogbook()}
                {/* <Grid
                    item
                    md={12}
                    lg={12}
                    style={{marginRight: "5%", marginLeft: "5%", marginTop: "2%", marginBottom: "0"}}
                >
                </Grid> */}
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
        expansionPanels: state.expansionPanels,
        tabIndex: state.tabIndex,
    });
}

export default connect(
    mapStateToProps,
    { closeInfoPage, addToFavourites, toggleModal },
)(Info);
