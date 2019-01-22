import React, { Component } from "react";
import Select from "react-select";
import { connect } from "react-redux";
import { State } from '../../reducers/index';
import { IGuide } from '../../utils/types';

import { FormGroup, Label } from "reactstrap";

interface ISectionSelectProps {
    handleChange: (e: any) => void;
    guides: IGuide[];
}

class SectionSelect extends Component<ISectionSelectProps> {
    render() {
        const SEPERATOR = " - ";

        return (
            <FormGroup>
                <Label for="section">Section</Label>
                <Select
                    name="section"
                    placeholder="eg. Taieri at Outram"
                    onChange={this.props.handleChange}
                    options={[{ label: "Other", value: "" }].concat(
                        this.props.guides.map(guide => ({
                            label:
                                guide.title +
                                SEPERATOR +
                                guide.river +
                                SEPERATOR +
                                guide.region,
                            value: guide.title
                        }))
                    )}
                />
            </FormGroup>
        );
    }
}

const mapStateToProps = (state: State) => ({
    guides: state.guides
});

export default connect(
    mapStateToProps,
    {}
)(SectionSelect);
