import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import React from "react";

import { connect } from "react-redux";
import { updateGuide } from "../../actions/updateGuide";
import { IGauge, IInfoPage, IMarker, IListEntry } from "../../utils/types";
import GaugeSelect from "./GaugeSelect";
import EditMapComponent from "../map/EditMapComponent";
import { IState } from "../../reducers";
import uuid from "uuidv4";

interface IEditGuideState {
    description: string;
    gaugeId: string | undefined;
    id: string | undefined;
    markers: {[key: string]: IMarker};
}

interface IEditGuideProps extends IEditGuideStateProps {
    updateGuide: (item: IEditGuideState, selectedGuide: IListEntry) => void;
    handleClose: () => void;
    infoPage: IInfoPage;
}

interface IEditGuideStateProps {
    gauges: IGauge[];
}

class EditGuide extends React.Component<IEditGuideProps, IEditGuideState> {
    constructor(props: IEditGuideProps) {
        super(props);
        let description: string = "";
        if (this.props.infoPage.itemDetails) {
            description = this.props.infoPage.itemDetails.description;
        }
        let gaugeId: string | undefined;
        let id: string | undefined;
        if (this.props.infoPage.selectedGuide) {
            gaugeId = this.props.infoPage.selectedGuide.gauge_id;
            id = this.props.infoPage.selectedGuide.id;
        }


        const markers: {[key: string]: IMarker } = {};
        const markerList: IMarker[] = this.getMarkerList();
        for (const marker of markerList) {
            const id: string = uuid();
            marker.id = id;
            markers[id] = marker;
        }

        this.state = ({
            markers,
            description,
            gaugeId,
            id,
        });
    }

    public getSelectedSection = (): JSX.Element => {
        if (this.props.infoPage.selectedGuide) {
            return (
                <DialogContentText>
                {this.props.infoPage.selectedGuide.display_name}
            </DialogContentText>);
        } else {
            return (<DialogContentText>
                {"No section selected"}}
            </DialogContentText>);
        }
    }

    public handleSave = (): void => {
        const result: IEditGuideState = this.state;

        this.props.updateGuide(result, this.props.infoPage.selectedGuide);
        this.props.handleClose();
    }

    public updateDescription = (input: any): void => {
        const description: string = input.target.value;
        this.setState({
            description,
        });
    }

    public handleGaugeChange = (selectedGauge: IGauge): void => {
        this.setState({
            gaugeId: selectedGauge.id,
        });
    }

    public getGaugeLocation = (): IMarker[] => {
        const gauges: IGauge[] = this.props.gauges.filter(
            (item: IGauge) => item.id === this.state.gaugeId,
        );
        if (gauges.length > 0) {
            const gaugeMarkers: IMarker[] = gauges.map((item: IGauge) =>
                ({
                    name: item.display_name,
                    lat: item.position.lat,
                    lng: item.position.lon || 0,
                    id: item.display_name,
                    description: "Gauge",
                    category: "Gauge",
                }));
            return gaugeMarkers;
        }
        return [];
    }


    public getLocation = (): IMarker[] => {
        if (this.props.infoPage.selectedGuide) {
            const marker: IMarker = {
                name: "Guide location",
                lat: this.props.infoPage.selectedGuide.position.lat,
                lng: this.props.infoPage.selectedGuide.position.lon || 0,
                id: "1",
                description: "",
                category: "",
            };
            return [marker];
        }
        return [];
    }


    public getMarkerList = (): IMarker[] => {
        let markerList: IMarker[] | undefined =
            this.props.infoPage.itemDetails &&  this.props.infoPage.itemDetails.markerList ? this.props.infoPage.itemDetails.markerList : [];
        return markerList;
    }

    public updateMarkers = (markers: {[key: string]: IMarker}): void => {
        this.setState({
            markers,
        });
    }

    public render(): JSX.Element {
        return (
            <div>
                <DialogTitle>
                    {this.getSelectedSection()}
                </DialogTitle >
                <DialogContent>
                <DialogContentText>
                        {"Gauge"}
                    </DialogContentText>
                        <GaugeSelect
                            handleChange={this.handleGaugeChange}
                            selectedGaugeId={this.state.gaugeId}
                    />
                    <DialogContentText>
                        {"Description"}
                    </DialogContentText>
                    <TextField
                            autoFocus
                            margin="dense"
                            id="comments"
                            type="text"
                            multiline={true}
                            value={this.state.description}
                            onChange={this.updateDescription}
                            fullWidth={true}
                        />
                    <EditMapComponent
                        markers={this.state.markers}
                        gaugeMarkers={this.getGaugeLocation()}
                        locationMarker={this.getLocation()}
                        updateMarkers={this.updateMarkers}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                    Cancel
                    </Button>
                    <Button onClick={this.handleSave} color="primary">
                    Submit
                    </Button>
                </DialogActions>
            </div>
        );

    }
}

function mapStateToProps(state: IState): IEditGuideStateProps {
    return ({
        gauges: state.gauges,
    });
}

export default connect(
    mapStateToProps,
    { updateGuide },
)(EditGuide);
