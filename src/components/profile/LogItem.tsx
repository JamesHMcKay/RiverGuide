import { library } from "@fortawesome/fontawesome-svg-core";
import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal, updateOpenLog } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { ILogEntry } from "../../utils/types";

import {
    faCaretDown,
    faCaretRight,
    faStar,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardText,
    Collapse,
} from "reactstrap";

import "./profile.css";

library.add(faCaretDown, faCaretRight, faStar, faUser);

interface ILogItemProps {
    toggleModal: (modal: string) => void;
    updateOpenLog: (item: ILogEntry) => void;
    item: ILogEntry;
}

interface ILogItemState {
    isOpen: boolean;
}

class LogItem extends Component<ILogItemProps, ILogItemState> {
    constructor(props: ILogItemProps) {
        super(props);
        this.state = { isOpen: false };

        this.toggleContent = this.toggleContent.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.renderStars = this.renderStars.bind(this);
    }

    public toggleContent() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    public parseDate(date: string) {
        return moment(date).format("DD MMMM YYYY");
    }

    public handleEdit() {
        this.props.toggleModal("editTrip");
        this.props.updateOpenLog(this.props.item);
    }

    public handleDelete() {
        this.props.toggleModal("deleteTrip");
        this.props.updateOpenLog(this.props.item);
    }

    public renderStars(rating: number) {
        const stars: number[] = [];
        for (let i = 0; i < Math.floor(rating); i++) {
            // stars.push(<FontAwesomeIcon icon="star" />);
        }
        return stars;
    }

    public render() {
        const {
            date,
            section,
            participantCount,
            rating,
            description,
        } = this.props.item;

        return (
            <div>
                <Card>
                    <CardHeader onClick={this.toggleContent}>
                        {this.parseDate(date)} - {section}
                        {/* <div class="open-icon"> */}
                            {/* <FontAwesomeIcon
                                icon={
                                    this.state.isOpen
                                        ? "caret-down"
                                        : "caret-right"
                                }
                            /> */}
                        {/* </div> */}
                    </CardHeader>
                    <Collapse isOpen={this.state.isOpen}>
                        <CardBody>
                            <Badge>38 cumecs</Badge>{" "}
                            <Badge>24&deg;C Sunny</Badge>{" "}
                            <Badge>
                                {/* <FontAwesomeIcon icon="user" />{" "} */}
                                {participantCount}
                            </Badge>{" "}
                            <Badge>{this.renderStars(rating)}</Badge>
                            <br />
                            <br />
                            <CardText>{description}</CardText>
                            <div className="button-group">
                                <Button onClick={this.handleEdit} size="sm">
                                    Edit
                                </Button>{" "}
                                <Button
                                    onClick={this.handleDelete}
                                    size="sm"
                                    color="danger"
                                >
                                    Delete
                                </Button>
                            </div>
                        </CardBody>
                    </Collapse>
                </Card>
            </div>
        );
    }
}

LogItem.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    updateOpenLog: PropTypes.func.isRequired,
};

const mapStateToProps = (state: IState) => ({
    openModal: state.openModal,
});

export default connect(
    mapStateToProps,
    { toggleModal, updateOpenLog },
)(LogItem);
