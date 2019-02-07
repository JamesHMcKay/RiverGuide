import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import IoAndroidPerson from "react-icons/lib/io/android-person";
import IoAndroidAdd from "react-icons/lib/io/android-add";
import { State } from '../../reducers/index';

import { toggleModal } from "../../actions/actions";

import {
	Button,
	Form,
	FormGroup,
	Input,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader
} from "reactstrap";

interface IReportState {
    peopleCount: number;
    email?: string;
    password?: string;
}

interface IReportProps {
    toggleModal: (modal?: string) => void;
    isOpen: boolean;
}

class Report extends Component<IReportProps, IReportState> {
	constructor(props: IReportProps) {
		super(props);
		this.state = {
			peopleCount: 1
		};
		this.closeModal = this.closeModal.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	onSubmit(e: any) {
		e.preventDefault();

		const userData = {
			email: this.state.email,
			password: this.state.password
		};

		// this.props.loginUser(userData);
	}

	closeModal() {
		this.props.toggleModal();
	}

	setHover(key: number) {
		this.setState({
			peopleCount: key + 1
		});
	}

	addPerson() {
		this.setState({
			peopleCount: this.state.peopleCount + 1
		})
	}

	onChange(e: any) {
		this.setState({
			peopleCount: e.target.value
		})
	}

	getPersonList() {
		const keys = [0,1,2,3,4];
		let listItems = keys.map((key) =>
			<li key={key}
				style={{float: 'left'}}>
				<div>
					<span
						className="person-icon"
						onMouseEnter={this.setHover.bind(this,key)}
					>
					{key < this.state.peopleCount ?
						<IoAndroidPerson size={40} className="person-button-hover"/> :
						<IoAndroidPerson size={40} className="person-button"/>}
					</span>
				</div>
			</li>
		);

		listItems.push(
			<li key={keys.length + 1}
				style={{float: 'left'}}>
				<div>
					<span
						className="person-icon"
						onClick={this.addPerson.bind(this)}
					>
						{this.state.peopleCount > keys.length ?
						<IoAndroidAdd size={40} className="person-button-hover"/> :
						<IoAndroidAdd size={40} className="person-button"/>}
					</span>
				</div>
			</li>
		);

		listItems.push(
			<li key={keys.length + 2}
				style={{float: 'left'}}>
				<div>
					<Input
						className='person-count-value'
						// size='2'
						value={this.state.peopleCount}
						onChange={this.onChange}
					> </Input>
				</div>
			</li>
		);

		return (
			<ul
				style={{
					'list-style': 'none',
					float: 'right'
				}}
			>{listItems}</ul>
		);
	}

	render() {
		return (
			<Modal isOpen={this.props.isOpen} toggle={this.closeModal}>
				<ModalHeader toggle={this.closeModal}>
					How many in your group?
				</ModalHeader>
				<Form onSubmit={this.onSubmit}>
					<ModalBody>
						<FormGroup>
						<div className="person-count">
							{this.getPersonList()}
						</div>
						</FormGroup>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={this.closeModal}>
							Submit
						</Button>{" "}
						<Button color="secondary" onClick={this.closeModal}>
							Cancel
						</Button>
					</ModalFooter>
				</Form>
			</Modal>
		);
	}
}

Report.propTypes = {
	toggleModal: PropTypes.func.isRequired
};

const mapStateToProps = (state: State) => ({
	isOpen: state.openModal === "reportModal"
});

export default connect(
	mapStateToProps,
	{ toggleModal }
)(Report);