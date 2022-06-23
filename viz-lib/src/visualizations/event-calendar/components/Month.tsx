import React, { useState } from "react";
import * as moment from "moment";
import { extendMoment } from "moment-range";
import * as _ from "lodash";

const extendedMoment = extendMoment(moment);

const Month = ({ month, events, hoveredEvent, setHoveredEvent, handleEventClick }: any) => {
  const start = month;
  const end = extendedMoment.default(month).endOf("month");
  const dateRange = extendedMoment.range(start, end);
  const dates = Array.from(dateRange.by("day"));

  const firstDay = start.weekday();
  const startOffset = Array.apply(null, Array(firstDay));
  const endOffset = Array.apply(null, Array(42 - (firstDay + dates.length)));
  const monthDates = [...startOffset, ...dates, ...endOffset];

  const prepareEventDates = (events: any[]) => {
    return events.map((e: any) => {
      let start_date: any = extendedMoment.default(e.start_date);
      let end_date: any = extendedMoment.default(e.end_date);
      if (start_date < start) {
        start_date = start;
      }
      if (end_date > end) {
        end_date = end;
      }
      return { ...e, start_date, end_date };
    });
  };

  const eventsData = _.groupBy(prepareEventDates(_.slice(_.orderBy(events, "start_date"))), "project");

  const numTasks = Object.keys(eventsData).length + 1;

  const handleMouseOver = (event: any) => {
    setHoveredEvent(event.engagement_id);
  };

  const handleMouseLeave = () => {
    setHoveredEvent(null);
  };

  const getShortForm = (str: string) => {
    const matches = str.match(/\b(\w)/g);
    const acronym = matches?.join("").toUpperCase() || "";
    return acronym;
  };

  const renderMonthDates = () => [
    <span style={{ gridColumn: "8 / 15", textAlign: "center" }}></span>,
    monthDates.map((date: any) => (
      <span className={date ? "day" : "blank-day"} style={!date ? { gridRow: `span ${numTasks + 1}` } : {}}>
        {date && date.format("D")}
      </span>
    )),
  ];

  const renderProjectNames = () =>
    _.keys(eventsData).map((projectName: string) => (
      <span
        className="project-name"
        key={projectName}
        title={projectName}
        style={{ gridColumn: "8 / 15", textAlign: "center" }}>
        {getShortForm(projectName)}
      </span>
    ));

  const renderEvents = (projectData: any, projectStart: any, projectName: string) =>
    projectData.map((event: any, i: number) => {
      const style = {
        height: "100%",
        backgroundColor: event.color,
        gridColumn: `${1 + Math.abs(projectStart.start_date.date() - event.start_date.date())} / ${2 +
          event.end_date.date() -
          projectStart.start_date.date()}`,
        gridRow: 1,
        zIndex: 100 + event.start_date.date(),
      };
      return (
        <div
          key={event.engagement_id}
          className={`month-event-item ${hoveredEvent === event.engagement_id ? "hovered" : ""}`}
          style={style}
          title={`${event.title} | ${event.work_type} | ${event.phase}`}
          onMouseEnter={() => handleMouseOver(event)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleEventClick(event.engagement_id)}>
          {getShortForm(event.title)}
        </div>
      );
    });

  const renderProjects = () =>
    _.keys(eventsData).map((projectName: string) => {
      const projectData = eventsData[`${projectName}`];
      if (projectData) {
        const projectStart = _.minBy(projectData, "start_date");
        const projectEnd = _.maxBy(projectData, "end_date");
        const projectEventDuration = 1 + (projectEnd.end_date.date() - projectStart.start_date.date());
        const style = {
          gridColumn: `${14 + firstDay + projectStart.start_date.date()} / ${15 +
            firstDay +
            projectEnd.end_date.date()}`,
          display: "grid",
          gridTemplateColumns: `repeat(${projectEventDuration} , var(--gridSize))`,
          gridTemplateRows: "var(--gridSize)",
          alignItems: "center",
        };

        return (
          <>
            <span style={style} key={projectName}>
              {renderEvents(projectData, projectStart, projectName)}
            </span>
          </>
        );
      }
    });

  const style = {
    gridRow: `span ${numTasks + 1}`,
    gridTemplateRows: `repeat(${numTasks}, var(--gridSize))`,
  };

  return (
    <div className="month" style={style}>
      <div className="month-name-column" style={style}>
        <span className="name">{month.format("MMMM")}</span>
      </div>
      {renderMonthDates()}
      {renderProjectNames()}
      {renderProjects()}
    </div>
  );
};

export default React.memo(Month);
