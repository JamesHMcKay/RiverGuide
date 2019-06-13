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
              <ListItemText primary="Length" secondary="10km" />
            </ListItem>
        </Grid>
        <Grid item md={12} lg={3}>
        <ListItem>
            <QueryBuilder fontSize="large" />
              <ListItemText primary="Time" secondary="8 - 10 hours" />
            </ListItem>
        </Grid>
        <Grid item md={12} lg={3}>
        <ListItem>
                <LandscapeRounded fontSize="large" />
              <ListItemText primary="Gradient" secondary="30 m/km" />
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
