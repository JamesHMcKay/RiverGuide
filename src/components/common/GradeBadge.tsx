import React, { Component } from "react";
import { Badge } from "reactstrap";
import { IGauge, IGuide, IGradeRange } from './../../utils/types';

interface IGradeBadgeProps {
    gauges: IGauge[];
    guide: IGuide;
}


export class GradeBadge extends Component<IGradeBadgeProps> {
    constructor(props: IGradeBadgeProps) {
        super(props);
    }

    flowFilterCondition(grade: IGradeRange, guide: IGuide) {
        let gradeFrom = parseInt(grade.from, 10);
        let gradeTo = parseInt(grade.to, 10);
        let gaugeName: string = guide.gaugeName || '';

        let gaugeAtThisSite: IGauge | undefined = this.props.gauges.find(
            gauge =>
                gauge.siteName.toLowerCase() === gaugeName.toLowerCase()
        );

        if (gaugeAtThisSite) {
            let currentFlow = gaugeAtThisSite.currentFlow;
            return gradeFrom <= currentFlow && gradeTo >= currentFlow
                ? true
                : false;
        } else {
            return false;
        }
    }

    getColor(guide: IGuide) {
        let flowSpecificGrades = this.props.guide.flowSpecificGrades;
        if (flowSpecificGrades && flowSpecificGrades.length > 0) {
            let filteredGrades = flowSpecificGrades.filter(grade =>
                this.flowFilterCondition(grade, guide)
            );
            return filteredGrades.length > 0 ? "primary" : "secondary";
        } else {
            return "primary";
        }
    }

    getFlowAdjustGrade(guide: IGuide) {
        if (guide.flowSpecificGrades) {
            let grades = guide.flowSpecificGrades.filter(grade =>
                this.flowFilterCondition(grade, guide)
            );
    
            if (grades.length > 0) {
                return grades[0].from;
            }
        }
        return guide.grade;
    }

    render() {
        return (
            <Badge
                className="gradeBadge"
                color={this.getColor(this.props.guide)}
            >
                {this.getFlowAdjustGrade(this.props.guide)}
            </Badge>
        );
    }
}
