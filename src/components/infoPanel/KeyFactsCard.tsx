import React, { Component } from "react";

// Material UI
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import Grid from '@material-ui/core/Grid';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import Divider from '@material-ui/core/Divider';
import { IGuide } from "../../utils/types";

interface IKeyFactsCardState {
    editIconShowing: boolean;
    editMode: boolean;
    value: string;
    tempValue: string;
}

interface IKeyFactsCardProps {
    content: string;
    guide: IGuide;
}

class KeyFactsCard extends Component<IKeyFactsCardProps, IKeyFactsCardState> {
    public state: IKeyFactsCardState = {
        editIconShowing: false,
        editMode: false,
        value: "",
        tempValue: "",
    };

    public componentWillReceiveProps = (props: IKeyFactsCardProps): void => {
        this.setState({ ...this.state, value: props.content });
    }

    public handleChange = (event: any): void => {
        this.setState({ tempValue: event.target.value });
    }


    public getKeyFacts = (): JSX.Element => {
        
        return (
        <Grid container spacing={24} justify="space-between">
        <Grid item md={12} lg={4}>
        <ListItem>
              <Avatar>
                <ImageIcon />
              </Avatar>
              <ListItemText primary="Photos" secondary="Jan 9, 2014" />
            </ListItem>
        </Grid>
        <Grid item md={12} lg={4}>
        <ListItem>
              <Avatar>
                <ImageIcon />
              </Avatar>
              <ListItemText primary="Photos" secondary="Jan 9, 2014" />
            </ListItem>
        </Grid>
        <Grid item md={12} lg={4}>
        <ListItem>
              <Avatar>
                <ImageIcon />
              </Avatar>
              <ListItemText primary="Photos" secondary="Jan 9, 2014" />
            </ListItem>
        </Grid>
        
          
          </Grid>
        );
      }

    public render(): JSX.Element {
        return (
            <Card
                onMouseEnter={(): void => {
                    this.setState({ editIconShowing: true });
                }}
                onMouseLeave={(): void => this.setState({ editIconShowing: false })}
                style={{
                    marginBottom: "1em",
                }}
            >
                <CardContent>
                    {this.getKeyFacts()}
                    {this.state.editMode && (
                        <div>
                            <br />
                            <Button
                                size="small"
                                onClick={(): void => {
                                    this.setState({
                                        editMode: false,
                                        value: this.state.tempValue,
                                    });
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                size="small"
                                onClick={(): void => {
                                    this.setState({
                                        editMode: false,
                                        tempValue: "",
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }
}

export default KeyFactsCard;
