import LayersRounded from "@material-ui/icons/LayersRounded";
import SatelliteRounded from "@material-ui/icons/SatelliteRounded";
import TerrainRounded from "@material-ui/icons/TerrainRounded";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import React, { Component } from "react";

interface ITileOptions {
    icon: JSX.Element;
    name: string;
    tile: string;
}

const tileOptions: ITileOptions[] = [
    { icon: <TerrainRounded />, name: "Terrain", tile: "mapbox://styles/mapbox/outdoors-v9"},
    { icon: <SatelliteRounded />, name: "Satellite", tile: "mapbox://styles/mapbox/satellite-v9"},
];

interface ITileSelectorProps {
    tile: string;
    onTileChange: (tile: string) => void;
}

interface ITileSelectorState {
    speedDialOpen: boolean;
}

export default class TileSelector extends Component<ITileSelectorProps, ITileSelectorState> {
    constructor(props: ITileSelectorProps) {
        super(props);
        this.state = {
            speedDialOpen: false,
        };
    }
    public handleDialClick = (): void => {
        this.setState({
            speedDialOpen: !this.state.speedDialOpen,
        });
    }

    public handleDialClose = (): void => {
        this.setState({ speedDialOpen: false });
      }

    public handleDialOpen = (): void => {
        this.setState({ speedDialOpen: true });
    }

    public handleTileChange = (tile: string): void => {
        this.props.onTileChange(tile);
    }

    public render(): JSX.Element {
        return (
            <SpeedDial
                ariaLabel="speedDial"
                icon={<LayersRounded fontSize={"large"}/>}
                onBlur={this.handleDialClose}
                onClick={this.handleDialClick}
                onClose={this.handleDialClose}
                onFocus={this.handleDialOpen}
                onMouseEnter={this.handleDialOpen}
                onMouseLeave={this.handleDialClose}
                open={this.state.speedDialOpen}
                direction={"down"}
            >
            {tileOptions.map((action: ITileOptions) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipPlacement="right"
                onClick={(e: any): void => {this.handleTileChange(action.tile); }}
              />
            ))}
          </SpeedDial>
        );
    }
}
