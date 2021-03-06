import * as React from "react";
import {
  GetHandleProps,
  GetTrackProps,
  SliderItem,
} from "react-compound-slider";

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
interface IHandleProps {
  domain: number[];
  handle: SliderItem;
  getHandleProps: GetHandleProps;
}

export const Handle: React.SFC<IHandleProps> = ({
  domain: [min, max],
  handle: { id, value, percent },
  getHandleProps,
}: any): any => (
  <div
    role="slider"
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    style={{
      left: `${percent}%`,
      position: "absolute",
      marginLeft: "-11px",
      marginTop: "-6px",
      zIndex: 2,
      width: 24,
      height: 24,
      cursor: "pointer",
      borderRadius: "50%",
      boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.2)",
      backgroundColor: "#34568f",
    }}
    {...getHandleProps(id)}
  />
);

// *******************************************************
// TRACK COMPONENT
// *******************************************************
interface ITrackProps {
  source: SliderItem;
  target: SliderItem;
  getTrackProps: GetTrackProps;
}

export const Track: React.SFC<ITrackProps> = ({
  source,
  target,
  getTrackProps,
}: any): any => (
  <div
    style={{
      position: "absolute",
      height: 14,
      zIndex: 1,
      backgroundColor: "#7aa0c4",
      borderRadius: 7,
      cursor: "pointer",
      left: `${source.percent}%`,
      width: `${target.percent - source.percent}%`,
    }}
    {...getTrackProps()}
  />
);

// *******************************************************
// TICK COMPONENT
// *******************************************************
interface ITickProps {
  key: string;
  tick: SliderItem;
  count: number;
}

function parseTickValue(value: number): string {
  if (value > 12) {
    return (value - 12).toString() + " pm";
  } else if (value === 12) {
    return "12 pm";
  }
  return value.toString() + " am";
}

export const Tick: React.SFC<ITickProps> = ({ tick, count }: any): any => (
  <div>
    <div
      style={{
        position: "absolute",
        marginTop: 14,
        width: 1,
        height: 5,
        backgroundColor: "rgb(200,200,200)",
        left: `${tick.percent}%`,
      }}
    />
    <div
      style={{
        position: "absolute",
        marginTop: 22,
        fontSize: 10,
        textAlign: "center",
        marginLeft: `${-(100 / count) / 2}%`,
        width: `${100 / count}%`,
        left: `${tick.percent}%`,
      }}
    >
      {parseTickValue(tick.value)}
    </div>
  </div>
);
