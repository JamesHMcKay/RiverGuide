import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import Person from "@material-ui/icons/Person";
import PersonAdd from "@material-ui/icons/PersonAdd";
import Star from "@material-ui/icons/Star";
import React, { Component } from "react";
import { connect } from "react-redux";
import { createLogEntry, editLogEntry } from "../../actions/actions";
import { openLogInfoPage } from "../../actions/getGuides";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
import { IAuth, IHistory, IInfoPage, IListEntry, ILogComplete, ILogEntry, IObsValue } from "../../utils/types";

import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import { Grid } from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import loadingButton from "../../utils/loadingButton";
import FlowReport from "./FlowReport";
import SectionSelect from "./SectionSelect";
import TimeSlider from "./TimeSlider";

interface ITripDetailsModelProps extends ITripDetailsModalStateProps {
    createLogEntry: (item: ILogEntry, guide: IListEntry | undefined) => void;
    editLogEntry: (item: ILogEntry) => void;
    handleClose: () => void;
    openLogInfoPage: (guide: IListEntry) => void;
    selectedGuide?: IListEntry;
    gaugeHistory?: IHistory[];
    initialLogEntry?: ILogComplete;
    isUpdate?: boolean;
}

interface ITripDetailsModelState {
    logEntry: ILogEntry;
    peopleCount: number;
    date: Date;
    start_date: Date;
    end_date: Date;
    timeRange: number[];
    rating: number;
    preventHoverChangePeople: boolean;
    preventHoverChangeRating: boolean;
    selectedGuide?: IListEntry;
    error?: string;
}

interface ITripDetailsModalStateProps {
    auth: IAuth;
    loadingSpinner: string;
    infoPage: IInfoPage;
}

class TripDetailsModal extends Component<ITripDetailsModelProps, ITripDetailsModelState> {
    constructor(props: ITripDetailsModelProps) {
        super(props);
        if (this.props.initialLogEntry) {
            const presetLogEntry: ILogComplete = {
                ...this.props.initialLogEntry,
            };
            const peopleCount: number = presetLogEntry.participants;
            const dateParsed: Date = new Date(presetLogEntry.start_date_time);
            this.state = {
                logEntry: presetLogEntry,
                peopleCount,
                date: dateParsed,
                start_date: dateParsed,
                end_date: dateParsed,
                preventHoverChangePeople: true,
                preventHoverChangeRating: true,
                rating: presetLogEntry.rating,
                selectedGuide: this.props.selectedGuide,
                timeRange: [9, 15],
            };
        } else {
            const guideId: string | undefined = this.props.selectedGuide ? this.props.selectedGuide.id : "";
            const initialLogEntry: ILogEntry = {
                log_id: "",
                guide_id: guideId || "",
                start_date_time: "",
                end_date_time: "",
                participants: 1,
                rating: 0,
                description: "",
                user_id: this.props.auth.user.id,
                id: "",
                public: true,
                username: this.props.auth.user.username,
            };

            this.state = {
                logEntry: initialLogEntry,
                peopleCount: 1,
                date: new Date(),
                start_date: new Date(),
                end_date: new Date(),
                preventHoverChangePeople: false,
                preventHoverChangeRating: false,
                rating: 1,
                timeRange: [9, 15],
            };
        }
    }

    public handleSectionChange = (selectedGuide: IListEntry): void => {
        this.setState({error: undefined});
        if (this.state.logEntry) {
            let logEntry: ILogEntry = this.state.logEntry;
            logEntry = {
                ...logEntry,
                guide_id: selectedGuide.id,
            };
            this.setState({
                logEntry,
                selectedGuide,
            });
        }
    }

