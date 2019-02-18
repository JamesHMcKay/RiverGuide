import React, { Component } from "react";

// Material UI
import {
    FormControl,
    Input,
    InputLabel,
    MenuItem,
    Select,
} from "@material-ui/core";

interface IFilterDropDown {
    title: string;
    values: string[];
}

class FilterDropDown extends Component<IFilterDropDown> {
    public render(): JSX.Element {
        return (
            <FormControl
                style={{
                    width: "100%",
                }}
            >
                <InputLabel htmlFor="select-label">
                    {this.props.title}
                </InputLabel>
                <Select multiple value={[]} input={<Input id="select-label" />}>
                    {this.props.values.map((value: string) => (
                        <MenuItem key={value}>{value}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
}

export default FilterDropDown;
