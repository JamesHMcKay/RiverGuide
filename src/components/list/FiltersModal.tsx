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
    DialogTitle,
    Slide,
} from "@material-ui/core";

// Components

function Transition(props: any): JSX.Element {
    return <Slide direction="up" {...props} />;
}

interface IFiltersModalProps extends IFiltersModelStateProps {
    toggleModal: (modal: string) => void;
}

interface IFiltersModelStateProps {
    isOpen: boolean;
    category: string;
}

interface IFiltersModalState {
    filters: IFilter[];
}

class FiltersModal extends Component<IFiltersModalProps, IFiltersModalState> {
    public state: IFiltersModalState = {
        filters: [],
    };

    public handleClose = (): void => {
        this.props.toggleModal("filterModal");
    }

    public render(): JSX.Element {
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

function mapStateToProps(state: IState): IFiltersModelStateProps {
    return ({
        isOpen: state.openModal === "filterModal",
        category: state.category,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal },
)(FiltersModal);
