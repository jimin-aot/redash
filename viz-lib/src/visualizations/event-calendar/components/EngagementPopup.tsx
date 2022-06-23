import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import "./EngagementPopup.css";

export const EngagementPopup = ({ event, togglePopup }: any) => {
  return (
    <div className="popup">
      <div className="popup-mask" onClick={togglePopup} />
      <div className="popup-container">
        <div className="popup-header">
          <h3>{event?.title}</h3>
          <CloseOutlined onClick={togglePopup} />
        </div>
        <div className="popup-body">
          <table className="table table-striped table-bordered ">
            <tbody>
              {event.start_date && (
                <tr>
                  <th>Start Date</th>
                  <td>{event.start_date.format("MMM DD, YYYY")}</td>
                </tr>
              )}
              {event.end_date && (
                <tr>
                  <th>End Date</th>
                  <td>{event.end_date.format("MMM DD, YYYY")}</td>
                </tr>
              )}
              {event.project && (
                <tr>
                  <th>Project</th>
                  <td>{event?.project}</td>
                </tr>
              )}
              {event.project_description && (
                <tr>
                  <th>Description</th>
                  <td>{event?.project_description}</td>
                </tr>
              )}
              {event.project_address && (
                <tr>
                  <th>Address</th>
                  <td> {event?.project_address}</td>
                </tr>
              )}
              {event.phase && (
                <tr>
                  <th>Phase</th>
                  <td>{event?.phase}</td>
                </tr>
              )}
              {event.staff && (
                <tr>
                  <th>Staff</th>
                  <td>{`${event?.staff || ""}(${event?.staff_email || ""})`}</td>
                </tr>
              )}
              {event.status && (
                <tr>
                  <th>Status</th>
                  <td>{event?.status}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
