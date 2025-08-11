import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";

const ScheduleDownloadLink = ({
  docProps,
  fileName,
  colour = false,
  label,
  onHover,
}) => {
  return (
    <PDFDownloadLink
      document={<MyDocument {...docProps} colour={colour} />}
      fileName={fileName}
    >
      {({ loading }) =>
        loading ? (
          "Loading document..."
        ) : (
          <span onMouseOver={onHover}>{label}</span>
        )
      }
    </PDFDownloadLink>
  );
};

export default ScheduleDownloadLink;