    public handleSave = (): void => {
        let logEntry: ILogEntry = this.state.logEntry;
        logEntry = {
            ...logEntry,
            participants: this.state.peopleCount,
            start_date_time: this.state.start_date ? this.state.start_date.toISOString() : "",
            end_date_time: this.state.end_date ? this.state.end_date.toISOString() : "",
            rating: this.state.rating,
            username: this.state.logEntry.username,
        };

        if (logEntry.guide_id === "") {
            this.setState({error: "Select a section - if your section is not available let us know"});
            return;
        }

        if (this.props.isUpdate) {
            this.props.editLogEntry(logEntry as ILogEntry);
        } else {
            this.props.createLogEntry(logEntry as ILogEntry, this.props.infoPage.selectedGuide);
        }
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

    public onChange = (e: any): void => {
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
        const size: number = window.innerWidth > 960 ? 40 : 30;
        const keys: number[] = [0, 1, 2, 3];
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
                <Person style={{fontSize: size}} className="person-button-hover"/> :
                <Person style={{fontSize: size}} className="person-button"/>}
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
                <PersonAdd style={{fontSize: size}} className="person-button-hover"/> :
                <PersonAdd style={{fontSize: size}} className="person-button"/>}
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
        const size: number = window.innerWidth > 960 ? 40 : 30;
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
                <Star style={{fontSize: size}} className="person-button-hover"/> :
                <Star style={{fontSize: size}} className="person-button"/>}
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

    public handleTimeRangeChange = (timeRange: number[]): void => {
        const startDate: Date = new Date(this.state.start_date);
        const endDate: Date = new Date(this.state.end_date);
        startDate.setHours(timeRange[0]);
        endDate.setHours(timeRange[1]);
        this.setState({
            timeRange,
            start_date: startDate,
            end_date: endDate,
        });
    }

    public handleDateChange = (date: Date | null): void => {
        if (date) {
            const startDate: Date = new Date(date);
            const endDate: Date = new Date(date);
            startDate.setHours(this.state.timeRange[0]);
            endDate.setHours(this.state.timeRange[1]);
            this.setState({
                date,
                start_date: startDate,
                end_date: endDate,
            });
        }
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

    public handleFlowChange = (observables: IObsValue): void => {
        let logEntry: ILogEntry = this.state.logEntry;
        logEntry = {
            ...logEntry,
            observables,
        };
        this.setState({
            logEntry,
        });
    }

    public getSelectedGuide = (): IListEntry | undefined => {
        if (this.props.selectedGuide) {
            return this.props.selectedGuide;
        }
        return this.state.selectedGuide;
    }

    public getSelectedSection = (): JSX.Element => {
        if (this.props.selectedGuide) {
            return (
                <DialogContentText>
                {this.props.selectedGuide.display_name}
            </DialogContentText>);
        } else {
            return (<SectionSelect
                handleChange={this.handleSectionChange}
                selectedGuide={this.state.selectedGuide}
            />);
        }
    }

    public handlePublicChange = (event: any, value: string): void => {
        let logEntry: ILogEntry = this.state.logEntry;
        logEntry = {
            ...logEntry,
            public: value === "public",
        };
        this.setState({
            logEntry,
        });
    }

    public getPublicValue = (): string => {
        if (this.state.logEntry.public) {
            return "public";
        }
        return "private";
    }

    public render(): JSX.Element {
        const selectedGuide: IListEntry | undefined = this.getSelectedGuide();
        return (
            <div>
                <DialogTitle handleClose={this.props.handleClose} title={"Add Trip to Logbook"}/>
                <DialogContent>
                    {this.getSelectedSection()}
                    <DialogContentText style={{paddingTop: "20px"}}>
                        {"Number of participants"}
                    </DialogContentText>
                    <div className="person-count" style={{justifyContent: "center"}}>
                        {this.getPersonList()}
                    </div>
                    {this.state.peopleCount > 4 &&
                        <TextField
                            autoFocus
                            margin="dense"
                            id="people"
                            type="number"
                            value={this.state.peopleCount}
                            onChange={(value: any): void => this.setState({peopleCount: value.target.value})}
                            fullWidth
                        />
                        }
                    <div className="date-picker-container">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justify="space-around">
                        <KeyboardDatePicker
                            margin="normal"
                            id="mui-pickers-date"
                            label="Date picker"
                            value={this.state.date}
                            onChange={this.handleDateChange}
                            KeyboardButtonProps={{
                            "aria-label": "change date",
                            }}
                        />
                        </Grid>
                        <TimeSlider handleChange={this.handleTimeRangeChange} range={this.state.timeRange}/>
                    </MuiPickersUtilsProvider>
                    </div>
                    <DialogContentText>
                        {"Flow"}
                    </DialogContentText>
                    {(selectedGuide && this.state.date) &&
                    <div
                        style={{
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}
                    >
                        <FlowReport
                            selectedGuide={selectedGuide}
                            handleChange={this.handleFlowChange}
                            start_date={this.state.start_date}
                            end_date={this.state.end_date}
                            gaugeHistoryFromInfoPage={this.props.gaugeHistory}
                            observables={this.state.logEntry.observables || {flow: 0}}
                        />
                        </div>
                    }
                    <DialogContentText>
                        {"Rating"}
                    </DialogContentText>
                    <div className="person-count" style={{justifyContent: "center"}}>
                        {this.getRatingList()}
                    </div>
                    <DialogContentText>
                        {"Comments"}
                    </DialogContentText>
                    <TextField
                            multiline
                            variant="outlined"
                            rowsMax="8"
                            rows="2"
                            margin="dense"
                            id="comments"
                            type="text"
                            value={this.state.logEntry.description}
                            onChange={this.updateDescription}
                            fullWidth={true}
                    />
                    <div style={{
                            marginTop: "10px",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                        }}>
                        <ToggleButtonGroup value={this.getPublicValue()} exclusive onChange={this.handlePublicChange}>
                            <ToggleButton value="public">
                                {"Public"}
                            </ToggleButton>
                            <ToggleButton value="private">
                                {"Private"}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </DialogContent>
                {this.state.error &&
                <div>
                    {this.state.error}
                </div>}
                <div
                    style={{
                        margin: "1em",
                        position: "relative",
                    }}
                >
                    <Button
                        variant = "contained"
                        color="primary"
                        onClick={this.handleSave}
                        disabled={this.props.loadingSpinner === "logTrip"}
                        fullWidth>
                                Submit
                    </Button>
                    {this.props.loadingSpinner === "logTrip" && loadingButton()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: IState): ITripDetailsModalStateProps {
    return ({
        auth: state.auth,
        loadingSpinner: state.loadingSpinner,
        infoPage: state.infoPage,
    });
}

export default connect(
    mapStateToProps,
    { createLogEntry, editLogEntry, openLogInfoPage },
)(TripDetailsModal);
