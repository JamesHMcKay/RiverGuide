import { FormGroup } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { IState } from "../../reducers/index";
import { IListEntry } from "../../utils/types";

interface ISectionSelectProps extends ISectionSelectStateProps {
    handleChange: (selectedGuide: IListEntry) => void;
    selectedGuide?: IListEntry;
}

interface ISectionSelectStateProps {
    guides: IListEntry[];
}

class SectionSelect extends Component<ISectionSelectProps> {
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
        const selectedGuide: IListEntry[] = this.props.guides.filter(
            (guide: IListEntry) => guide.id === selectedId);
        if (selectedGuide.length === 1) {
            this.props.handleChange(selectedGuide[0]);
        }
    }

    public render(): JSX.Element {
        return (
            <FormGroup style={{paddingTop: "20px"}}>
                <Select
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base: any): void => ({ ...base, zIndex: 9999 }) }}
                    name="section"
                    placeholder="Search for a location"
                    onChange={this.handleSelectionChange}
                    options={
                        this.props.guides.map((guide: IListEntry) => ({
                            label: this.getLabel(guide),
                            value: guide.id,
                        }))
                    }
                    value={
                    this.props.selectedGuide ?
                        {
                            label: this.getLabel(this.props.selectedGuide),
                            value: this.props.selectedGuide.id,
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
