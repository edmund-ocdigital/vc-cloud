import React from "react";
import { connect } from "react-redux";

import { Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { NavigateBefore, NavigateNext } from "@material-ui/icons";

const CalendarToolbar = toolbar => {
  const goToToday = () => {
    toolbar.onNavigate("TODAY");
  };
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };
  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const viewMonth = () => {
    toolbar.onViewChange("month");
  };

  const viewWeek = () => {
    toolbar.onViewChange("week");
  };

  const viewDay = () => {
    toolbar.onViewChange("day");
  };

  return (
    <React.Fragment>
      <div className="toolbar-container mb-10">
        <div className="row justify-content-between align-content-center">
          <div className="col-md-4 text-left">
            <div>
              <Button variant="outlined" onClick={viewMonth}>
                Month
              </Button>
              <Button variant="outlined" onClick={viewWeek}>
                Week
              </Button>
              <Button variant="outlined" onClick={viewDay}>
                Day
              </Button>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex justify-content-center align-items-center">
              <IconButton
                size="small"
                className="text-muted"
                disableRipple
                onClick={goToBack}
              >
                <NavigateBefore />
              </IconButton>
              <h2
                className="mb-0 mx-20 text-center"
                style={{ minWidth: "30%" }}
              >
                {toolbar.label}
              </h2>
              <IconButton
                size="small"
                className="text-muted"
                disableRipple
                onClick={goToNext}
              >
                <NavigateNext />
              </IconButton>
            </div>
          </div>
          <div className="col-md-4 text-right">
            <div>
              <Button variant="outlined" onClick={goToToday}>
                Today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default connect(null)(CalendarToolbar);