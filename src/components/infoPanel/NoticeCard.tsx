import {
    Button,
    Dialog,
    ExpansionPanel,
    ExpansionPanelActions,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
} from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    toggleModal,
} from "../../actions/actions";
import { IState } from "../../reducers";
import { IAuth, IExpansionPanels, IInfoPage, INotice } from "../../utils/types";
import AddNotice from "./AddNotice";
import DeleteNotice from "./DeleteNotice";

const styles: any = (theme: Theme): any => createStyles({
    dialogPaper: {
        minHeight: "80vh",
        maxHeight: "80vh",
    },
});

interface INoticeCardProps extends INoticeCardStateProps {
    title: string;
    toggleModal: (modal?: string) => void;
}

interface INoticeCardStateProps {
    expansionPanels: IExpansionPanels;
    notices: INotice[];
    infoPage: IInfoPage;
    openModal: string;
    auth: IAuth;
}

interface INoticeCardState {
    expanded: string;
}

class NoticeCard extends Component<INoticeCardProps, INoticeCardState> {
    constructor(props: INoticeCardProps) {
        super(props);
        this.state = {
            expanded: "",
        };
    }

    public setPanel = (panel: string): void => {
        if (this.state.expanded === panel) {
            this.setState({
                expanded: "",
            });
        } else {
            this.setState({
                expanded: panel,
            });
        }
    }

    public getNoticeColor = (priority: string): string => {
        switch (priority) {
            case "Warning":
                return "orange";
            case "Hazard": return "orange";
            case "Information": return "white";
            default:
                return "white";
        }
    }

    public dateWrapper = (inputDate: string): string => {
        const dateParsed: Date = new Date(inputDate);
        return dateParsed.toLocaleDateString();
    }

    public render(): JSX.Element {
        const notices: INotice[] = this.props.notices;
        return (
            <div>
                {notices.map((item: INotice) => (
                    <ExpansionPanel
                        key={item.id}
                        square
                        expanded={this.state.expanded === item.id}
                        onChange={(): void => {this.setPanel(item.id); }}
                    >
                    <ExpansionPanelSummary style={{backgroundColor: this.getNoticeColor(item.priority)}}>
                    <Typography>{item.priority} notice issued on {this.dateWrapper(item.createdAt)}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                    <Typography>
                        {item.description}
                    </Typography>
                    </ExpansionPanelDetails>
                    {item.userId === this.props.auth.user.id &&
                        <ExpansionPanelActions>
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={(): void => {this.props.toggleModal("editNoticeModal"); }}
                        >
                            Edit
                        </Button>
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={(): void => {this.props.toggleModal("deleteNoticeModal"); }}
                        >
                            Delete
                        </Button>
                        </ExpansionPanelActions>
                    }
                </ExpansionPanel>
                ))}
            <Dialog
            onClose={(): void => {this.props.toggleModal(); }}
            open={this.props.openModal === "editNoticeModal"}
            >
                <AddNotice infoPage={this.props.infoPage} noticeId={this.state.expanded}/>
            </Dialog>
            <Dialog
            onClose={(): void => {this.props.toggleModal(); }}
            open={this.props.openModal === "deleteNoticeModal"}
            >
                <DeleteNotice noticeId={this.state.expanded} guideId={this.props.infoPage.selectedGuide.id}/>
            </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState): INoticeCardStateProps {
    return ({
        expansionPanels: state.expansionPanels,
        notices: state.notices,
        infoPage: state.infoPage,
        openModal: state.openModal,
        auth: state.auth,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal },
)(withStyles(styles)(NoticeCard));
