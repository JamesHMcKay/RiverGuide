import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { connect } from "react-redux";
import uuid from "uuidv4";
import { updateGuide } from "../../actions/updateGuide";
import { IState } from "../../reducers";
import DialogTitle from "../../utils/dialogTitle";
import { IGauge, IInfoPage, IKeyFactsChar, IKeyFactsNum, IListEntry, IMarker } from "../../utils/types";
import EditMapComponent from "../map/EditMapComponent";
import EditKeyFacts from "./EditKeyFacts";
import GaugeSelect from "./GaugeSelect";

interface IEditGuideState {
    description: string;
    gaugeId: string | undefined;
    id: string | undefined;
    markers: {[key: string]: IMarker};
    editorState: EditorState;
    keyFactsNum: IKeyFactsNum;
    keyFactsChar: IKeyFactsChar;
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
            keyFactsChar: this.props.infoPage.itemDetails.key_facts_char,
            keyFactsNum: this.props.infoPage.itemDetails.key_facts_num,
            markers,
            description,
            gaugeId,
            id,
            editorState: EditorState.createWithContent(ContentState.createFromText(description)),
        });
    }

    public getSelectedSection = (): string => {
        if (this.props.infoPage.selectedGuide) {
            return this.props.infoPage.selectedGuide.display_name;
        } else {
            return "No guide selected";
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
        const markerList: IMarker[] | undefined =
            this.props.infoPage.itemDetails &&
                this.props.infoPage.itemDetails.markerList ?
                    this.props.infoPage.itemDetails.markerList : [];
        return markerList;
    }

    public updateMarkers = (markers: {[key: string]: IMarker}): void => {
        this.setState({
            markers,
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

    public render(): JSX.Element {
        return (
            <div>
                <DialogTitle title={this.getSelectedSection()} handleClose={this.props.handleClose}/>
                <DialogActions>
                    <Button onClick={this.handleSave} color="primary">
                    Submit
                    </Button>
                </DialogActions>
                <DialogContent>
                <DialogContentText variant = "h5" color="textPrimary">
                        {"Key Facts"}
                </DialogContentText>
                <EditKeyFacts
                        keyFactsNum={this.state.keyFactsNum}
                        keyFactsChar={this.state.keyFactsChar}
                        onChangeNum={this.onChangeNum}
                        onChangeChar={this.onChangeChar}
                    />
                    <DialogContentText variant = "h5" color="textPrimary">
                        {"Description"}
                    </DialogContentText>
                    {/* <TextField
                            autoFocus
                            margin="dense"
                            id="comments"
                            type="text"
                            multiline={true}
                            value={this.state.description}
                            onChange={this.updateDescription}
                            fullWidth={true}
                        /> */}

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
                        {"Local Map"}
                </DialogContentText>
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
