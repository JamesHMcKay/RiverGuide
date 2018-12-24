import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { State } from '../../reducers/index';

// Material UI
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

const Transition = (props: any) => <Slide direction="up" {...props} />;

interface ICreateWhitewaterProps {
    isOpen: boolean;
    toggleModal: (modal: string) => void;
    category: any
}

interface ICreateWhitewaterState {
    title: string;
    river: string;
    region: string;
}


class CreateWhitewater extends Component<ICreateWhitewaterProps, ICreateWhitewaterState> {
    constructor(props: ICreateWhitewaterProps) {
        super(props);
        this.state = {
            title: "",
            river: "",
            region: "",
        };
    }

    handleClose = () => this.props.toggleModal("createModal");

    handleChange = (event: any) => this.setState({});

    render() {
        return (
            <Dialog
                fullScreen
                open={this.props.isOpen}
                TransitionComponent={Transition}
            >
                <AppBar>
                    <Toolbar>
                        <Typography
                            variant="h5"
                            style={{ flex: 2, color: "#fff" }}
                        >
                            {`Create new ${this.props.category.name} guide`}
                        </Typography>
                        <div>
                            <Button onClick={this.handleClose}>Save</Button>
                            <Button onClick={this.handleClose}>Cancel</Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <div style={{ margin: "5em" }}>
                    <TextField
                        id="title"
                        label="Title"
                        value={this.state.title}
                        onChange={this.handleChange}
                    />
                    <FormControl>
                        <InputLabel htmlFor="region">Region</InputLabel>
                        <Select
                            value={this.state.region}
                            onChange={this.handleChange}
                            displayEmpty
                            name="region"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </Dialog>
        );
    }
}

CreateWhitewater.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    category: PropTypes.object.isRequired
};

const mapStateToProps = (state: State) => ({
    isOpen: state.openModal === "createModal",
    category: state.category
});

export default connect(
    mapStateToProps,
    { toggleModal }
)(CreateWhitewater);
