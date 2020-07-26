import {
    createStyles,
    FormControl,
    InputLabel,
    Link,
    OutlinedInput,
    Step,
    StepLabel,
    Stepper,
    Theme,
    Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import HelpIcon from "@material-ui/icons/HelpRounded";
import { ContentState, convertFromHTML, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { connect } from "react-redux";
import uuid from "uuidv4";
import { IState } from "../../reducers";
import DialogTitle from "../../utils/dialogTitle";
import { IKeyFactsChar, IKeyFactsNum } from "../../utils/keyFacts";
import loadingButton from "../../utils/loadingButton";
import { IAuth, IErrors, IGauge, IInfoPage, IMarker } from "../../utils/types";
import { ACTIVITY_MENU } from "../ActivityFilter";
import EditKeyFacts from "../infoPanel/EditKeyFacts";
import GaugeSelect from "../infoPanel/GaugeSelect";
import EditGaugeComponent from "../map/EditGaugeComponent";
import EditMapComponent from "../map/EditMapComponent";

const STEPS: string[] = [
    "Basic details",
    "Key facts",
    "Description",
    "Markers",
    "Gauge",
    "Contact details",
];

const REGIONS: string[] = [
    "Auckland",
    "Bay of Plenty",
    "Canterbury",
    "Gisborne",
    "Hawke's Bay",
    "Manawatu",
    "Marlborough",
    "Northland",
    "Otago",
    "Southland",
    "Taranaki",
    "Tasman",
    "Waikato",
    "Wanganui",
    "Wellington",
    "West Coast",
];

const styles: any = (theme: Theme): any => createStyles({
    root: {
        width: "100%",
      },
      backButton: {
        marginRight: theme.spacing(1),
      },
      instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
});

export interface IDraftGuideState {
    displayName: string;
    riverName?: string;
    region: string;
    activity?: string;
    description: string;
    attribution: string;
    directions: string;
    gaugeId: string | undefined;
    id: string | undefined;
    markers: {[key: string]: IMarker};
    editorState: EditorState;
    editorStateDirections: EditorState;
    keyFactsNum: Partial<IKeyFactsNum>;
    keyFactsChar: Partial<IKeyFactsChar>;
    locationMarker?: IMarker;
    openDeleteDialog: boolean;
    activeStep: number;
    userEmail: string;
    userName: string;
    userId: string;
    moderatorComments: string;
    seenWelcomePage: boolean;
}

interface IDraftGuideProps extends IDraftGuideStateProps {
    handleClose: () => void;
    infoPage?: IInfoPage;
    handleSave: (result: IDraftGuideState) => void;
    handleDelete?: () => void;
    title: string;
    classes: any;
}

interface IDraftGuideStateProps {
    gauges: IGauge[];
    auth: IAuth;
    loadingSpinner: string;
    errors?: IErrors;
}

class DraftGuide extends React.Component<IDraftGuideProps, IDraftGuideState> {
    constructor(props: IDraftGuideProps) {
        super(props);
        let description: string = "Write a description here";
        let directions: string = "Give directions here";

        if (this.props.infoPage && this.props.infoPage.itemDetails) {
            if (this.props.infoPage.itemDetails.description) {
                description = this.props.infoPage.itemDetails.description;
            }
            if (!!convertFromHTML(this.props.infoPage.itemDetails.directions).contentBlocks) {
                directions = this.props.infoPage.itemDetails.directions;
            }
        }
        let gaugeId: string | undefined;
        let id: string | undefined;
        if (this.props.infoPage && this.props.infoPage.selectedGuide) {
            gaugeId = this.props.infoPage.selectedGuide.gauge_id;
            id = this.props.infoPage.selectedGuide.id;
        }

        let moderatorComments: string = "";
        let userEmail: string = "";
        let userName: string = "";
        let userId: string = "";
        if (this.props.infoPage && this.props.infoPage.itemDetails && this.props.infoPage.itemDetails.draftDetails) {
            moderatorComments = this.props.infoPage.itemDetails.draftDetails.moderatorComments;
            userEmail = this.props.infoPage.itemDetails.draftDetails.userEmail;
            userName = this.props.infoPage.itemDetails.draftDetails.userName;
        } else {
            userName = this.props.auth.user.username || "User name not found, try signing in again.";
            userEmail = this.props.auth.user.email || "";
            userId = this.props.auth.user.id || "";
        }

        const markers: {[key: string]: IMarker } = {};
        const markerList: IMarker[] = this.getMarkerList();
        for (const marker of markerList) {
            const id: string = uuid();
            marker.id = id;
            markers[id] = marker;
        }

        this.state = ({
            keyFactsChar: this.props.infoPage ? this.props.infoPage.itemDetails.key_facts_char : {},
            keyFactsNum: this.props.infoPage ? this.props.infoPage.itemDetails.key_facts_num : {},
            displayName: this.props.infoPage ? this.props.infoPage.selectedGuide.display_name : "",
            riverName: this.props.infoPage ? this.props.infoPage.selectedGuide.river_name : undefined,
            region: this.props.infoPage ? this.props.infoPage.selectedGuide.region : "",
            activity: this.props.infoPage ? this.props.infoPage.selectedGuide.activity : "",
            markers,
            description,
            directions,
            attribution:  this.props.infoPage ? this.props.infoPage.itemDetails.attribution : "",
            gaugeId,
            id,
            editorState: EditorState.createWithContent(
                ContentState.createFromBlockArray(convertFromHTML(description).contentBlocks),
            ),
            editorStateDirections: EditorState.createWithContent(
                ContentState.createFromBlockArray(convertFromHTML(directions).contentBlocks),
            ),
            locationMarker: this.getLocation(),
            openDeleteDialog: false,
            activeStep: 0,
            userEmail,
            userName,
            userId,
            moderatorComments,
            seenWelcomePage: false,
        });
    }

    public handleSave = (): void => {
        const result: IDraftGuideState = this.state;
        this.props.handleSave(result);
    }

    public updateDescription = (input: any): void => {
        const description: string = input.target.value;
        this.setState({
            description,
        });
    }

    public handleGaugeChange = (selectedGaugeId: string): void => {
        this.setState({
            gaugeId: selectedGaugeId,
        });
    }

    public getGaugeLocation = (): IMarker[] => {
        const gauges: IGauge[] = this.props.gauges.filter(
            (item: IGauge) => item.id === this.state.gaugeId,
        );
        if (gauges.length > 0) {
            const gaugeMarkers: IMarker[] = gauges.map((item: IGauge) =>
                ({
                    name: item.display_name,
                    lat: item.position.lat,
                    lng: item.position.lon || 0,
                    id: item.display_name,
                    description: "Gauge",
                    category: "Gauge",
                }));
            return gaugeMarkers;
        }
        return [];
    }

    public getLocation = (): IMarker | undefined => {
        if (this.props.infoPage && this.props.infoPage.selectedGuide) {
            const marker: IMarker = {
                name: "Guide location",
                lat: this.props.infoPage.selectedGuide.position.lat,
                lng: this.props.infoPage.selectedGuide.position.lon || 0,
                id: "1",
                description: "",
                category: "",
            };
            return marker;
        }
    }

    public getMarkerList = (): IMarker[] => {
        const markerList: IMarker[] | undefined =
            (this.props.infoPage && this.props.infoPage.itemDetails) &&
                this.props.infoPage.itemDetails.markerList ?
                    this.props.infoPage.itemDetails.markerList : [];
        return markerList;
    }

    public updateMarkers = (markers: {[key: string]: IMarker}): void => {
        this.setState({
            markers,
        });
    }

    public updateLocationMarker = (marker: IMarker): void => {
        this.setState({
            locationMarker: marker,
        });
    }

    public onChangeNum = (keyFactsNum: IKeyFactsNum): void => {
        this.setState({
            keyFactsNum,
        });
    }

    public onChangeChar = (keyFactsChar: IKeyFactsChar): void => {
        this.setState({
            keyFactsChar,
        });
    }

    public onEditorStateChange = (editorState: EditorState): void => {
        this.setState({
          editorState,
          description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        });
    }

    public onEditorStateChangeDirections = (editorStateDirections: EditorState): void => {
        this.setState({
          editorStateDirections,
          directions: draftToHtml(convertToRaw(editorStateDirections.getCurrentContent())),
        });
    }

    public handleTextChange = (event: any, field: keyof IDraftGuideState): void => {
        this.setState({
            ...this.state,
            [field]: event.target.value,
        });
    }

    public getWarningLocationText = (): string | undefined => {
        if (!this.state.locationMarker) {
            return " (click anywhere on the map to add the location marker)";
        }
        return " (click to add additional markers)";
    }

    public setActiveStep = (activeStep: number): void => {
        this.setState({activeStep});
    }

    public handleNext = (): void => {
        if (!this.state.seenWelcomePage) {
            this.setState({
                seenWelcomePage: true,
            });
        } else if (this.state.activeStep === 5) {
            this.handleSave();
            this.setActiveStep(this.state.activeStep + 1);
        } else {
            this.setActiveStep(this.state.activeStep + 1);
        }
    }

    public handleBack = (): void => {
        if (this.state.activeStep === 0) {
            this.setState({
                seenWelcomePage: false,
            });
        } else {
            this.setActiveStep(this.state.activeStep - 1);
        }
    }

    public handleReset = (): void => {
        this.setActiveStep(0);
    }

    public editGauge = (): JSX.Element => {
        return (
            <div>
                <DialogContentText variant = "h5" color="textPrimary">
                        {"Select a gauge if one is available"}
                </DialogContentText>
                    <GaugeSelect
                        handleChange={this.handleGaugeChange}
                        selectedGaugeId={this.state.gaugeId}
                    />
                    <hr></hr>
                {this.state.locationMarker && <EditGaugeComponent
                    markers={this.state.markers}
                    gaugeMarkers={this.getGaugeLocation()}
                    locationMarker={this.state.locationMarker}
                    updateMarkers={this.updateMarkers}
                    updateLocationMarker={this.updateLocationMarker}
                    selectGauge={this.handleGaugeChange}
                />}

            </div>
        );
    }

    public editMarkers = (): JSX.Element => {
        return (
            <div>
                <DialogContentText variant = "h5" color="textPrimary">
                        {"Local Map" + this.getWarningLocationText()}
                </DialogContentText>
                <EditMapComponent
                    markers={this.state.markers}
                    gaugeMarkers={this.getGaugeLocation()}
                    locationMarker={this.state.locationMarker}
                    updateMarkers={this.updateMarkers}
                    updateLocationMarker={this.updateLocationMarker}
                />
            </div>
        );
    }

    public editKeyFacts = (): JSX.Element => {
        return (
            <div>
            <DialogContentText variant = "h5" color="textPrimary">
                        {"Add and edit key facts"}
                </DialogContentText>
                <EditKeyFacts
                        keyFactsNum={this.state.keyFactsNum as IKeyFactsNum}
                        keyFactsChar={this.state.keyFactsChar as IKeyFactsChar}
                        onChangeNum={this.onChangeNum}
                        onChangeChar={this.onChangeChar}
                        activity={this.state.activity || ""}
                    />
            <DialogContentText variant = "h5" color="textPrimary">
                        {"Directions"}
                    </DialogContentText>
                    <div style={{
                        borderStyle: "solid",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        padding: "5px",
                        borderColor: "rgba(0, 0, 0, 0.23)",
                        minHeight: "150px",
                        marginBottom: "20px",
                        maxHeight: "150px",
                        overflowY: "scroll",
                    }}>
                        <Editor
                            editorState={this.state.editorStateDirections}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={this.onEditorStateChangeDirections}
                            toolbar={{
                                options: ["inline", "link", "history"],
                                inline: {
                                    options: ["bold", "italic", "superscript", "subscript"],
                                },
                            }}
                        />
                    </div>
            </div>
        );
    }

    public editDescription = (): JSX.Element => {
        return (
            <div>
                <DialogContentText variant = "h5" color="textPrimary">
                        {"Description"}
                    </DialogContentText>
                    <div style={{
                        borderStyle: "solid",
                        borderRadius: "4px",
                        borderWidth: "1px",
                        padding: "5px",
                        borderColor: "rgba(0, 0, 0, 0.23)",
                        minHeight: "220px",
                        marginBottom: "20px",
                        maxHeight: "350px",
                        overflowY: "scroll",
                    }}>
                        <Editor
                            editorState={this.state.editorState}
                            toolbarClassName="toolbarClassName"
                            wrapperClassName="wrapperClassName"
                            editorClassName="editorClassName"
                            onEditorStateChange={this.onEditorStateChange}
                            toolbar={{
                                options: ["inline", "link", "history"],
                                inline: {
                                    options: ["bold", "italic", "superscript", "subscript"],
                                },
                            }}
                        />
                    </div>
            </div>
        );
    }

    public editMetaData = (): JSX.Element => {
        return (
            <div>
                <DialogContentText variant = "h5" color="textPrimary">
                        {"Title and location"}
                </DialogContentText>
                <FormControl variant="outlined" style={{width: "200px", paddingBottom: "20px", marginRight: "20px"}}>
                    <InputLabel htmlFor="outlined-age-simple">
                        Activity
                    </InputLabel>
                    <Select
                        value={this.state.activity || null}
                        onChange={(e: any): void => {this.setState({
                            activity: e.target.value,
                            }); }}
                        input={<OutlinedInput labelWidth={50} name="age" id="outlined-age-simple" />}
                    >
                    {ACTIVITY_MENU.map((item: {name: string, id: string}) => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <FormControl variant="outlined" style={{width: "200px", paddingBottom: "20px"}}>
                    <InputLabel htmlFor="region-selector">
                        Region
                    </InputLabel>
                    <Select
                        value={this.state.region}
                        onChange={(e: any): void => {this.setState({
                            region: e.target.value,
                            }); }}
                        input={<OutlinedInput labelWidth={50} name="Region" id="region-selector"/>}
                    >
                    {REGIONS.map((item: string) => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <div style={{display: "flex", flexDirection: "column"}}>
                <TextField
                    style={{marginRight: "20px"}}
                    id="standard-name"
                    label="Title"
                    value={this.state.displayName}
                    onChange={(e: any): void => {this.handleTextChange(e, "displayName"); }}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="standard-name"
                    style={{marginRight: "20px"}}
                    label="River name"
                    value={this.state.riverName}
                    onChange={(e: any): void => {this.handleTextChange(e, "riverName"); }}
                    margin="normal"
                    variant="outlined"
                />
                </div>
                <DialogContentText variant = "h5" color="textPrimary">
                        {"Attribution"}
                    </DialogContentText>
                    <TextField
                        id="standard-name"
                        label="Add your name if you want it displayed with this guide"
                        value={this.state.attribution}
                        onChange={(e: any): void => {this.handleTextChange(e, "attribution"); }}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                    />
                </div>
        );
    }

    public editContactDetails = (): JSX.Element => {
        return (
            <div>
                <div style={{display: "flex", flexDirection: "column"}}>
                <DialogContentText variant = "h5" color="textPrimary">
                        {"User name"}
                </DialogContentText>
                <DialogContentText variant = "body1" color="textPrimary">
                        {this.state.userName}
                </DialogContentText>
                <DialogContentText variant = "h5" color="textPrimary">
                        {"User email"}
                </DialogContentText>
                <TextField
                    id="standard-name"
                    style={{marginRight: "20px"}}
                    label="Contact email (must be a valid email address)"
                    value={this.state.userEmail}
                    onChange={(e: any): void => {this.handleTextChange(e, "userEmail"); }}
                    margin="normal"
                    variant="outlined"
                />
                </div>
                <DialogContentText variant = "h5" color="textPrimary">
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
                            value={this.state.moderatorComments || undefined}
                            onChange={(e: any): void => {this.handleTextChange(e, "moderatorComments"); }}
                            fullWidth={true}
                    />
                </div>
        );
    }

    public getWelcomePage = (): JSX.Element => {
        return (
            <div>
                <Typography align={"left"} variant={"h6"} style={{marginBottom: "30px"}}>
                    Welcome to the RiverGuide editor
                </Typography>
                <Typography align={"left"} variant={"body1"} style={{marginBottom: "30px"}}>
                    Please see our guide to submitting content if you are new here:
                    </Typography>
                    <p style={{marginBottom: "30px"}}>
                        <a
                            href="https://riverguide.co.nz/help/guide_submission"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Submission instructions and guidelines
                        </a>
                    </p>
                    <Typography align={"left"} variant={"body1"}>
                    All content is reviewed by our moderators before being published.
                    We reserve the right to modify your submission, and will notify you of any changes.
                    Once submitted, your draft guide will be visible to only you on the left of this page,
                    and you are welcome to make revisions before it is accepted.
                </Typography>
            </div>
        );
    }

    public getStepContent = (step: number): JSX.Element => {
        switch (step) {
            case 0:
                return this.state.seenWelcomePage ? this.editMetaData() : this.getWelcomePage();
            case 1:
                return this.editKeyFacts();
            case 2:
                return this.editDescription();
            case 3:
                return this.editMarkers();
            case 4:
                return this.editGauge();
            case 5:
                return this.editContactDetails();
            default:
                return <div></div>;
        }
    }

    public getStepFinished = (step: number): boolean => {
        const re: RegExp = /\S+@\S+\.\S+/;
        switch (step) {
            case 0:
                return (
                    (this.state.displayName !== "" &&
                    this.state.activity !== "" &&
                    this.state.region !== "" &&
                    !!this.state.riverName) ||
                    !this.state.seenWelcomePage
                );
            case 1: return true;
            case 2: return true;
            case 3: return !!this.state.locationMarker;
            case 4: return true;
            case 5: return re.test(this.state.userEmail);
            default:
                return true;
        }
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        const activeStep: number = this.state.activeStep;
        return (
        <div>
        <DialogTitle
            handleClose={this.props.handleClose}
            title={"Submit content"}
        />
        <DialogContent style={{height: "100%"}}>
        <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {STEPS.map((label: string) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === STEPS.length ? (
          <div>
            <Typography className={classes.instructions}>
                Thanks for submitting a guide, we will review it and publish it as soon as possible.
                We reserve the right to edit the material if necessary. If it is innappropriate,
                we may reject or modify the content. In this case, we will contact you to clarify.
                You are welcome to edit you submission by selecting it from the list on the left
                (refresh your page if you cannot see it).
            </Typography>
            {(this.props.errors && this.props.errors.id === "draftSubmissionError") &&
            <div>
                <Typography style={{backgroundColor: "orange", borderRadius: "5px", padding: "5px"}}>
                    An error occured submitting your guide, please try again with the button below.
                    If the problem persists please let us know at riverguide@whitewater.nz or by
                    getting in touch on Facebook (White Water New Zealand).
                </Typography>
                <div
                    style={{
                        margin: "1em",
                        position: "relative",
                    }}
                >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSave}
                    disabled={this.props.loadingSpinner === "submitDraftGuide"}
                >
                    Submit
                </Button>
                {this.props.loadingSpinner === "submitDraftGuide" && loadingButton()}
                </div>

            </div>
            }

          </div>
        ) : (
          <div>
            {this.getStepContent(activeStep)}
          </div>
        )}
      </div>
    </div>
        </DialogContent>
        <DialogActions>
        <Button
                variant = "outlined"
                disabled={activeStep === 0 && !this.state.seenWelcomePage}
                color="primary"
                onClick={this.handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <div
                    style={{
                        margin: "1em",
                        position: "relative",
                    }}
                >
                {
                    activeStep < STEPS.length ?
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleNext}
                    disabled={!this.getStepFinished(activeStep) || this.props.loadingSpinner === "submitDraftGuide"}
                >
                    {activeStep === STEPS.length - 1 ? "Submit" : "Next"}
                </Button> :
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.props.handleClose}
                    disabled={this.props.errors && this.props.errors.id === "draftSubmissionError"}
                >
                            Close
                </Button>
                }
                    {this.props.loadingSpinner === "submitDraftGuide" && loadingButton()}
                </div>
              <Link href="https://riverguide.co.nz/help/guide_submission" target="_blank">
              <HelpIcon />
              </Link>
        </DialogActions>
        </div>
        );

    }
}

function mapStateToProps(state: IState): IDraftGuideStateProps {
    return ({
        gauges: state.gauges,
        auth: state.auth,
        loadingSpinner: state.loadingSpinner,
        errors: state.errors,
    });
}

export default connect(
    mapStateToProps,
    { },
)(withStyles(styles)(DraftGuide));
