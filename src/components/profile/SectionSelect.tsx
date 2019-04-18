import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { IState } from "../../reducers/index";
import { IGuide } from "../../utils/types";

import { FormGroup, Label } from "reactstrap";

interface ISectionSelectProps extends ISectionSelectStateProps {
    handleChange: (selectedGuide: IGuide) => void;
    selectedGuide?: IGuide;
}

interface ISectionSelectStateProps {
    guides: IGuide[];
}

class SectionSelect extends Component<ISectionSelectProps> {
    public getLabel = (guide: IGuide): string => {
        const SEPERATOR: string = " - ";
        return (
            guide.title +
            SEPERATOR +
            guide.river +
            SEPERATOR +
            guide.region);
    }

    public handleSelectionChange = (e: any): void => {
        const selectedId: string = e.value;
        const selectedGuide: IGuide[] = this.props.guides.filter(
            (guide: IGuide) => guide._id === selectedId);
        if (selectedGuide.length === 1) {
            this.props.handleChange(selectedGuide[0]);
        }
    }

    public render(): JSX.Element {
        return (
            <FormGroup>
                <Label for="section">Section</Label>
                <Select
                    name="section"
                    placeholder="Select a section"
                    onChange={this.handleSelectionChange}
                    options={
                        this.props.guides.map((guide: IGuide) => ({
                            label: this.getLabel(guide),
                            value: guide._id,
                        }))
                    }
                    value={
                    this.props.selectedGuide ?
                        {
                            label: this.getLabel(this.props.selectedGuide),
                            value: this.props.selectedGuide._id,
                        } :
                        null
                    }
                />
            </FormGroup>
        );
    }
}

function mapStateToProps(state: IState): ISectionSelectStateProps {
    return ({
        guides: state.guides,
    });
}

export default connect(
    mapStateToProps,
    {},
)(SectionSelect);
