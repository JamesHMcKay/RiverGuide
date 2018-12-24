import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toggleModal, updateOpenLog } from "../../actions/actions";
import { library } from "@fortawesome/fontawesome-svg-core";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCaretDown,
    faCaretRight,
    faStar,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardHeader,
    CardText,
    Collapse
} from "reactstrap";

import "./profile.css";

library.add(faCaretDown, faCaretRight, faStar, faUser);

class LogItem extends Component {
    constructor() {
        super();
        this.state = { isOpen: false };

        this.toggleContent = this.toggleContent.bind(this);
        this.parseDate = this.parseDate.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.renderStars = this.renderStars.bind(this);
    }

    toggleContent() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    parseDate(date) {
        return moment(date).format("DD MMMM YYYY");
    }

    handleEdit() {
        this.props.toggleModal("editTrip");
        this.props.updateOpenLog(this.props.item);
    }

    handleDelete() {
        this.props.toggleModal("deleteTrip");
        this.props.updateOpenLog(this.props.item);
    }

    renderStars(rating) {
        let stars = [];
        for (var i = 0; i < parseInt(rating, 10); i++) {
            // stars.push(<FontAwesomeIcon icon="star" />);
        }
        return stars;
    }

    render() {
        const {
            date,
            section,
            participantCount,
            rating,
            description
        } = this.props.item;

        return (
            <div>
                <Card>
                    <CardHeader onClick={this.toggleContent}>
                        {this.parseDate(date)} - {section}
                        <div class="open-icon">
                            {/* <FontAwesomeIcon
                                icon={
                                    this.state.isOpen
                                        ? "caret-down"
                                        : "caret-right"
                                }
                            /> */}
                        </div>
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
    updateOpenLog: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    openModal: state.openModal
});

export default connect(
    mapStateToProps,
    { toggleModal, updateOpenLog }
)(LogItem);
