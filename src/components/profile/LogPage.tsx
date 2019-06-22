import Grid from "@material-ui/core/Grid";
import React, { Component } from "react";
import { connect } from "react-redux";

import {
    closeInfoPage,
    removeFromFavourites,
    toggleModal,
} from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IAuth, ILogComplete, ILogListItem } from "../../utils/types";

// Material UI
import { Button } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

// Components
import Logbook from "./Logbook";
import LogbookStats from "./LogbookStats";

const columnOrder: Array<keyof ILogListItem> = [
    "guide_name",
    "rating",
    "participants",
    "start_date_time",
    "flow",
];

interface ILogPageStateProps {
    auth: IAuth;
    log: ILogComplete[];
}

interface ILogPageProps extends ILogPageStateProps {
    toggleModal: (modal?: string) => void;
    closeInfoPage: () => void;
    removeFromFavourites: (guideId: string, email: string) => void;
}

class LogPage extends Component<ILogPageProps> {

    public openModal(modalName: string): void {
        this.props.toggleModal(modalName);
    }

    public handleClose = (): void => this.props.closeInfoPage();

    public getReportButton = (): JSX.Element => {
        return (
            <Button
            className="reporting-button"
            variant="outlined"
            style={{height: "fit-content", color: "white", borderColor: "white"}}
            onClick={this.openModal.bind(this, "addTripAnyPage")}
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
                color: "black",
                cursor: "pointer",
            }}
            >
                <CloseIcon />
            </Button>
        );
    }

    public getLogbookStats = (): JSX.Element => {
        return (
            <Grid
            item
            md={12}
            lg={12}
            style={{marginRight: "5%", marginLeft: "5%", marginTop: "2%", marginBottom: "0"}}
        >
            <LogbookStats/>
        </Grid>
        );
    }

    public getLogbook = (): JSX.Element => {
        return (
            <Grid
            item
            md={12}
            lg={12}
            style={{marginRight: "5%", marginLeft: "5%", marginTop: "2%", marginBottom: "0"}}
        >
            <Logbook columnOrder={columnOrder} publicPage={false} log={this.props.log}/>
        </Grid>
        );
    }

    public render(): JSX.Element {
        return (
            <Grid container item xs={12} spacing={0} justify="space-between" className="right-panel" >
                <Grid container item md={12} lg={12} justify="flex-end">
                        {this.getCloseButton()}
                </Grid>
                {this.getLogbookStats()}
                {this.getLogbook()}
            </Grid>
        );
    }
}

function mapStateToProps(state: IState): ILogPageStateProps {
    return ({
        auth: state.auth,
        log: state.log,
    });
}

export default connect(
    mapStateToProps,
    { closeInfoPage, removeFromFavourites, toggleModal },
)(LogPage);
