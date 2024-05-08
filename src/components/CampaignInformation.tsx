import React from "react";
import { TextField } from "@mui/material";
import { ErrorForm } from "../interface";

interface CampaignInformationProps {
  name: string;
  describe: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  errors: ErrorForm;
}

const CampaignInformation: React.FC<CampaignInformationProps> = ({
  name,
  describe,
  onNameChange,
  onDescriptionChange,
  errors,
}) => {
  return (
    <div>
      <TextField
        label="Tên chiến dịch"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        required
        error={errors.campaignName !== ""}
        helperText={errors.campaignName}
        variant="standard"
        fullWidth
      />
      <TextField
        label="Mô tả"
        value={describe}
        onChange={(e) => onDescriptionChange(e.target.value)}
        variant="standard"
        fullWidth
      />
    </div>
  );
};

export default CampaignInformation;
