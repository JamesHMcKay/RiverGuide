import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { IState } from "../../reducers/index";
import { IGuide } from "../../utils/types";

import { FormGroup, Label } from "reactstrap";

interface ISectionSelectProps extends ISectionSelectStateProps {
    handleChange: (e: any) => void;
    value?: string;
}

interface ISectionSelectStateProps {
    guides: IGuide[];
}

class SectionSelect extends Component<ISectionSelectProps> {
    public render(): JSX.Element {
        const SEPERATOR: string = " - ";
        let selectedValue: string | null | undefined = this.props.value;
        if (selectedValue == "") {
            selectedValue = undefined;
        }
        return (
            <FormGroup>
                <Label for="section">Section</Label>
                <Select
                    name="section"
                    placeholder="Select a section"
                    onChange={this.props.handleChange}
                    options={
                        this.props.guides.map((guide: IGuide) => ({
                            label:
                                guide.title +
                                SEPERATOR +
                                guide.river +
                                SEPERATOR +
                                guide.region,
                            value: guide.title +
                            SEPERATOR +
                            guide.river +
                            SEPERATOR +
                            guide.region,
                        }))
                    }
                    value={selectedValue ? {label: selectedValue, value: selectedValue} : null}
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
