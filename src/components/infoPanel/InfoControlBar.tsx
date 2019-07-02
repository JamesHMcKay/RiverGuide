// Material UI
import { Button, CircularProgress, IconButton, Toolbar, Tooltip } from "@material-ui/core";
import ArrowBackRounded from "@material-ui/icons/ArrowBackRounded";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    closeInfoPage,
    removeFromFavourites,
} from "../../actions/actions";
import { addToFavourites } from "../../actions/getAuth";
import { IAuth, IInfoPage, IUserDetails } from "./../../utils/types";

import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import { IState } from "../../reducers/index";

interface IInfoControlBarProps extends IInfoControlBarStateToProps {
    closeInfoPage: () => void;
    removeFromFavourites: (guideId: string, email: string) => void;
    addToFavourites: (userDetails: IUserDetails) => void;
}

interface IInfoControlBarStateToProps {
    openModal: string;
    auth: IAuth;
    index: string;
    infoPage: IInfoPage;
    userDetails: IUserDetails;
    loadingSpinner: string;
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

    public handleClose = (): void => this.props.closeInfoPage();

    public getCloseButton = (): JSX.Element => {
        return (
            <Button
            onClick={this.handleClose}
            style={{
                color: "white",
                cursor: "pointer",
                float: "left",
                width: "30%",
            }}
            >
                <ArrowBackRounded />
            </Button>
        );
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

    public render(): JSX.Element {
        return (
            <Toolbar style={{display: "flex", flexDirection: "row"}}>
                {this.getCloseButton()}
                <div style={{width: "70%", float: "right"}}>
                {this.props.auth.isAuthenticated && this.props.infoPage.infoSelected && this.getFavButton()}
                </div>
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
    });
}

export default connect(
    mapStateToProps,
    { closeInfoPage, addToFavourites, removeFromFavourites },
)(InfoControlBar);
