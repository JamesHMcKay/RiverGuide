import { Button, Hidden, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    closeInfoPage,
    toggleModal,
} from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IAuth, ILogComplete, ILogListItem } from "../../utils/types";
import Logbook from "./Logbook";
import LogbookStats from "./LogbookStats";

const columnOrder: Array<keyof ILogListItem> = [
    "guide_name",
    "rating",
    "participants",
    "flow",
    "start_date_time",
];

const columnOrderMobile: Array<keyof ILogListItem> = [
    "guide_name",
    "start_date_time",
];

interface ILogPageStateProps {
    auth: IAuth;
    log: ILogComplete[];
}

interface ILogPageProps extends ILogPageStateProps {
    toggleModal: (modal?: string) => void;
    closeInfoPage: () => void;
    viewHeight: string;
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
                marginTop: "30px",
            }}
            >
                <CloseIcon />
            </Button>
        );
    }

    public getLogbookStats = (): JSX.Element => {
        return (
            <Grid
                container
                style={{marginRight: "5%", marginLeft: "5%", marginTop: "0", marginBottom: "0"}}
        >
            <LogbookStats/>
        </Grid>
        );
    }

    public getLogbook = (columns: Array<keyof ILogListItem>): JSX.Element => {
        return (
            <Grid
            item
            md={12}
            lg={12}
            style={{marginRight: "5%", marginLeft: "5%", marginTop: "0", marginBottom: "0", width: "100%"}}
        >
            <Logbook columnOrder={columns} publicPage={false} log={this.props.log}/>
        </Grid>
        );
    }

    public render(): JSX.Element {
        return (
            <Grid
                container
                spacing={0}
                justify="space-between"
                className="right-panel"
                style={{height: this.props.viewHeight}}
            >
                <Hidden smDown>
                    <Grid item md={11} lg={11}>
                            <Typography variant="h4" style={{marginTop: "30px", marginLeft: "6%"}}>
                                {"Trip logbook"}
                            </Typography>
                    </Grid>
                    <Grid item md={1} lg={1}>
                        {this.getCloseButton()}
                    </Grid>
                </Hidden>
                {this.getLogbookStats()}
                <Hidden smDown>
                    {this.getLogbook(columnOrder)}
                </Hidden>
                <Hidden mdUp>
                    {this.getLogbook(columnOrderMobile)}
                </Hidden>
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
    { closeInfoPage, toggleModal },
)(LogPage);
