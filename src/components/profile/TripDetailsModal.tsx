import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import { DateFormatInput, TimeFormatInput } from "material-ui-next-pickers";
import React, { Component } from "react";
import IoAndroidAdd from "react-icons/lib/io/android-add";
import IoAndroidPerson from "react-icons/lib/io/android-person";
import IoAndroidStar from "react-icons/lib/io/android-star";
import { connect } from "react-redux";
import { createLogEntry, toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IHistory, ILogEntry } from "../../utils/types";
import { IGuide, IInfoPage } from "../../utils/types";

import FlowReport from "./FlowReport";
import SectionSelect from "./SectionSelect";

const initialState: ILogEntry = {
    _id: "",
    section: "",
    date: "",
    participantCount: 1,
    rating: 3,
    description: "",
};

interface ITripDetailsModelProps {
    createLogEntry: (item: ILogEntry) => void;
    handleClose: () => void;
    selectedGuide?: IGuide;
    gaugeHistory?: IHistory[];
}

interface ITripDetailsModelState {
    logEntry: ILogEntry;
    peopleCount: number;
    date: Date;
    rating: number;
    preventHoverChangePeople: boolean;
    preventHoverChangeRating: boolean;
    selectedGuide?: IGuide;
    flow?: string;
}

class TripDetailsModal extends Component<ITripDetailsModelProps, ITripDetailsModelState> {
    constructor(props: ITripDetailsModelProps) {
        super(props);
        const initialLogEntry: ILogEntry = initialState;

        this.state = {
            logEntry: initialLogEntry,
            peopleCount: 1,
            date: new Date(),
            preventHoverChangePeople: false,
            preventHoverChangeRating: false,
            rating: 1,
        };
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSectionChange = this.handleSectionChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    public handleChange(e: any): void {
        const key: string = e.target.name;
        if (this.state.logEntry && key in Object.keys(this.state.logEntry)) {
            const logEntry: ILogEntry = this.state.logEntry;
            logEntry[key as keyof ILogEntry] = e.target.value;
            this.setState({ logEntry });
        }
    }

    public handleSectionChange(selectedGuide: IGuide): void {
        if (this.state.logEntry) {
            let logEntry: ILogEntry = this.state.logEntry;
            logEntry = {
                ...logEntry,
                section: selectedGuide._id,
            };
            this.setState({
                logEntry,
                selectedGuide,
            });
        }
    }

    public handleSave(): void {
        let logEntry: ILogEntry = this.state.logEntry;
        logEntry = {
            ...logEntry,
            participantCount: this.state.peopleCount,
            date: this.state.date.toISOString(),
            rating: this.state.rating,
        };
        this.props.createLogEntry(logEntry as ILogEntry);
        this.props.handleClose();
    }

    public getValue = (key: string): string => {
        if (this.state.logEntry && key in Object.keys(this.state.logEntry)) {
            return this.state.logEntry[key as keyof ILogEntry] as string;
        } else {
            return "";
        }
    }

    public setHover(key: number): void {
        if (!this.state.preventHoverChangePeople) {
            this.setState({
                peopleCount: key + 1,
                });
        }
    }

    public addPerson(): void {
        this.setState({
        peopleCount: this.state.peopleCount + 1,
        });
    }

    public onChange(e: any): void {
        this.setState({
            peopleCount: e.target.value,
        });
    }

    public onSelectPeopleCount = (key: number): void => {
        this.setState({
            preventHoverChangePeople: true,
            peopleCount: key + 1,
        });
    }

    public getPersonList(): JSX.Element {
        const keys: number[] = [0, 1, 2, 3, 4];
        const listItems: JSX.Element[] = keys.map((key: number) =>
        <li key={key}
            style={{float: "left"}}>
            <div>
            <span
                className="person-icon"
                onMouseEnter={this.setHover.bind(this, key)}
                onMouseDown={this.onSelectPeopleCount.bind(this, key)}
            >
            {key < this.state.peopleCount ?
                <IoAndroidPerson size={40} className="person-button-hover"/> :
                <IoAndroidPerson size={40} className="person-button"/>}
            </span>
            </div>
        </li>,
        );

        listItems.push(
        <li key={keys.length + 1}
            style={{float: "left"}}>
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
        </li>,
        );

        return (
        <ul
            style={{
            listStyle: "none",
            float: "right",
            }}
        >{listItems}</ul>
        );
    }

    public setRatingHover(key: number): void {
        if (!this.state.preventHoverChangeRating) {
            this.setState({
                rating: key + 1,
            });
        }
    }

    public onSelectRating = (key: number): void => {
        this.setState({
            preventHoverChangeRating: true,
            rating: key + 1,
        });
    }

    public getRatingList(): JSX.Element {
        const keys: number[] = [0, 1, 2, 3, 4];
        const listItems: JSX.Element[] = keys.map((key: number) =>
        <li key={key}
            style={{float: "left"}}>
            <div>
            <span
                className="person-icon"
                onMouseEnter={this.setRatingHover.bind(this, key)}
                onMouseDown={this.onSelectRating.bind(this, key)}
            >
            {key < this.state.rating ?
                <IoAndroidStar size={40} className="person-button-hover"/> :
                <IoAndroidStar size={40} className="person-button"/>}
            </span>
            </div>
        </li>,
        );

        return (
        <ul
            style={{
            listStyle: "none",
            float: "right",
            }}
        >{listItems}</ul>
        );
    }

    public handleDateChange = (date: Date): void => {
        let logEntry: ILogEntry = this.state.logEntry;
        logEntry = {
            ...logEntry,
            date: date.toISOString(),
        };
        this.setState({
            logEntry,
            date,
        });
    }

    public updateDescription = (input: any): void => {
        const description: string = input.target.value;
        let logEntry: ILogEntry = this.state.logEntry;
        logEntry = {
            ...logEntry,
            description,
        };
        this.setState({
            logEntry,
        });
    }

    public handleFlowChange = (flow: string): void => {
        this.setState({
            flow,
        });
    }

    public getSelectedSection = (): JSX.Element => {
        if (this.props.selectedGuide) {
            return (
                <DialogContentText>
                {this.props.selectedGuide.title}
            </DialogContentText>);
        } else {
            return (<SectionSelect
                handleChange={this.handleSectionChange}
                selectedGuide={this.state.selectedGuide}
            />);
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <DialogTitle>
                    Add Trip to Logbook
                </DialogTitle >
                <DialogContent>
                    {this.getSelectedSection()}
                    <DialogContentText>
                        {"Number of participants"}
                    </DialogContentText>
                    <div className="person-count">
                        {this.getPersonList()}
                    </div>
                    {this.state.peopleCount > 5 &&
                        <TextField
                            autoFocus
                            margin="dense"
                            id="people"
                            type="number"
                            value={this.state.peopleCount}
                            onChange={(value: any): void => this.setState({peopleCount: value.target.value})}
                        />
                        }
                    <div className="date-picker-container">
                        <DateFormatInput
                            name="date-input"
                            label="Date"
                            value={this.state.date}
                            onChange={this.handleDateChange}
                            variant="standard"
                        />
                    </div>
                    <DialogContentText>
                        {"Rating"}
                    </DialogContentText>
                    <div className="person-count">
                        {this.getRatingList()}
                    </div>
                    <DialogContentText>
                        {"Comments"}
                    </DialogContentText>
                    <TextField
                            autoFocus
                            margin="dense"
                            id="comments"
                            type="text"
                            value={this.state.logEntry.description}
                            onChange={this.updateDescription}
                            fullWidth={true}
                        />
                    <FlowReport
                        selectedGuide={this.state.selectedGuide}
                        handleChange={this.handleFlowChange}
                        date={this.state.date}
                        gaugeHistoryFromInfoPage={this.props.gaugeHistory}
                        flow={this.state.flow}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                    Cancel
                    </Button>
                    <Button onClick={this.handleSave} color="primary">
                    Submit
                    </Button>
                </DialogActions>
            </div>
        );
    }
}

export default connect(
    null,
    { createLogEntry },
)(TripDetailsModal);
