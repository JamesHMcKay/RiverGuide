import React, { PureComponent } from "react";

export interface IMapClusterProps {
    size: number;
    onClick: () => void;
    count: number;
}

export default class MapCluster extends PureComponent<IMapClusterProps> {
    public render(): JSX.Element {
        let size: number = this.props.size > 10 ? this.props.size : 10;
        if (size > 20) {
            size = 20;
        }
        const padding: string = size > 10 ? "20%" : "none";
        const width: number = size * 3;
        const borderRadius: number = size * 3 / 2;
        return (
            <div
                className="map-cluster"
                onClick={(): void => this.props.onClick()}
                style={{
                    transform: `translate(${-size / 2}px,${-size}px)`,
                    color: "white",
                    width: `${width}px`,
                    height: `${width}px`,
                    borderRadius: `${borderRadius}px`,
                    paddingTop: padding,
                }}
            >
                {this.props.count}
            </div>
        );
      }
}
