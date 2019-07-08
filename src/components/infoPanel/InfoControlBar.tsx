// Material UI
import { Button, CircularProgress, IconButton, Toolbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    closeInfoPage,
    removeFromFavourites,
    toggleModal,
} from "../../actions/actions";
import { addToFavourites } from "../../actions/getAuth";
import { IAuth, IInfoPage, IListEntry, IUserDetails } from "./../../utils/types";

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import { IState } from "../../reducers/index";
import { CurrentWeather } from "./CurrentWeather";
import { WeatherStore } from "./WeatherStore";

interface IInfoControlBarProps extends IInfoControlBarStateToProps {
    closeInfoPage: () => void;
    removeFromFavourites: (guideId: string, email: string) => void;
    addToFavourites: (userDetails: IUserDetails) => void;
    toggleModal: (modalName: string) => void;
}

interface IInfoControlBarStateToProps {
    openModal: string;
    auth: IAuth;
    index: string;
    infoPage: IInfoPage;
    userDetails: IUserDetails;
    loadingSpinner: string;
    weatherStore: WeatherStore;
}

class InfoControlBar extends Component<IInfoControlBarProps> {

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

    public openModal(modalName: string): void {
        this.props.toggleModal(modalName);
    }

    public handleClose = (): void => this.props.closeInfoPage();

    public getCloseButton = (): JSX.Element => {
        return (
            <Button
                onClick={this.handleClose}
                style={{
                    color: "white",
                    cursor: "pointer",
                    float: "right",
                    width: "20%",
                }}
            >
                <CloseIcon />
            </Button>
        );
    }

    public onClick = (isFav: boolean): void => {
        if (this.props.auth.isAuthenticated) {
            this.toggleFavourite(isFav);
        } else {
            this.props.toggleModal("loginModal");
        }
    }

    public getFavButton = (): JSX.Element => {
        if (this.props.loadingSpinner === "favButton") {
            return (
                <CircularProgress color="secondary"/>
            );
        }

        const guideId: string = this.props.infoPage.selectedGuide.id;
        const isFav: boolean = this.props.userDetails.user_favourites.filter(
            (item: string) => item === guideId,
        ).length > 0;

        return (
            <IconButton
                onClick={(): void => {this.onClick(isFav); }}
            >
                {isFav ? (
                    <FavoriteIcon style={{ color: "#fb1" }} />
                ) : (
                    <FavoriteBorder style={{ color: "#fff" }} />
                )}
            </IconButton>
        );
    }

    public render(): JSX.Element {
        const entry: IListEntry = this.props.infoPage.selectedGuide;
        return (
            <Toolbar style={{display: "flex", flexDirection: "row"}}>
                <div style={{width: "60%", float: "left", marginLeft: "20px"}}>
                <CurrentWeather
                            lat={entry.position.lat || 0}
                            lon={entry.position.lon || 0}
                            weatherStore={this.props.weatherStore}
                            onClick= {this.openModal.bind(this, "weatherModal")}
                            textColor = {"white"}
                            iconHeight={"40px"}
                            tempSize={"15px"}
                        />
                </div>
                <div style={{width: "20%", float: "right"}}>
                {this.props.infoPage.infoSelected && this.getFavButton()}
                </div>
                {this.getCloseButton()}
            </Toolbar>
        );
    }
}

function mapStateToProps(state: IState): IInfoControlBarStateToProps {
    return ({
        openModal: state.openModal,
        auth: state.auth,
        index: state.tabIndex,
        infoPage: state.infoPage,
        userDetails: state.userDetails,
        loadingSpinner: state.loadingSpinner,
        weatherStore: state.weatherStore,
    });
}

export default connect(
    mapStateToProps,
    { closeInfoPage, addToFavourites, removeFromFavourites, toggleModal },
)(InfoControlBar);
