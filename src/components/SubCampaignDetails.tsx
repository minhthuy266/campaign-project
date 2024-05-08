import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { ErrorForm, SubCampaign } from "../interface";
import * as constants from "../utils/constants";

interface SubCampaignDetailsProps {
  subCampaign: SubCampaign;
  activeCard: boolean;
  subCampaignIndex: number;
  onNameChange: (value: string) => void;
  onStatusChange: (value: boolean) => void;
  onAddAd: () => void;
  onAdNameChange: (adIndex: number, value: string) => void;
  onAdQuantityChange: (adIndex: number, value: number) => void;
  onRemoveAd: (adIndex: number) => void;
  handleRemoveSelectedAds: (selectedAdIndexes: number[]) => void;
  errors: ErrorForm;
}

const SubCampaignDetails: React.FC<SubCampaignDetailsProps> = ({
  subCampaign,
  activeCard,
  onNameChange,
  onStatusChange,
  onAddAd,
  onAdNameChange,
  onAdQuantityChange,
  onRemoveAd,
  handleRemoveSelectedAds,
  errors,
  subCampaignIndex
}) => {
  const [selectedAdIndexes, setSelectedAdIndexes] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedAdIndexes(
      checked ? subCampaign.ads.map((_, index) => index) : []
    );
  };

  const handleSelectAd = (index: number) => {
    setSelectedAdIndexes((prevSelectedAdIndexes) => {
      const newSelectedAdIndexes = prevSelectedAdIndexes.includes(index)
        ? prevSelectedAdIndexes.filter((adIndex) => adIndex !== index)
        : [...prevSelectedAdIndexes, index];
      setSelectAll(newSelectedAdIndexes.length === subCampaign.ads.length);
      return newSelectedAdIndexes;
    });
  };

  return (
    <div>
      {activeCard && (
        <Grid container spacing={2}>
          <Grid xs={8}>
            <TextField
              label="Tên chiến dịch con"
              value={subCampaign.name}
              onChange={(e) => onNameChange(e.target.value)}
              required
              variant="standard"
              fullWidth
              error={errors.subCampaignName.includes(subCampaignIndex)}
              helperText={
                errors.subCampaignName.includes(subCampaignIndex) &&
                constants.SUB_CAMPAIGN_NAME_VALIDATION
              }
            />
          </Grid>
          <Grid xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={subCampaign.status}
                  onChange={(e) => onStatusChange(e.target.checked)}
                />
              }
              label="Đang hoạt động"
            />
          </Grid>

          <Typography
            variant="h6"
            style={{ marginTop: "32px", marginBottom: "16px" }}
          >
            DANH SÁCH QUẢNG CÁO
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={60}>
                    <Checkbox
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      indeterminate={
                        selectedAdIndexes.length > 0 &&
                        selectedAdIndexes.length < subCampaign.ads.length
                      }
                      disabled={subCampaign.ads.length === 0}
                    />
                  </TableCell>
                  {selectedAdIndexes.length > 0 ? (
                    <TableCell>
                      <Button
                        onClick={() => {
                          handleRemoveSelectedAds(selectedAdIndexes);
                          setSelectedAdIndexes([]);
                          setSelectAll(false);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell>Tên quảng cáo *</TableCell>
                      <TableCell width="50%">Số lượng *</TableCell>
                      <TableCell align="right" width={120}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => {
                            onAddAd();
                          }}
                        >
                          Thêm
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {subCampaign.ads.map((ad, adIndex) => (
                  <TableRow
                    key={adIndex}
                    selected={selectedAdIndexes.includes(adIndex)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedAdIndexes.includes(adIndex)}
                        onChange={() => handleSelectAd(adIndex)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        label="Tên quảng cáo"
                        value={ad.name}
                        required
                        onChange={(e) => {
                          onAdNameChange(adIndex, e.target.value);
                        }}
                        error={
                          !!errors.adNames.find(
                            (error) => error.index === adIndex
                          )
                        }
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        fullWidth
                        label="Số lượng"
                        type="number"
                        value={ad.quantity}
                        required
                        onChange={(e) =>
                          onAdQuantityChange(adIndex, parseInt(e.target.value))
                        }
                        error={
                          !!errors.adQuantities.find(
                            (error) => error.index === adIndex
                          )
                        }
                        variant="standard"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => {
                          onRemoveAd(adIndex);
                        }}
                        disabled={selectedAdIndexes.includes(adIndex)}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
    </div>
  );
};

export default SubCampaignDetails;
