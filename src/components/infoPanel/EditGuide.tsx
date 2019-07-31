import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { ContentState, convertFromHTML, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import Dialog from "@material-ui/core/Dialog";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import { connect } from "react-redux";
import uuid from "uuidv4";
import { IState } from "../../reducers";
import DialogTitle from "../../utils/dialogTitle";
import { IGauge, IInfoPage, IKeyFactsChar, IKeyFactsNum, IMarker } from "../../utils/types";
import { ACTIVITY_MENU } from "../ActivityFilter";
import EditMapComponent from "../map/EditMapComponent";
import EditKeyFacts from "./EditKeyFacts";
import GaugeSelect from "./GaugeSelect";

export interface IEditGuideState {
    displayName: string;
    riverName?: string;
    region: string;
    activity?: string;
    description: string;
    gaugeId: string | undefined;
    id: string | undefined;
    markers: {[key: string]: IMarker};
    editorState: EditorState;
    keyFactsNum: Partial<IKeyFactsNum>;
    keyFactsChar: Partial<IKeyFactsChar>;
    locationMarker?: IMarker;
    openDeleteDialog: boolean;
}

interface IEditGuideProps extends IEditGuideStateProps {
    handleClose: () => void;
    infoPage?: IInfoPage;
    handleSave: (result: IEditGuideState) => void;
    handleDelete?: () => void;
}

interface IEditGuideStateProps {
    gauges: IGauge[];
}

class EditGuide extends React.Component<IEditGuideProps, IEditGuideState> {
    constructor(props: IEditGuideProps) {
        super(props);
        let description: string = "Write a description here";

        if (this.props.infoPage && this.props.infoPage.itemDetails) {
            if (this.props.infoPage.itemDetails.description) {
                description = this.props.infoPage.itemDetails.description;
            }
        }
        let gaugeId: string | undefined;
        let id: string | undefined;
        if (this.props.infoPage && this.props.infoPage.selectedGuide) {
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
            keyFactsChar: this.props.infoPage ? this.props.infoPage.itemDetails.key_facts_char : {},
            keyFactsNum: this.props.infoPage ? this.props.infoPage.itemDetails.key_facts_num : {},
            displayName: this.props.infoPage ? this.props.infoPage.selectedGuide.display_name : "",
            riverName: this.props.infoPage ? this.props.infoPage.selectedGuide.river_name : undefined,
            region: this.props.infoPage ? this.props.infoPage.selectedGuide.region : "",
            activity: this.props.infoPage ? this.props.infoPage.selectedGuide.activity : undefined,
            markers,
            description,
            gaugeId,
            id,
            editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(convertFromHTML(description).contentBlocks),
            ),
            locationMarker: this.getLocation(),
            openDeleteDialog: false,
        });
    }

    public handleSave = (): void => {
        const result: IEditGuideState = this.state;
        this.props.handleSave(result);
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

    public getLocation = (): IMarker | undefined => {
        if (this.props.infoPage && this.props.infoPage.selectedGuide) {
            const marker: IMarker = {
                name: "Guide location",
                lat: this.props.infoPage.selectedGuide.position.lat,
                lng: this.props.infoPage.selectedGuide.position.lon || 0,
                id: "1",
                description: "",
                category: "",
            };
            return marker;
        }
    }

    public getMarkerList = (): IMarker[] => {
        const markerList: IMarker[] | undefined =
            (this.props.infoPage && this.props.infoPage.itemDetails) &&
                this.props.infoPage.itemDetails.markerList ?
                    this.props.infoPage.itemDetails.markerList : [];
        return markerList;
    }

    public updateMarkers = (markers: {[key: string]: IMarker}): void => {
        this.setState({
            markers,
        });
    }

    public updateLocationMarker = (marker: IMarker): void => {
        this.setState({
            locationMarker: marker,
        });
    }

    public onChangeNum = (keyFactsNum: IKeyFactsNum): void => {
        this.setState({
            keyFactsNum,
        });
    }

    public onChangeChar = (keyFactsChar: IKeyFactsChar): void => {
        this.setState({
            keyFactsChar,
        });
    }

    public onEditorStateChange = (editorState: EditorState): void => {
        this.setState({
          editorState,
          description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        });
    }

    public handleTextChange = (event: any, field: keyof IEditGuideState): void => {
        this.setState({
            ...this.state,
            [field]: event.target.value,
        });
    }

    public getWarningLocationText = (): string | undefined => {
        if (!this.state.locationMarker) {
            return " (click anywhere on the map to add the location marker)";
        }
        return " (click to add additional markers)";
    }

    public render(): JSX.Element {
        return (
            <div>
                <DialogTitle title={"Add or edit guide"} handleClose={this.props.handleClose}/>
                <DialogActions>
                    <Button variant="outlined" onClick={this.props.handleClose} color="primary">
                    Cancel
                    </Button>
                    {this.props.handleDelete &&
                            <Button
                                variant="outlined"
                                onClick={(): void => {this.setState({openDeleteDialog: true}); }}
                            >
                                Delete guide
                            </Button>
                   }
                    <Button variant="outlined" onClick={this.handleSave} color="primary">
                    Submit
                    </Button>
                </DialogActions>
                <DialogContent>
                <DialogContentText variant = "h5" color="textPrimary">
                        {"Activity"}
                </DialogContentText>
                    <Select
                        style={{margin: "20px"}}
                        variant="outlined"
                        value={this.state.activity || null}
                        placeholder={"Select a type"}
                        onChange={(e: any): void => {this.setState({
                        activity: e.target.value,
                        }); }}
                        inputProps={{
                            name: "Activity",
                            id: "activity",
                        }}
                    >
                {ACTIVITY_MENU.map((item: {name: string, id: string}) => (
                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}
                </Select>
                <DialogContentText variant = "h5" color="textPrimary">
                        {"Title and location"}
                </DialogContentText>
                <TextField
                    style={{margin: "20px"}}
                    id="standard-name"
                    label="Title"
                    value={this.state.displayName}
                    onChange={(e: any): void => {this.handleTextChange(e, "displayName"); }}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="standard-name"
                    style={{margin: "20px"}}
                    label="Region"
                    value={this.state.region}
                    onChange={(e: any): void => {this.handleTextChange(e, "region"); }}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="standard-name"
                    style={{margin: "20px"}}
                    label="River name"
                    value={this.state.riverName}
                    onChange={(e: any): void => {this.handleTextChange(e, "riverName"); }}
                    margin="normal"
                    variant="outlined"
                />
                <DialogContentText variant = "h5" color="textPrimary">
                        {"Key Facts"}
                </DialogContentText>
                <EditKeyFacts
                        keyFactsNum={this.state.keyFactsNum as IKeyFactsNum}
                        keyFactsChar={this.state.keyFactsChar as IKeyFactsChar}
                        onChangeNum={this.onChangeNum}
                        onChangeChar={this.onChangeChar}
                    />
                    <DialogContentText variant = "h5" color="textPrimary">
                        {"Description"}
                    </DialogContentText>
                    <Editor
                        editorState={this.state.editorState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={this.onEditorStateChange}
                    />
                <DialogContentText variant = "h5" color="textPrimary">
                        {"Gauge"}
                </DialogContentText>
                        <GaugeSelect
                            handleChange={this.handleGaugeChange}
                            selectedGaugeId={this.state.gaugeId}
                    />
                <DialogContentText variant = "h5" color="textPrimary">
                        {"Local Map" + this.getWarningLocationText()}
                </DialogContentText>
                    <EditMapComponent
                        markers={this.state.markers}
                        gaugeMarkers={this.getGaugeLocation()}
                        locationMarker={this.state.locationMarker}
                        updateMarkers={this.updateMarkers}
                        updateLocationMarker={this.updateLocationMarker}
                    />
                </DialogContent>
                <Dialog open={this.state.openDeleteDialog}>
                    <DialogTitle
                        title={"Are you sure you want to delete this guide?"}
                        handleClose={(): void => {this.setState({openDeleteDialog: false}); }}
                    />
                    <DialogActions>
                        <Button onClick={(): void => {this.setState({openDeleteDialog: false}); }} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.props.handleDelete} color="primary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
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
    { },
)(EditGuide);
