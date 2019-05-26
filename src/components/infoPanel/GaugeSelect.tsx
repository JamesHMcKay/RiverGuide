import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { IState } from "../../reducers/index";
import { IGauge, IGuide, IListEntry } from "../../utils/types";

import { FormGroup, Label } from "reactstrap";

interface IGaugeSelectProps extends IGaugeSelectStateProps {
    handleChange: (selectedGuide: IGauge) => void;
    selectedGaugeId?: string;
}

interface IGaugeSelectStateProps {
    gauges: IGauge[];
}

class SectionSelect extends Component<IGaugeSelectProps> {
    public getLabel = (guide: IListEntry): string => {
        const SEPERATOR: string = " - ";
        return (
            guide.display_name +
            SEPERATOR +
            guide.river_name +
            SEPERATOR +
            guide.region);
    }

    public handleSelectionChange = (e: any): void => {
        const selectedId: string = e.value;
        const selectedGauge: IGauge[] = this.props.gauges.filter(
            (gauge: IGauge) => gauge.id === selectedId);
        if (selectedGauge.length === 1) {
            this.props.handleChange(selectedGauge[0]);
        }
    }

    public getSelectedGauge = (gaugeId: string | undefined): IGauge | null  => {
        const selectedGauge: IGauge[] = this.props.gauges.filter(
            (gauge: IGauge) => gauge.id === gaugeId,
        );
        if (selectedGauge.length > 0) {
            return selectedGauge[0];
        } else {
            return null;
        }

    }

    public render(): JSX.Element {
        const selectedGauge: IGauge | null = this.getSelectedGauge(this.props.selectedGaugeId || "");
        return (
                <Select
                    name="section"
                    placeholder="Select a gauge"
                    onChange={this.handleSelectionChange}
                    options={
                        this.props.gauges.map((gauge: IGauge) => ({
                            label: gauge.display_name,
                            value: gauge.id,
                        }))
                    }
                    value={
                        selectedGauge ?
                        {
                            label: selectedGauge.display_name,
                            value: selectedGauge.id,
                        } :
                        null
                    }
                />
        );
    }
}

function mapStateToProps(state: IState): IGaugeSelectStateProps {
    return ({
        gauges: state.gauges,
    });
}

export default connect(
    mapStateToProps,
    {},
)(SectionSelect);
