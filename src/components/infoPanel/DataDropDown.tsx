import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { getGaugeDisclaimer } from "../../actions/getGauges";

const ITEM_HEIGHT: number = 48;

const options: Array<{name: string, id: string}> = [
    {name: "Infomation", id: "DataInfoModal"},
    {name: "Download", id: "DownloadModal"},
];

interface IDataDropDownProps {
    toggleModal: (modal: string) => void;
    agencyName: string;
    getGaugeDisclaimer: (agencyName: string) => void;
}

interface IDataDropDownState {
    anchorEl: any;
}
class DataDropDown extends Component<IDataDropDownProps, IDataDropDownState> {
    constructor(props: IDataDropDownProps) {
        super(props);

        this.state = {
            anchorEl: null,
        };
      }

      public handleClick = (event: any): void => {
        this.setState({ anchorEl: event.currentTarget });
    }

    public handleClose = (): void => {
        this.setState({ anchorEl: null });
    }

    public handleSelect = (event: any, category: string): void => {
        this.setState({ anchorEl: null });
        this.props.getGaugeDisclaimer(this.props.agencyName);
        this.props.toggleModal(category);
    }

      public render(): JSX.Element {
        const { anchorEl } = this.state;
        const open: boolean = Boolean(anchorEl);
        return (
            <div style = {{marginRight: "0em", marginLeft: "0.5em"}}>
                <IconButton
                aria-label="More"
                aria-owns={open ? "long-menu" : undefined}
                aria-haspopup="true"
                onClick={this.handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={this.handleClose}
                PaperProps={{
                    style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: 200,
                    },
                }}
                >
                {options.map((item: {name: string, id: string}) => (
                    <MenuItem
                        key={item.name}
                        selected={false}
                        onClick={(event: any): void => this.handleSelect(event, item.id)}
                    >
                        {item.name}
                    </MenuItem>
                ))}
                </Menu>
                            </div>
          );
      }
}

export default connect(
    null,
    { toggleModal, getGaugeDisclaimer},
)(DataDropDown);
