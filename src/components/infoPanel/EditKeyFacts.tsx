import { DialogContent, InputLabel, MenuItem, Select } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import React, { Component } from "react";
import { IKeyFactsChar, IKeyFactsNum, IKeyFactsNumItem } from "../../utils/types";
import { IKeyFactProps, KEY_FACTS_CHAR_PROPS, KEY_FACTS_NUM_PROPS } from "./KeyFactsCard";

const unitOptions: string[] = [
    "km",
    "m",
    "hours",
    "minutes",
    "days",
    "m/km",
];

const KEY_FACTS_CHAR_IDS: string[] = KEY_FACTS_CHAR_PROPS.map(
    (item: IKeyFactProps<IKeyFactsChar>) => item.key as string,
);

interface IOpenDialogParams {
    type: "char" | "num" | "numRange";
    key: keyof IKeyFactsChar | keyof IKeyFactsNum;
}

interface IEditKeyFactsProps {
    onChangeNum: (keyFacts: IKeyFactsNum) => void;
    onChangeChar: (keyFacts: IKeyFactsChar) => void;
    keyFactsNum: IKeyFactsNum;
    keyFactsChar: IKeyFactsChar;
}

interface IEditKeyFactsState {
    dialogOpen: boolean;
    editKey?: keyof IKeyFactsChar | keyof IKeyFactsNum;
    type: "char" | "num" | "numRange";
    value?: string | number | number[];
    units?: string;
    addMode: boolean;
}

export default class EditKeyFacts extends Component<IEditKeyFactsProps, IEditKeyFactsState> {
    constructor(props: IEditKeyFactsProps) {
        super(props);
        this.state = {
            dialogOpen: false,
            type: "char",
            addMode: false,
        };
    }

    public getValue = (params: IOpenDialogParams): string | number | number[] | undefined => {
        if (params.type === "char") {
            return this.props.keyFactsChar[params.key as keyof IKeyFactsChar];
        }
        if (params.type === "num" || params.type === "numRange") {
            return this.props.keyFactsNum[params.key as keyof IKeyFactsNum].value;
        }
    }

    public getUnits = (params: IOpenDialogParams): string | undefined => {
        if (params.type === "num" || params.type === "numRange") {
            return this.props.keyFactsNum[params.key as keyof IKeyFactsNum].unit;
        }
    }

    public edit = (key: keyof IKeyFactsChar, type: "char" | "num" | "numRange"): void => {
        const value: string | number | number[] | undefined = this.getValue({type, key});
        this.setState({
            dialogOpen: true,
            editKey: key,
            value,
            type,
            units: this.getUnits({type, key}),
        });
    }

    public renderNumString = (item: IKeyFactsNumItem): string => {
        if (typeof(item.value) === "number") {
             return (item.value + " " + item.unit);
        } else if (item.value.length > 1) {
            return (item.value[0] + " - " + item.value[1] + " " + item.unit);
        }
        return "";
    }

    public getType = (item: IKeyFactsNumItem): "num" | "numRange" | "char" => {
        if (typeof(item.value) === "number") {
             return "num";
        } else if (item.value.length > 1) {
            return "numRange";
        }
        return "num";
    }

    public getList = (): JSX.Element => {
        const results: JSX.Element[] = [];
        // const keyFactsNum: IKeyFactsNum = this.props.itemDetails.key_facts_num;
        const keyFactsChar: IKeyFactsChar = this.props.keyFactsChar;

        let keys: string[] = Object.keys(keyFactsChar);
        for (const key of keys) {
            const itemProps: IKeyFactProps<IKeyFactsChar> = KEY_FACTS_CHAR_PROPS.filter(
                (item: IKeyFactProps<IKeyFactsChar>) => item.key === key,
            )[0];
            const result: JSX.Element = (
                <Grid item xs={6} lg={2} key={itemProps.name}>
            <ListItem>
                    <ListItemText
                        style={{marginLeft: "10px"}}
                        primary={itemProps.name}
                        secondary={keyFactsChar[key as keyof IKeyFactsChar]} />
                         <Tooltip title="Edit">
                            <IconButton
                                aria-label="Edit"
                                onClick={(e: any): void => {
                                    this.edit(key as keyof IKeyFactsChar, "char");
                                }}
                            >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </ListItem></Grid>);
            results.push(result);

        }

        const keyFactsNum: IKeyFactsNum = this.props.keyFactsNum;

        keys = Object.keys(keyFactsNum);
        for (const key of keys) {
            const itemProps: IKeyFactProps<IKeyFactsNum> = KEY_FACTS_NUM_PROPS.filter(
                (item: IKeyFactProps<IKeyFactsNum>) => item.key === key,
            )[0];
            const result: JSX.Element = (
                <Grid item xs={6} lg={2} key={itemProps.name}>
            <ListItem>
                   <ListItemText
                        style={{marginLeft: "10px"}}
                        primary={itemProps.name}
                        secondary={this.renderNumString(keyFactsNum[key as keyof IKeyFactsNum])} />
                         <Tooltip title="Edit">
                            <IconButton
                                aria-label="Edit"
                                onClick={(e: any): void => {
                                    this.edit(
                                        key as keyof IKeyFactsChar,
                                        this.getType(keyFactsNum[key as keyof IKeyFactsNum]),
                                    );
                                }}
                            >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                    </ListItem></Grid>);
            results.push(result);
        }

        return (
            <Grid container item spacing={0} justify="flex-start">
                {results}
                <Tooltip title="Add">
                            <IconButton
                                aria-label="Add"
                                onClick={this.addIconClick}
                            >
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </Grid>
        );
    }

