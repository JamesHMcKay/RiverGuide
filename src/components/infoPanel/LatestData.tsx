import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
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
                <Grid container spacing={0} justify="flex-start">
                    {gauge.observables.map((item: IObservable) =>
                        <Grid item xs={6} lg={3} justify="center">
                        <ListItem style = {{paddingTop: 0, paddingBottom: 0}}>
                            <ListItemText
                                style = {{padding: 0}}
                                primary={dataTypeParser(item.type)}
                                secondary={
                                    <React.Fragment>
                                        <Chip
                                            style={{margin: "5px"}}
                                            color="primary"
                                            label={
                                                item.latest_value.toFixed(1) + " " + unitParser(item.units)
                                            }
                                        />
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    </Grid>,
                    )}
                    <Grid item xs={12} lg={3} justify="center">
                        <ListItem style = {{paddingTop: 0, paddingBottom: 0}}>
                            <ListItemText primary="Updated" secondary={
                                <React.Fragment>
                                    <Chip
                                        color="primary"
                                        label={this.dateWrapper(gauge.lastUpdated)}
                                        style={{margin: "5px"}}
                                    />
                                </React.Fragment>
                                } />
                        </ListItem>
                    </Grid>
                    <Grid item xs={12} lg={3} justify="center">
                    <ListItem style = {{paddingTop: 0, paddingBottom: 0}}>
                        <ListItemText
                            primary={
                                    "Source"
                            }
                            secondary={
                                <React.Fragment>
                                    <Chip clickable
                                    avatar={<Avatar><InfoOutlinedIcon style={{fontSize: "20px"}}/></Avatar>}
                                    onClick={(): void => {this.openDataInfo(gauge.source); }}
                                     label={gauge.source} style={{margin: "5px"}}/>
                                </React.Fragment>
                                }
                        />
                        </ListItem>
                    </Grid>

                </Grid>
            );
        }
        return null;
      }
    public render(): JSX.Element {
        return (
            <div>
                {/* <ExpansionHead title={""} panelName={"latestData"}/> */}
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
