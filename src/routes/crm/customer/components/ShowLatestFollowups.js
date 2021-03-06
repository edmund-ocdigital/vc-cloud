import React from "react";
import { Info } from "Components/Layout/ProfileCard";
import { Call, Mail } from "@material-ui/icons";
import moment from "moment";
import { getDateTime } from "Helpers/helpers";

function ShowLatestFollowUps({ followUps }) {
  const filteredFollowups = followUps.filter(followup => {
    moment().isAfter(followup.date)}
  );
  const showInfo =
    filteredFollowups.length > 0 ? (
      filteredFollowups
        .slice(0, 3)
        .map((followup, key) => (
          <Info
            key={key}
            icon={
             ( followup.hasOwnProperty('type') && followup.type.name) == "email" ? (
                <Mail fontSize="small" />
              ) : (
                <Call fontSize="small" />
              )
            }
            title={followup.result.name}
            subtitle={getDateTime(followup.date)}
          />
        ))
    ) : (
      <p className="text-center text-muted">No Follow Up Logged</p>
    );
  return showInfo;
}

export default ShowLatestFollowUps;
