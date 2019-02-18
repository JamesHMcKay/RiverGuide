import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { IState } from "../../reducers/index";
import { IGuide } from "../../utils/types";

import { FormGroup, Label } from "reactstrap";

interface ISectionSelectProps extends ISectionSelectStateProps {
    handleChange: (e: any) => void;
}

interface ISectionSelectStateProps {
    guides: IGuide[];
}

class SectionSelect extends Component<ISectionSelectProps> {
    public render(): JSX.Element {
        const SEPERATOR: string = " - ";

        return (
            <FormGroup>
                <Label for="section">Section</Label>
                <Select
                    name="section"
                    placeholder="eg. Taieri at Outram"
                    onChange={this.props.handleChange}
                    options={[{ label: "Other", value: "" }].concat(
                        this.props.guides.map((guide: IGuide) => ({
                            label:
                                guide.title +
                                SEPERATOR +
                                guide.river +
                                SEPERATOR +
                                guide.region,
                            value: guide.title,
                        })),
                    )}
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
