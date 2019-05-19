import marked from "marked";
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

marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: true,
});

interface IInfoCardState {
    editIconShowing: boolean;
    editMode: boolean;
    value: string;
    tempValue: string;
}

interface IInfoCardProps {
    content: string;
    title: string;
}

class InfoCard extends Component<IInfoCardProps, IInfoCardState> {
    public state: IInfoCardState = {
        editIconShowing: false,
        editMode: false,
        value: "",
        tempValue: "",
    };

    public componentWillReceiveProps = (props: IInfoCardProps): void => {
        this.setState({ value: props.content });
    }

    public handleChange = (event: any): void => {
        this.setState({ tempValue: event.target.value });
    }

    public render(): JSX.Element {
        return (
            <div>
                    <Typography variant="h5" gutterBottom>
                        {this.props.title}
                    </Typography>
                    <br />
                    {this.state.editMode ? (
                        <TextField
                            id="filled-multiline-flexible"
                            value={this.state.tempValue}
                            onChange={this.handleChange}
                            multiline
                            rowsMax="10"
                            margin="normal"
                            style={{ width: "100%" }}
                        />
                    ) : (
                        <Typography component="div">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: marked(this.props.content),
                                }}
                            />
                        </Typography>
                    )}

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
            </div>
        );
    }
}

export default InfoCard;
