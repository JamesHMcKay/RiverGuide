import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { getGaugeDisclaimer } from "../../actions/getGauges";
import { IState } from "../../reducers/index";
import { dataTypeParser, unitParser } from "../../utils/dataTypeParser";
import { IExpansionPanels, IGauge, IInfoPage, IObservable } from "../../utils/types";
import ExpansionHead from "./ExpansionHead";

interface ILatestDataStateProps {
    infoPage: IInfoPage;
    gauges: IGauge[];
    expansionPanels: IExpansionPanels;
}

interface ILatestDataProps extends ILatestDataStateProps {
    toggleModal: (modal: string) => void;
    getGaugeDisclaimer: (agencyName: string) => void;
}

class LatestData extends Component<ILatestDataProps> {
    public getGauge = (gaugeId: string | undefined): IGauge | undefined => {
        const gauges: IGauge[] = this.props.gauges.filter(
            (item: IGauge) => item.id === gaugeId,
        );
        return gauges[0];
    }

    public dateWrapper = (inputDate: string): string => {
        const dateParsed: Date = new Date(inputDate);
        return dateParsed.toLocaleDateString() + "\n " + dateParsed.toLocaleTimeString();
    }

    public openDataInfo = (agencyName: string): void => {
        this.props.getGaugeDisclaimer(agencyName);
        this.props.toggleModal("DataInfoModal");
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
                                        onClick={(): void => {this.openDataInfo(gauge.source); }}
                                    />
                                </React.Fragment>
                            }
                            secondary={gauge.source}
                        />
                        </ListItem>
                    </Grid>
                    <Grid item xs={6} lg={3} justify="center">
                        <ListItem>
                            <ListItemText primary="Updated" secondary={this.dateWrapper(gauge.lastUpdated)} />
                        </ListItem>
                    </Grid>
                    {gauge.observables.map((item: IObservable) =>
                        <Grid item xs={6} lg={3} justify="center">
                        <ListItem>
                            <ListItemText
                                primary={dataTypeParser(item.type)}
                                secondary={item.latest_value.toFixed(1) + " " + unitParser(item.units)}
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
                <ExpansionHead title={"Latest Data"} panelName={"latestData"}/>
                    {this.props.expansionPanels.latestData && this.getData()}
            </div>
        );
    }
}

function mapStateToProps(state: IState): ILatestDataStateProps {
    return ({
        infoPage: state.infoPage,
        gauges: state.gauges,
        expansionPanels: state.expansionPanels,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, getGaugeDisclaimer},
)(LatestData);
