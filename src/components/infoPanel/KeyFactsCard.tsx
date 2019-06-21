import React, { Component } from "react";

// Material UI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import QueryBuilder from "@material-ui/icons/QueryBuilder";

import LandscapeRounded from "@material-ui/icons/LandscapeRounded";
import Timeline from "@material-ui/icons/Timeline";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import WarningRounded from "@material-ui/icons/WarningRounded";
import { IItemDetails } from "../../utils/types";

interface IKeyFactsCardState {
    editIconShowing: boolean;
    editMode: boolean;
    value: string;
    tempValue: string;
}

interface IKeyFactsCardProps {
    itemDetails: IItemDetails;
}

class KeyFactsCard extends Component<IKeyFactsCardProps, IKeyFactsCardState> {
    public state: IKeyFactsCardState = {
        editIconShowing: false,
        editMode: false,
        value: "",
        tempValue: "",
    };

    public componentWillReceiveProps = (props: IKeyFactsCardProps): void => {
        this.setState({ ...this.state });
    }

    public handleChange = (event: any): void => {
        this.setState({ tempValue: event.target.value });
    }

    public getTimeRange = (): string => {
        const timeHigh: number | undefined = this.props.itemDetails.time_high;
        const timeLow: number | undefined = this.props.itemDetails.time_low;
        if (timeHigh && timeLow) {
            return timeLow.toString() + " - " + timeHigh.toString() + " hours";
        }
        const time: number | undefined = timeHigh || timeLow;
        if (time) {
            return time.toString() + " hours";
        }
        return "";
    }

    public getGradient = (): string => {
        if (this.props.itemDetails.gradient && this.props.itemDetails.gradient_unit) {
            return this.props.itemDetails.gradient.toString() + this.props.itemDetails.gradient_unit;
        }
        return "";
    }

    public getSectionLength = (): string => {
        if (this.props.itemDetails.section_length && this.props.itemDetails.section_length_unit) {
            return this.props.itemDetails.section_length.toString() + this.props.itemDetails.section_length_unit;
        }
        return "";
    }

    public getKeyFacts = (): JSX.Element => {
        return (
        <Grid container item spacing={10} justify="space-between">
        <Grid item md={12} lg={3}>
        <ListItem>
                <WarningRounded fontSize="large" />
              <ListItemText primary="Grade" secondary={this.props.itemDetails.gradeOverall} />
            </ListItem>
        </Grid>
        <Grid item md={12} lg={3}>
        <ListItem>
                <Timeline fontSize="large" />
              <ListItemText primary="Length" secondary={this.getSectionLength()} />
            </ListItem>
        </Grid>
        <Grid item md={12} lg={3}>
        <ListItem>
            <QueryBuilder fontSize="large" />
              <ListItemText primary="Time" secondary={this.getTimeRange()} />
            </ListItem>
        </Grid>
        <Grid item md={12} lg={3}>
        <ListItem>
                <LandscapeRounded fontSize="large" />
              <ListItemText primary="Gradient" secondary={this.getGradient()} />
            </ListItem>
        </Grid>
          </Grid>
        );
      }

    public render(): JSX.Element {
        return (
            <Grid container item xs={12} justify="space-between">
                <Grid container item md={12} lg={12} justify="flex-start">
                    <Typography variant="h5" gutterBottom>
                        Key Facts
                    </Typography>
                </Grid>
                <Grid container item md={12} lg={12} justify="center">
                    {this.getKeyFacts()}
                </Grid>
            </Grid>
        );
    }
}

export default KeyFactsCard;
