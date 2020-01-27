import React, { PureComponent } from "react";

export interface IMapClusterProps {
    size: number;
    onClick: (zoomLevel: number, latitude: number, longitude: number) => void;
    count: number;
    zoomLevel: number;
    longitude: number;
    latitude: number;
}

export default class MapCluster extends PureComponent<IMapClusterProps> {
    public render(): JSX.Element {
        const width: number = this.props.size * 4;
        return (
            <div
                className="map-cluster"
                onClick={(): void => this.props.onClick(
                    this.props.zoomLevel,
                    this.props.latitude,
                    this.props.longitude,
                )}
                style={{
                    width: `${width}px`,
                    height: `${width}px`,
                }}
            >
                {this.props.count}
            </div>
        );
      }
}
