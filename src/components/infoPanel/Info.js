import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Report from "../common/Report";

import {
    toggleModal,
    closeInfoPage,
    addToFavourites,
    removeFromFavourites
} from "../../actions/actions";
import "./Info.css";
import { WeatherForecast } from './WeatherForecast'
import { CurrentWeather } from './CurrentWeather';
import { WeatherStore } from './WeatherStore';
import FlowBadge from "../common/FlowBadge";

// Material UI
import { Button, Chip, Paper, Tooltip, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import StarBorderIcon from "@material-ui/icons/StarBorderRounded";
import StarIcon from "@material-ui/icons/StarRounded";

// Components
import InfoCard from "./InfoCard";
import HistoryCard from "./HistoryCard";
import MapCard from "./MapCard";

class Info extends Component {
    constructor(props) {
        super(props);
        let favourited = [];
        if (props.auth.isAuthenticated) {
            favourited = props.auth.user.favourites.indexOf(
                props.infoPage.selectedGuide._id
            ) > -1
                ? true
                : false;
        }

        this.state = {
            weatherStore: new WeatherStore(),
            favourited: favourited
        };
    }

    openModal(modalName) {
        this.props.toggleModal(modalName);
    }

    handleClose = () => this.props.closeInfoPage();

    getLastUpdated() {
        return (
            <p className="last-updated-flow">
                <em>
                    Flow Data Last Updated: {this.filterGauges()[0].lastUpdated}
                </em>
            </p>
        );
    }

    filterGauges() {
        const guide = this.props.guide;

        if (!guide.gaugeName) {
            return [];
        }

        return this.props.gauges.filter(
            gauge =>
                gauge.siteName.toLowerCase() ===
                this.props.guide.gaugeName.toLowerCase()
        );
    }


    toggleFavourite = () => {
        const { favourited } = this.state;
        const guideId = this.props.infoPage.selectedGuide._id;
        const { email } = this.props.auth.user;

        this.setState({ favourited: !favourited });
        if (favourited) {
            this.props.removeFromFavourites(guideId, email);
        } else {
            this.props.addToFavourites(guideId, email);
        }
    };

    getTags = (activity, grade, catch_type) => {
        let gradeTag = grade && 'Grade ' + grade;
        return (
        [activity, gradeTag, catch_type]
        .filter(tag => tag)
        .map(tag => (
            <Chip
                key={tag}
                color="secondary"
                variant="outlined"
                label={tag}
                style={{ margin: "0 .5em" }}
            />
        )));
    }

    render() {
        const {
            title,
            description,
            river,
            region,
            grade,
            catch_type,
            activity,
            gaugeName,
            markers
        } = this.props.infoPage.selectedGuide;

        console.log('selected guide = ', this.props.infoPage.selectedGuide);
        const testDisplay = (
            <div>
                <div
                    style={{
                        width: "100%",
                        height: "10em",
                        backgroundColor: "#459BE8"
                    }}
                >
                    <div
                        style={{
                            position: "fixed",
                            margin: ".5em"
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
                            paddingTop: "1em"
                        }}
                    >
                        {title}
                    </h1>
                    <p
                        style={{
                            textAlign: "center",
                            color: "#fff"
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
                        lat={this.props.guide.lat}
                        lon={this.props.guide.lng}
                        weatherStore={this.state.weatherStore}
                />
                <Report />
                </div>
                {this.filterGauges().length > 0 && this.getLastUpdated()}
                <div className='flow-weather-section'>
                    {gaugeName && (<HistoryCard />)}
                    <WeatherForecast
                        lat={this.props.guide.lat}
                        lon={this.props.guide.lng}
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
                        padding: "1em 0"
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
                        marginTop: "1vh"
                    }}
                >
                    
                    <IconButton
                        onClick={this.handleClose}
                        style={{
                            color: "#fff",
                            cursor: "pointer"
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
    infoPage: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    gauges: state.gauges,
    infoPage: state.infoPage
});

export default connect(
    mapStateToProps,
    { closeInfoPage, addToFavourites, removeFromFavourites, toggleModal }
)(Info);