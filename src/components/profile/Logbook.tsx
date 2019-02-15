import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { ILogEntry } from "../../utils/types";

import { Badge, Button, Col, ListGroup, Row } from "reactstrap";
import "./profile.css";

import LogItem from "./LogItem";

interface ILogBookProps {
    toggleModal: (modal: string) => void;
    log: ILogEntry[];
}

class Logbook extends Component<ILogBookProps> {
    constructor(props: ILogBookProps) {
        super(props);
        this.openModal = this.openModal.bind(this);
    }

    public openModal() {
        this.props.toggleModal("addTrip");
    }

    public render() {
        const { log } = this.props;

        return (
            <div>
                <Row>
                    <Col md="10" lg="10">
                        <div className="logbook-title">
                            <h4>
                                Logbook <Badge pill>{log.length}</Badge>
                            </h4>
                        </div>
                    </Col>
                    <Col md="2" lg="2">
                        <Button color="success" onClick={this.openModal}>
                            Add Trip
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <div className="logbook-content">
                        <ListGroup flush>
                            {log &&
                                log.map((item, idx) => (
                                    <LogItem key={idx} item={item} />
                                ))}
                        </ListGroup>
                    </div>
                </Row>
            </div>
        );
    }
}

Logbook.propTypes = {
    log: PropTypes.array,
    toggleModal: PropTypes.func.isRequired,
};

const mapStateToProps = (state: IState) => ({
    log: state.log,
    openModal: state.openModal,
});

export default connect(
    mapStateToProps,
    { toggleModal },
)(Logbook);
