import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import Report from "../common/Report";

import {
    addToFavourites,
    closeInfoPage,
    removeFromFavourites,
    toggleModal,
} from "../../actions/actions";
import { State } from "../../reducers/index";
import { IAuth, IGauge, IGuide, IInfoPage } from "../../utils/types";
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

// Components
import HistoryCard from "./HistoryCard";
import InfoCard from "./InfoCard";
import MapCard from "./MapCard";

interface IInfoState {
    weatherStore: WeatherStore;
    favourited: boolean;
}

interface IInfoProps {
    auth: IAuth;
    toggleModal: (modal?: string) => void;
    gauges: IGauge[];
    infoPage: IInfoPage;
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

    public openModal(modalName: string) {
        this.props.toggleModal(modalName);
    }

    public handleClose = () => this.props.closeInfoPage();

    public getLastUpdated() {
        return (
            <p className="last-updated-flow">
                <em>
                    Flow Data Last Updated: {this.filterGauges()[0].lastUpdated}
                </em>
            </p>
        );
    }

    public filterGauges() {
        const guide = this.props.guide;

        if (!guide.gaugeName) {
            return [];
        }

        return this.props.gauges.filter(
            (gauge) =>
                (this.props.guide.gaugeName && gauge.siteName.toLowerCase() ===
                this.props.guide.gaugeName.toLowerCase()),
        );
    }

    public toggleFavourite = () => {
        const { favourited } = this.state;
        const guideId = this.props.infoPage.selectedGuide._id;
        const { email } = this.props.auth.user;

        this.setState({ favourited: !favourited });
        if (favourited) {
            this.props.removeFromFavourites(guideId, email);
        } else {
            this.props.addToFavourites(guideId, email);
        }
    }

    public getTags = (activity?: string, grade?: string, catch_type?: string) => {
        const gradeTag = grade && "Grade " + grade;
        return (
        [activity, gradeTag, catch_type]
        .filter((tag) => tag)
        .map((tag) => (
            <Chip
                key={tag}
                color="secondary"
                variant="outlined"
                label={tag}
                style={{ margin: "0 .5em" }}
            />
        )));
    }

    public render() {
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
        } = this.props.infoPage.selectedGuide;

        const testDisplay = (
            <div>
                <div
                    style={{
                        width: "100%",
                        height: "10em",
                        backgroundColor: "#459BE8",
                    }}
                >
                    <div
                        style={{
                            position: "fixed",
                            margin: ".5em",
                        }}
                    >
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
                    </div>
                    <h1
                        style={{
                            textAlign: "center",
                            color: "#fff",
                            paddingTop: "1em",
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        style={{
                            textAlign: "center",
                            color: "#fff",
                        }}
                    >
                        {`----- ${river}  •  ${region} -----`}
                    </p>
                </div>
                <div
                    className="tags"
                    style={{ margin: "1em", textAlign: "center" }}
                >
                   {this.getTags(activity, grade, catch_type)}
                        <Button
                    className="reporting-button"
                    variant="outlined"
                    onClick={this.openModal.bind(this, "reportModal")}
                >
                    Going today?
                </Button>
                <Button
                    className="reporting-button"
                    variant="outlined"
                    onClick={this.openModal.bind(this, "reportModal")}
                >
                    Report a trip
                </Button>
                <FlowBadge siteName={this.props.guide.gaugeName} />
                <CurrentWeather
                        lat={this.props.guide.lat || 0}
                        lon={this.props.guide.lng || 0}
                        weatherStore={this.state.weatherStore}
                />
                <Report />
                </div>
                {this.filterGauges().length > 0 && this.getLastUpdated()}
                <div className="flow-weather-section">
                    {gaugeName && (<HistoryCard />)}
                    <WeatherForecast
                        lat={this.props.guide.lat || 0}
                        lon={this.props.guide.lng || 0}
                        weatherStore={this.state.weatherStore}
                    />
                </div>

                                    <div style={{ margin: "1em" }}>
                    <InfoCard title="Description" content={description} />
                </div>
                {markers.length > 0 && (
                    <div style={{ margin: "1em", paddingBottom: "1em" }}>
                        <MapCard markers={markers} />
                    </div>
                )}
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
            </div>
        );

        return (
            <Paper>
                <div
                    style={{
                        position: "fixed",
                        marginLeft: "65%",
                        marginTop: "1vh",
                    }}
                >

                    <IconButton
                        onClick={this.handleClose}
                        style={{
                            color: "#fff",
                            cursor: "pointer",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                {testDisplay}
            </Paper>
        );
    }
}
Info.propTypes = {
    auth: PropTypes.object.isRequired,
    gauges: PropTypes.array.isRequired,
    infoPage: PropTypes.object.isRequired,
};

const mapStateToProps = (state: State) => ({
    auth: state.auth,
    gauges: state.gauges,
    infoPage: state.infoPage,
});

export default connect(
    mapStateToProps,
    { closeInfoPage, addToFavourites, removeFromFavourites, toggleModal },
)(Info);
