import React, { FC } from "react";
import { Alert } from "@mui/material";

interface MessageBoxProps {
  warnings: string[];
}

export const MessageBox: FC<MessageBoxProps> = ({ warnings }) => {
  if (warnings.length > 0) {
    return (
      <Alert severity="warning">
        Please change your comment before submitting.
        {warnings.map((warning) => {
          return (
            <Alert
              key={warning}
              severity="error"
              style={{
                width: "80%",
                marginTop: 10,
                border: "1px solid #ef5350",
              }}
            >
              Your message is {warning}
            </Alert>
          );
        })}
      </Alert>
    );
  } else {
    return <Alert severity="success">Thank you for your comment!</Alert>;
  }
};
