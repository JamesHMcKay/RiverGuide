import React, { Component } from "react";
import { GetRailProps, Handles, Rail, Slider, SliderItem, Ticks, Tracks } from "react-compound-slider";
import { Handle, Tick, Track } from "./sliderComponents";

interface ITimeSliderProps {
    range: any;
    handleChange: (range: any) => void;
}

const sliderStyle: React.CSSProperties = {
    margin: "5%",
    position: "relative",
    width: "90%",
  };

const railStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: 14,
    borderRadius: 7,
    cursor: "pointer",
    backgroundColor: "rgb(155,155,155)",
  };

const domain: number[] = [5, 21];

export default class TimeSlider extends Component<ITimeSliderProps> {
    public onChange = (values: any): void => {
        this.props.handleChange(values);
    }

    public render(): JSX.Element {
        const values: number[] = this.props.range;
        return (
            <div style={{ height: 40, width: "100%" }}>
              <Slider
                mode={1}
                step={1}
                domain={domain}
                rootStyle={sliderStyle}
                onChange={this.onChange}
                values={values}
              >
                <Rail>
                  {({ getRailProps }: { getRailProps: GetRailProps }): JSX.Element => (
                    <div style={railStyle} {...getRailProps()} />
                  )}
                </Rail>
                <Handles>
                  {({ handles, getHandleProps }: any): JSX.Element => (
                    <div className="slider-handles">
                      {handles.map((handle: SliderItem) => (
                        <Handle
                          key={handle.id}
                          handle={handle}
                          domain={domain}
                          getHandleProps={getHandleProps}
                        />
                      ))}
                    </div>
                  )}
                </Handles>
                <Tracks left={false} right={false}>
                  {({ tracks, getTrackProps }: any): JSX.Element => (
                    <div className="slider-tracks">
                      {tracks.map(({ id, source, target }: any) => (
                        <Track
                          key={id}
                          source={source}
                          target={target}
                          getTrackProps={getTrackProps}
                        />
                      ))}
                    </div>
                  )}
                </Tracks>
                <Ticks count={10}>
                  {({ ticks }: {ticks: SliderItem[]}): JSX.Element => (
                    <div className="slider-ticks">
                      {ticks.map((tick: SliderItem) => (
                        <Tick key={tick.id} tick={tick} count={ticks.length} />
                      ))}
                    </div>
                  )}
                </Ticks>
              </Slider>
            </div>
          );
    }
}
