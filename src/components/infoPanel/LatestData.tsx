import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IGauge, IInfoPage, IObservable } from "../../utils/types";

interface ILatestDataStateProps {
    infoPage: IInfoPage;
    gauges: IGauge[];
}

interface ILatestDataProps extends ILatestDataStateProps {
    toggleModal: (modal: string) => void;
}

class LatestData extends Component<ILatestDataProps> {
    public getGauge = (gaugeId: string | undefined): IGauge | undefined => {
        const gauges: IGauge[] = this.props.gauges.filter(
            (item: IGauge) => item.id === gaugeId,
        );
        return gauges[0];
    }

    public getData = (): JSX.Element | null => {
        const gauge: IGauge | undefined = this.getGauge(this.props.infoPage.selectedGuide.gauge_id);
        if (gauge) {
            return (
                <Grid container item spacing={0} justify="center">
                    <Grid item xs={6} lg={3} justify="center">
                    <ListItem>
                        <ListItemText
                            primary={
                                <React.Fragment>
                                    Source
                                    <InfoOutlinedIcon
                                        style={{fontSize: "20px", marginLeft: "10px", cursor: "pointer"}}
                                        onClick={(): void => {this.props.toggleModal("DataInfoModal"); }}
                                    />
                                </React.Fragment>
                            }
                            secondary={gauge.source}
                        />
                        </ListItem>
                    </Grid>
                    <Grid item xs={6} lg={3} justify="center">
                        <ListItem>
                            <ListItemText primary="Updated" secondary={gauge.lastUpdated} />
                        </ListItem>
                    </Grid>
                    {gauge.observables.map((item: IObservable) =>
                        <Grid item xs={6} lg={3} justify="center">
                        <ListItem>
                            <ListItemText
                                primary={item.type}
                                secondary={item.latest_value.toFixed(1) + " " + item.units}
                            />
                        </ListItem>
                    </Grid>,
                    )}
                </Grid>
            );
        }
        return null;
      }
    public render(): JSX.Element {
        return (
            <div>
                    <Typography variant="h5" gutterBottom>
                        {"Latest data"}
                    </Typography>
                    {this.getData()}
            </div>
        );
    }
}

function mapStateToProps(state: IState): ILatestDataStateProps {
    return ({
        infoPage: state.infoPage,
        gauges: state.gauges,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal},
)(LatestData);
