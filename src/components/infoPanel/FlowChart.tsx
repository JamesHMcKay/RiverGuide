
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";
import { IHistory } from "../../utils/types";

// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

//amchart imports
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
//amchart theme
am4core.useTheme(am4themes_animated); 

interface IFlowChartProps {
    history: IHistory[];
    
}

class FlowChart extends Component<IFlowChartProps> {

    public mapHistory = (history: IHistory[]): any => {
        let result = []
        for(let i=0; i<history.length;i++){
            result.push({
                "currentFlow":(history[i].data.currentFlow? history[i].data.currentFlow: history[i].data.currentLevel),
                "date":history[i].time})
        }
        return result
    }
    

    public setChartOptions(){  
        let chart = am4core.create("chartdiv", am4charts.XYChart) as any;

        //chart.paddingRight = 10;

       
        chart.data = this.mapHistory(this.props.history)

        chart.dateFormatter.inputDateFormat = "dd/MM/yyyy";

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis()) as any;
        dateAxis.renderer.grid.template.location = 0.5;
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.renderer.grid.template.location = 0.5;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis()) as any;
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;

        let series = chart.series.push(new am4charts.LineSeries()) as any;
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "currentFlow";
        series.strokeWidth = 3;
        series.fillOpacity = 0.5;

        dateAxis.tooltipDateFormat = "dd/MM/yyyy"
        series.tooltipText = "{valueY.value}";
        chart.cursor = new am4charts.XYCursor();

        // Create a horizontal scrollbar range selector and place it underneath the date axis
            //with preview of the whole chart
            // chart.scrollbarX = new am4charts.XYChartScrollbar()
            // chart.scrollbarX.series.push(series);
            // chart.scrollbarX.parent = chart.bottomAxesContainer;

            // //only scrollbar
            chart.scrollbarX = new am4core.Scrollbar();
            chart.scrollbarX.parent = chart.bottomAxesContainer;
        
        // set default range to load, range starts -1 ends 1
        chart.events.on("ready", function () {
            dateAxis.zoom({start:0.50, end:1});
        });

    }
    
    public componentDidUpdate() {
            this.setChartOptions()
        
        }


    public render(): JSX.Element {
        
        return (
            <Card style={{width: "80%"}}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Flow history
                    </Typography>
                    <div id="chartdiv" style={{ width: "100%", height: "300px"}}></div>  
                </CardContent>
            </Card>
        );}
}

FlowChart.propTypes = {
    history: PropTypes.array.isRequired,
}

function mapStateToProps(state: IState): IFlowChartProps {
    return ({
        history: state.infoPage.history
    })
}

export default connect(mapStateToProps)(FlowChart);