    public changeUnits = (event: any): void => {
        this.setState({
            units: event.target.value,
        });
    }

    public editNumberType = (): JSX.Element | null => {
        const unitPicker: JSX.Element = (
            <Select
                value={this.state.units}
                onChange={this.changeUnits}
                inputProps={{
                name: "units",
                id: "units",
                }}
             >
                 {unitOptions.map((item: string) => (
                    <MenuItem value={item}>{item}</MenuItem>
                 ))}
             </Select>
        );

        if (this.state.type === "num") {
            return (
                <div>
                    <TextField
                        type="number"
                        id="standard-name"
                        label="Value"
                        value={this.state.value}
                        onChange={this.handleNumberChange}
                        margin="normal"
                    />
                    <InputLabel>Units</InputLabel>
                    {unitPicker}
                </div>
            );
        } else if (this.state.type === "numRange") {
            const valueRange: number[] = this.state.value as number[];
            return (
                <div>
                    <TextField
                        type="number"
                        id="standard-name"
                        label="Lower"
                        value={valueRange && valueRange[0]}
                        onChange={(event: any): void => {this.handleArrayChange(event, 0); }}
                        margin="normal"
                    />
                    <TextField
                        type="number"
                        id="standard-name"
                        label="Upper"
                        value={valueRange && valueRange[1]}
                        onChange={(event: any): void => {this.handleArrayChange(event, 1); }}
                        margin="normal"
                    />
                    <InputLabel>Units</InputLabel>
                    {unitPicker}
                </div>
            );
       }
        return null;
    }

    public handleSingleChange = (event: any): void => {
        this.setState({
            value: event.target.value,
        });
    }

    public handleNumberChange = (event: any): void => {
        this.setState({
            value: parseFloat(event.target.value) as number,
        });
    }

    public handleArrayChange = (event: any, index: number): void => {
        const newValue: number[] = this.state.value as number[];
        newValue[index] = event.target.value;
        this.setState({
            value: newValue,
        });
    }

    public handleClose = (): void => {
        this.setState({
            dialogOpen: false,
            addMode: false,
        });
    }

    public handleSave = (): void => {
        this.setState({
            dialogOpen: false,
            addMode: false,
        });
        const selectedKey: keyof IKeyFactsChar | keyof IKeyFactsNum | undefined = this.state.editKey;
        if (selectedKey && this.state.type === "num" && this.state.value) {
            const keyFacts: IKeyFactsNum = this.props.keyFactsNum;
            keyFacts[selectedKey as keyof IKeyFactsNum].value = this.state.value as number;
            keyFacts[selectedKey as keyof IKeyFactsNum].unit =
                this.state.units || keyFacts[selectedKey as keyof IKeyFactsNum].unit;
            this.props.onChangeNum(keyFacts);
        }
        if (selectedKey && this.state.type === "numRange" && this.state.value) {
            const keyFacts: IKeyFactsNum = this.props.keyFactsNum;
            keyFacts[selectedKey as keyof IKeyFactsNum].value = this.state.value as number[];
            keyFacts[selectedKey as keyof IKeyFactsNum].unit =
                this.state.units || keyFacts[selectedKey as keyof IKeyFactsNum].unit;
            this.props.onChangeNum(keyFacts);
        }
        if (selectedKey && this.state.type === "char" && this.state.value) {
            const keyFacts: IKeyFactsChar = this.props.keyFactsChar;
            keyFacts[selectedKey as keyof IKeyFactsChar] = this.state.value as string;
            this.props.onChangeChar(keyFacts);
        }
    }

