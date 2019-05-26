import React from "react";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import { connect } from "react-redux";
import { IState } from "../../reducers/index";
import { IInfoPage, IListEntry, ILogEntry, IOpenLog, IGauge } from "../../utils/types";
import GaugeSelect from "./GaugeSelect";
import { updateGuide } from "../../actions/updateGuide";

interface IEditGuideState {
    description: string;
    gaugeId: string | undefined;
    id: string | undefined;
}

interface IEditGuideProps {
    updateGuide: (item: IEditGuideState) => void;
    handleClose: () => void;
    infoPage: IInfoPage;
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
        this.state = ({
            description: description,
            gaugeId: gaugeId,
            id: id,
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
        let result: IEditGuideState = this.state;
        
        this.props.updateGuide(result);
        this.props.handleClose();
    }

    public updateDescription = (input: any): void => {
        const description: string = input.target.value;
        this.setState({
            description: description,
        });
    }

    public handleGaugeChange = (selectedGauge: IGauge): void => {
        this.setState({
            gaugeId: selectedGauge.id,
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

export default connect(
    null,
    { updateGuide },
)(EditGuide);