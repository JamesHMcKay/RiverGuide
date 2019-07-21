import Tooltip from "@material-ui/core/Tooltip";
import React, { PureComponent } from "react";
import IoIosLocation from "react-icons/lib/io/ios-location";
import { IObservable } from "../../utils/types";
import FlowBadge from "../common/FlowBadge";

const pinStyle: {fill: string; stroke: string} = {
  fill: "#d00",
  stroke: "none",
};

interface IMapMarkerProps {
    size: number;
    onClick: () => void;
    editMode: boolean;
    toolTip: string;
    color?: string;
    subtext?: string;
    observables?: IObservable[];
}

export default class MapMarker extends PureComponent<IMapMarkerProps> {
    public getToolTip(element: any): JSX.Element {
        if (this.props.editMode) {
            return (<Tooltip title="Click for more options" style={{backgroundColor: "red"}}>{element}</Tooltip>);
        } else {
            return <Tooltip title={this.props.toolTip}>{element}</Tooltip>;
        }
    }

    public render(): JSX.Element {
        const {size = 80, onClick} = this.props;

        const toolTipContent: React.ReactNode = (
            <div style={{height: "fit-content"}}>
                <p><strong>{this.props.toolTip}</strong></p>
                {this.props.subtext && <p>{this.props.subtext}</p> }
                <FlowBadge observables={this.props.observables} />
            </div>);

        return (
            <Tooltip title={toolTipContent} onClick={onClick} style={{maxWidth: 300}}>
            <svg
                height={size}
                viewBox="0 0 80 80"
                style={{...pinStyle, transform: `translate(${-size / 2}px,${-size}px)`}}
                // onClick={onClick}
            >
                <IoIosLocation
                    size={80}
                    className="map-marker"
                    style={{color: "#1e87e5"}}
                />
            </svg>
            </Tooltip>
        );
      }
}
