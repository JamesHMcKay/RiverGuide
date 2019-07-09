import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import LandscapeRounded from "@material-ui/icons/LandscapeRounded";
import QueryBuilder from "@material-ui/icons/QueryBuilder";
import Timeline from "@material-ui/icons/Timeline";
import WarningRounded from "@material-ui/icons/WarningRounded";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers";
import { IExpansionPanels, IItemDetails, IKeyFactsChar, IKeyFactsNum, IKeyFactsNumItem } from "../../utils/types";
import ExpansionHead from "./ExpansionHead";

export interface IKeyFactProps<T> {
    key: keyof T;
    name: string;
    icon: JSX.Element;
}

export const KEY_FACTS_NUM_PROPS: Array<IKeyFactProps<IKeyFactsNum>> = [
    {key: "gradient", name: "Gradient", icon: <LandscapeRounded fontSize="large" />},
    {key: "time", name: "Time", icon: <QueryBuilder fontSize="large" />},
    {key: "section_length", name: "Length", icon: <Timeline fontSize="large" />},
];

export const KEY_FACTS_CHAR_PROPS: Array<IKeyFactProps<IKeyFactsChar>> = [
    {key: "grade_overall", name: "Grade", icon: <WarningRounded fontSize="large" />},
    {key: "grade_hardest", name: "Grade (hardest)", icon: <WarningRounded fontSize="large" />},
];

interface IKeyFactsCardState {
    editIconShowing: boolean;
    editMode: boolean;
    value: string;
    tempValue: string;
}

interface IKeyFactsCardProps extends IKeyFactsCardStateProps {
    itemDetails: IItemDetails;
}

interface IKeyFactsCardStateProps {
    expansionPanels: IExpansionPanels;
}

class KeyFactsCard extends Component<IKeyFactsCardProps, IKeyFactsCardState> {
    public state: IKeyFactsCardState = {
        editIconShowing: false,
        editMode: false,
        value: "",
        tempValue: "",
    };

    public componentWillReceiveProps = (props: IKeyFactsCardProps): void => {
        this.setState({ ...this.state });
    }

    public handleChange = (event: any): void => {
        this.setState({ tempValue: event.target.value });
    }

    public renderNumString = (item: IKeyFactsNumItem): string => {
        if (typeof(item.value) === "number") {
             return (item.value + " " + item.unit);
        } else if (item.value.length > 1) {
            return (item.value[0] + " - " + item.value[1] + " " + item.unit);
        }
        return "";
    }

    public getNewKeyFacts = (): JSX.Element => {
        const results: JSX.Element[] = [];
        // const keyFactsNum: IKeyFactsNum = this.props.itemDetails.key_facts_num;
        const keyFactsChar: IKeyFactsChar = this.props.itemDetails.key_facts_char;

        let keys: string[] = Object.keys(keyFactsChar);
        for (const key of keys) {
            const itemProps: IKeyFactProps<IKeyFactsChar> = KEY_FACTS_CHAR_PROPS.filter(
                (item: IKeyFactProps<IKeyFactsChar>) => item.key === key,
            )[0];
            const result: JSX.Element = (<Grid item xs={6} lg={3} key={itemProps.name}>
            <ListItem>
                {itemProps.icon}
                    <ListItemText
                        style={{marginLeft: "10px"}}
                        primary={itemProps.name}
                        secondary={keyFactsChar[key as keyof IKeyFactsChar]} />
                </ListItem>
            </Grid>);
            results.push(result);

        }

        const keyFactsNum: IKeyFactsNum = this.props.itemDetails.key_facts_num;

        keys = Object.keys(keyFactsNum);
        for (const key of keys) {
            const itemProps: IKeyFactProps<IKeyFactsNum> = KEY_FACTS_NUM_PROPS.filter(
                (item: IKeyFactProps<IKeyFactsNum>) => item.key === key,
            )[0];
            const result: JSX.Element = (<Grid item xs={6} lg={3} key={itemProps.name}>
            <ListItem>
                {itemProps.icon}
                        <ListItemText
                            style={{marginLeft: "10px"}}
                            primary={itemProps.name}
                            secondary={this.renderNumString(keyFactsNum[key as keyof IKeyFactsNum])} />
                    </ListItem>
            </Grid>);
            results.push(result);
        }

        return (
            <Grid container item spacing={0} justify="flex-start">
                {results}
            </Grid>
        );
    }

    public render(): JSX.Element {
        return (
            <div style={{width: "100%"}}>
                <ExpansionHead title={"Key Facts"} panelName={"keyFacts"}/>
                {this.props.expansionPanels.keyFacts &&
                    <Grid container item md={12} lg={12} justify="center">
                        {this.getNewKeyFacts()}
                    </Grid>
            }
            </div>
        );
    }
}

function mapStateToProps(state: IState): IKeyFactsCardStateProps {
    return ({
        expansionPanels: state.expansionPanels,
    });
}

export default connect(mapStateToProps)(KeyFactsCard);
