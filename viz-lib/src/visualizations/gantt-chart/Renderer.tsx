import React from "react";
import { RendererPropTypes } from "@/visualizations/prop-types";

import { groupBy } from "lodash";
import moment from "moment";

import HighchartsReact from "highcharts-react-official";
// Import Highcharts
import Highcharts from "highcharts";
import highchartsGantt from "highcharts/modules/gantt";
import chartNoData from "highcharts/modules/no-data-to-display";

chartNoData(Highcharts);
highchartsGantt(Highcharts);

import "./renderer.less";

function prepareData(data: any) {
  if (data === undefined || data === null || data.length === 0) {
    return [[], [""]];
  }
  const projects = groupBy(data, (item: any) => item.project);
  const series: Array<any> = [];
  let projectIndex = 0;

  for (const project in projects) {
    const projectData: any = projects[project];
    const projectId: string = `${projectData[0].project_id}`;
    const projectSeries: any = {
      name: projectData[0].project,
      data: [],
    };

    projectData.forEach((phase: any) => {
      projectSeries.data.push({
        id: phase.phase_id,
        name: phase.phase,
        start: new Date(phase.phase_start).getTime(),
        end: new Date(phase.phase_end).getTime(),
        y: projectIndex,
        color: phase.color,
      });
    });
    series.push(projectSeries);
    projectIndex += 1;
  }

  return [series, Object.keys(projects)];
}

export default function Renderer({ data, options }: any) {
  const [tasks, projects] = prepareData(data.rows);
  const first = tasks.length > 0 ? tasks[0] : undefined;
  const last = tasks.length > 0 ? tasks[tasks.length - 1] : undefined;
  const day = 1000 * 60 * 60 * 24;
  const chartData: Highcharts.Options = {
    title: {
      text: "Projects",
    },
    xAxis: [
      {
        tickInterval: day * 30, // Month
        labels: {
          format: "{value:%m}",
          style: {
            fontSize: "12px",
            width: 150,
            padding: "5px",
          },
          step: 1,
        },
        min: first
          ? first.data[0].start - day * 15
          : moment()
              .subtract(1, "months")
              .valueOf(),
        max: last
          ? last.data[last.data.length - 1].end + day * 15
          : moment()
              .add(3, "years")
              .valueOf(),
        currentDateIndicator: true,
      },
      {
        tickInterval: day * 365, // Year
        labels: {
          format: "{value:%Y}",
        },
        linkedTo: 0,
      },
    ],
    yAxis: {
      categories: projects,
    },
    series: tasks,
    chart: {
      showAxes: true,
    },
    lang: {
      noData: "No data available",
    },
  };

  return (
    <div className="gantt-chart-visualization-container">
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"ganttChart"}
        options={chartData}
        containerProps={{ className: "gantt-chart-visualization" }}
      />
    </div>
  );
}

Renderer.propTypes = RendererPropTypes;
