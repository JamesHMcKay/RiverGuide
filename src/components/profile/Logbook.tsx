import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { ILogEntry } from "../../utils/types";

import { Badge, Button, Col, ListGroup, Row } from "reactstrap";
import "./profile.css";

import LogItem from "./LogItem";

interface ILogBookProps extends ILogBookStateProps {
    toggleModal: (modal?: string) => void;
}

interface ILogBookStateProps {
    log: ILogEntry[];
    openModal: string;
}

class Logbook extends Component<ILogBookProps> {
    constructor(props: ILogBookProps) {
        super(props);
        this.openModal = this.openModal.bind(this);
    }

    public openModal(): void {
        this.props.toggleModal("addTrip");
    }

    public render(): JSX.Element {
        const { log }: {log: ILogEntry[]} = this.props;

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
                                log.map((item: ILogEntry, idx: number) => (
                                    <LogItem key={idx} item={item} />
                                ))}
                        </ListGroup>
                    </div>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state: IState): ILogBookStateProps {
    return ({
        log: state.log,
        openModal: state.openModal,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal },
)(Logbook);
