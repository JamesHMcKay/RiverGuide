import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IFilter } from "../../utils/types";

// Material UI
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
} from "@material-ui/core";

// Components
import FilterDropDown from "./FilterDropDown";

function Transition(props: any) {
    return <Slide direction="up" {...props} />;
}

interface IFiltersModalProps {
    toggleModal: (modal: string) => void;
    isOpen: boolean;
}

interface IFiltersModalState {
    filters: IFilter[];
}

class FiltersModal extends Component<IFiltersModalProps, IFiltersModalState> {
    public state = {
        filters: [],
    };

    public handleClose = () => {
        this.props.toggleModal("filterModal");
    }

    public render() {
        return (
            <Dialog
                open={this.props.isOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleClose}
                fullWidth
            >
                <DialogTitle>Apply filters</DialogTitle>
                {/* <DialogContent>
                    {this.props.category.filters.map(filter => (
                        <FilterDropDown
                            key={filter.title}
                            title={filter.title}
                            values={filter.values}
                        />
                    ))}
                </DialogContent> */}
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleClose} color="secondary">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

FiltersModal.propTypes = {
    toggleModal: PropTypes.func.isRequired,
};

const mapStateToProps = (state: IState) => ({
    isOpen: state.openModal === "filterModal",
    openLog: state.openLog,
    category: state.category,
});

export default connect(
    mapStateToProps,
    { toggleModal },
)(FiltersModal);
