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

    public componentWillReceiveProps = (props: IInfoCardProps) => {
        this.setState({ value: props.content });
    }

    public handleChange = (event: any) => {
        this.setState({ tempValue: event.target.value });
    }

    public render() {
        return (
            <Card
                onMouseEnter={() => {
                    this.setState({ editIconShowing: true });
                }}
                onMouseLeave={() => this.setState({ editIconShowing: false })}
                style={{
                    marginBottom: "1em",
                }}
            >
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        {this.props.title}
                        {this.state.editIconShowing &&
                            !this.state.editMode && (
                                <Tooltip
                                    title={"Edit " + this.props.title}
                                    placement="left"
                                >
                                    <IconButton
                                        // size="small"
                                        style={{ float: "right" }}
                                        onClick={() =>
                                            this.setState({
                                                editMode: true,
                                                tempValue: this.state.value,
                                            })
                                        }
                                    >
                                        <EditIcon style={{ fontSize: 17 }} />
                                    </IconButton>
                                </Tooltip>
                            )}
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
                                onClick={() => {
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
                                onClick={() => {
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

export default InfoCard;
