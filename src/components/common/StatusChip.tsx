import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import React, { PureComponent } from "react";

interface IStatusChipProps {
    handleClick?: () => void;
    status: string;
}

interface IStatusChipDetails {
    color: string;
    text: string;
    tooltip: string;
}

export default class StatusChip extends PureComponent<IStatusChipProps> {

    public getChipTextColor = (): IStatusChipDetails => {
        switch (this.props.status) {
            case "pending_review":
                return {
                    text: "Pending review",
                    color: "#1e87e5",
                    tooltip: "This guide is awaiting review by one of our moderators",
                };
            case "changes_required":
                return {
                    text: "Changes required",
                    color: "orange",
                    tooltip: "This guide has been reviewed and requires changes of more details" +
                    "from you, please see our moderator comments.",
                };
            case "accepted":
                return {
                    text: "Accepted",
                    color: "#248f24",
                    tooltip: "This guide has been published, feel free to delete this submission from your list",
                };
            case "rejected":
                return {
                    text: "Rejected",
                    color: "red",
                    tooltip: "This guide was not able to be published, please see our moderator comments.",
                };
            default:
                return {
                    text: "Unknown",
                    color: "#1e87e5",
                    tooltip: "This status of this submission is unknown, please contact" +
                    "riverguide@whitewater.nz to bring it to our attention.",
                };
        }
    }

    public render(): JSX.Element {
        const chipDetails: IStatusChipDetails = this.getChipTextColor();

        return (
            <Tooltip title={chipDetails.tooltip}>
                {this.props.handleClick ?
                <Chip
                    label={chipDetails.text}
                    variant="outlined"
                    style={{borderColor: chipDetails.color, color: chipDetails.color}}
                    onClick={this.props.handleClick}
                /> :
                <Chip
                label={chipDetails.text}
                variant="outlined"
                style={{borderColor: chipDetails.color, color: chipDetails.color}}
                />
            }
            </Tooltip>
        );
      }
}
