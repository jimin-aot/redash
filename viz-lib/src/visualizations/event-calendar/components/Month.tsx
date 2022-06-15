import React from "react";
import * as moment from "moment";
import { extendMoment } from "moment-range";
import * as _ from "lodash";

const extendedMoment = extendMoment(moment);

const Month = ({ month, events, hoveredEvent, setHoveredEvent, ...rest }: any) => {
  const start = month;
  const end = extendedMoment.default(month).endOf("month");
  const dateRange = extendedMoment.range(start, end);
  const dates = Array.from(dateRange.by("day"));

  const firstDay = start.weekday();
  const startOffset = Array.apply(null, Array(firstDay));
  const endOffset = Array.apply(null, Array(42 - (firstDay + dates.length)));
  const weekDates = [...startOffset, ...dates, ...endOffset];

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
  const style = {
    gridRow: `span ${numTasks + 1}`,
    gridTemplateRows: `repeat(${numTasks}, var(--gridSize))`,
  };

  return (
    <div className="month" style={style}>
      <div className="month-name-column" style={style}>
        <span className="name">{month.format("MMMM")}</span>
      </div>

      {weekDates.map((date: any) => (
        <span className={date ? "day" : "day blank-day"} style={!date ? { gridRow: `span ${numTasks + 1}` } : {}}>
          {date && date.format("D")}
        </span>
      ))}
      {_.keys(eventsData).map((projectName: string) => {
        const projectData = eventsData[`${projectName}`];
        if (projectData) {
          const projectStart = _.minBy(projectData, "start_date");
          const projectEnd = _.maxBy(projectData, "end_date");
          const projectEventDuration = 1 + (projectEnd.end_date.date() - projectStart.start_date.date());
          // 8 + firstDay + projectEnd.end_date.date() - 7 + firstDay + projectStart.start_date.date()
          return (
            <span
              style={{
                gridColumn: `${7 + firstDay + projectStart.start_date.date()} / ${8 +
                  firstDay +
                  projectEnd.end_date.date()}`,
                display: "grid",
                gridTemplateColumns: `repeat(${projectEventDuration} , var(--gridSize))`,
                gridTemplateRows: "var(--gridSize)",
              }}
              key={projectName}>
              {projectData.map((event: any, i: number) => {
                return (
                  <div
                    key={event.engagement_id}
                    className={`month-event-item ${hoveredEvent === event.engagement_id ? "hovered" : ""}`}
                    style={{
                      height: "100%",
                      backgroundColor: event.color,
                      // TODO: Change to event start date + event duration
                      gridColumn: `${1 + Math.abs(projectStart.start_date.date() - event.start_date.date())} /  ${2 +
                        event.end_date.date() -
                        projectStart.start_date.date()}`,
                      gridRow: 1,
                      zIndex: 100 - event.end_date.date() + event.start_date.date(),
                    }}
                    title={event.title}
                    onMouseEnter={() => setHoveredEvent(event.engagement_id)}
                    onMouseLeave={() => setHoveredEvent(null)}>
                    {projectName}
                  </div>
                );
              })}
              <span
                style={{
                  gridColumn: "1 / -1",
                  backgroundColor: "transparent",
                  zIndex: 101,
                  gridRow: 1,
                  pointerEvents: "none",
                  opacity: 0,
                }}>
                {projectName}
              </span>
            </span>
          );
        }
      })}
    </div>
  );
};

export default Month;
