import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import marked from "marked";
import React, { Component } from "react";
import { connect } from "react-redux";
import { setExpansionPanels } from "../../actions/actions";
import { IState } from "../../reducers";
import { IExpansionPanels } from "../../utils/types";

marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: true,
});

interface IExpansionHeadProps extends IExpansionHeadStateProps {
    setExpansionPanels: (expansionPanels: IExpansionPanels) => void;
    panelName: keyof IExpansionPanels;
    title: string;
}

interface IExpansionHeadStateProps {
    expansionPanels: IExpansionPanels;
}

class ExpansionHead extends Component<IExpansionHeadProps> {
    public toggleVisible = (): void => {
        const updatedPanels: IExpansionPanels = {
            ...this.props.expansionPanels,
            [this.props.panelName ]: !this.props.expansionPanels[this.props.panelName],
        };
        this.props.setExpansionPanels(updatedPanels);
    }

    public getExpansionIcon = (): JSX.Element => {
        const icon: JSX.Element = this.props.expansionPanels[this.props.panelName] ?
            <ExpandLessIcon style={{float: "right"}}/> : <ExpandMoreIcon style={{float: "right"}}/>;
        return icon;
    }

    public render(): JSX.Element {
        return (
            <div>
                <Grid
                    container
                    spacing={0}
                    justify="space-between"
                    style={{display: "flex", flexDirection: "row", cursor: "pointer"}}
                    onClick={this.toggleVisible}
                >
                <Typography variant="h5" gutterBottom>
                    {this.props.title}
                </Typography>
                {this.getExpansionIcon()}
                </Grid>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IExpansionHeadStateProps {
    return ({
        expansionPanels: state.expansionPanels,
    });
}

export default connect(mapStateToProps,
    {setExpansionPanels},
)(ExpansionHead);