    public handleDelete = (): void => {
        this.setState({
            dialogOpen: false,
            addMode: false,
        });
        const selectedKey: keyof IKeyFactsChar | keyof IKeyFactsNum | undefined = this.state.editKey;
        if (selectedKey && this.state.type === "num" && this.state.value) {
            const keyFacts: IKeyFactsNum = this.props.keyFactsNum;
            delete keyFacts[selectedKey as keyof IKeyFactsNum];
            this.props.onChangeNum(keyFacts);
        }
        if (selectedKey && this.state.type === "numRange" && this.state.value) {
            const keyFacts: IKeyFactsNum = this.props.keyFactsNum;
            delete keyFacts[selectedKey as keyof IKeyFactsNum];
            this.props.onChangeNum(keyFacts);
        }
        if (selectedKey && this.state.type === "char" && this.state.value) {
            const keyFacts: IKeyFactsChar = this.props.keyFactsChar;
            delete keyFacts[selectedKey as keyof IKeyFactsChar];
            this.props.onChangeChar(keyFacts);
        }
    }

    public addIconClick = (): void => {
        this.setState({
            dialogOpen: true,
            addMode: true,
            type: "char",
        });
    }

    public getTypeSelector = (): JSX.Element | null => {
        if (this.state.editKey && KEY_FACTS_CHAR_IDS.indexOf(this.state.editKey as string) > -1) {
            return null;
        } else {
            return (
                <div>
                    <InputLabel>{"Select type"}</InputLabel>
                    <Select
                        fullWidth
                        value={this.state.type}
                        onChange={(e: any): void => {this.setState({type: e.target.value}); }}
                        inputProps={{
                        name: "Type",
                        id: "type",
                        }}
                    >
                        <MenuItem value={"num"}>{"Number"}</MenuItem>
                        <MenuItem value={"numRange"}>{"Range"}</MenuItem>
                    </Select>
                </div>
             );
        }
    }

    public getKeyFactTypeSelector = (): JSX.Element => {
        const numOptions: Array<IKeyFactProps<IKeyFactsNum>> = KEY_FACTS_NUM_PROPS.filter(
            (item: IKeyFactProps<IKeyFactsNum>) => Object.keys(this.props.keyFactsNum).indexOf(item.key) === -1,
        );
        const charOptions: Array<IKeyFactProps<IKeyFactsChar>> = KEY_FACTS_CHAR_PROPS.filter(
            (item: IKeyFactProps<IKeyFactsChar>) => Object.keys(this.props.keyFactsChar).indexOf(item.key) === -1,
        );
        return (
            <div>
                <InputLabel>{"Select key fact"}</InputLabel>
                    <Select
                        fullWidth
                        value={this.state.editKey || null}
                        placeholder={"Select a type"}
                        onChange={(e: any): void => {this.setState({
                        editKey: e.target.value,
                        type: KEY_FACTS_CHAR_IDS.indexOf(this.state.editKey as string) ? "char" : "num",
                        }); }}
                        inputProps={{
                            name: "Type",
                            id: "type",
                        }}
                    >
                {numOptions.map((item: IKeyFactProps<IKeyFactsNum>) => (
                    <MenuItem value={item.key}>{item.name}</MenuItem>
                ))}
                {charOptions.map((item: IKeyFactProps<IKeyFactsChar>) => (
                    <MenuItem value={item.key}>{item.name}</MenuItem>
                ))}
                </Select>
            </div>
        );
    }

    public render(): JSX.Element {
        return (
            <div style={{width: "100%"}}>
                <Grid container item md={12} lg={12} justify="center">
                {this.getList()}
                </Grid>
                <Dialog
                    fullWidth
                    maxWidth={"xs"}
                    open={this.state.dialogOpen}
                >
                        <DialogTitle>
                            Edit
                        </DialogTitle>
                        <DialogContent>
                             {this.state.addMode && this.getKeyFactTypeSelector()}
                            {(this.state.addMode && this.state.editKey) && this.getTypeSelector()}
                            {this.state.type === "char" &&
                                <TextField
                                    id="standard-name"
                                    label="Text"
                                    value={this.state.value}
                                    onChange={this.handleSingleChange}
                                    margin="normal"
                                />
                            }
                            {(this.state.type === "num" || this.state.type === "numRange") && this.editNumberType()}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.handleDelete} color="primary">
                                Delete
                            </Button>
                            <Button onClick={this.handleSave} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
            </div>
        );
    }
}
