import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import { ErrorForm, ErrorMessages, SubCampaign } from '../interface';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface SubCampaignsListProps {
  subCampaigns: SubCampaign[];
  onSubCampaignClick: (index: number) => void;
  handleAddSubCampaign: () => void;
  errors: ErrorForm;
  activeCard: number;
  isClickSubmit: boolean;
}

const useStyles = makeStyles({
  borderedButton: {
    borderRadius: '50%',
    height: '50px',
    width: '50px',
    padding: '10px',
    minWidth: 'auto',
    backgroundColor: 'rgb(237, 237, 237)',
    color: 'red',
    '&:hover': {
      backgroundColor: 'rgb(237, 237, 237)',
    },
  },
  customGrid: {
    width: '100%',
    overflowX: 'auto',
    flexWrap: 'nowrap',
    marginBottom: '32px',
  },
  subCampaignName: {
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    display: '-webkit-box',
    width: '180px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  subCampaignNameError: {
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    display: '-webkit-box',
    width: '180px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: 'red',
  },
  card: {
    border: '2px solid grey',
    width: '210px',
    height: '160px',
    marginLeft: '16px',
    cursor: 'pointer',
    '&.active': {
      border: '2px solid rgb(33, 150, 243)',
    },
  },
  checkCircleIcon: {
    marginLeft: '8px',
    fontSize: '14px',
  },
  checkCircleIconActive: {
    color: 'green',
  },
  checkCircleIconInactive: {
    color: 'grey',
  },
});

const SubCampaignsList: React.FC<SubCampaignsListProps> = ({
  subCampaigns,
  onSubCampaignClick,
  handleAddSubCampaign,
  errors,
  activeCard,
  isClickSubmit
}) => {
  const classes = useStyles();

  const checkAdsLength = (subCampaigns: SubCampaign[]) => {
    return subCampaigns.map((subCampaign) => {
      if (subCampaign.ads.length === 0 && isClickSubmit) {
        return true;
      }
      return false;
    });
  };

  const getSubCampaignNameClass = (index: number) => {
    const hasError =
      errors.adQuantities
        .map((item: ErrorMessages) => item.subCampaignIndex)
        .includes(index) ||
      errors.adNames
        .map((item: ErrorMessages) => item.subCampaignIndex)
        .includes(index) ||
      checkAdsLength(subCampaigns)[index]
      || errors.subCampaignName.includes(index)

    return hasError ? classes.subCampaignNameError : classes.subCampaignName;
  };

  return (
    <>
      <Grid container spacing={2} className={classes.customGrid}>
        <Box style={{ margin: "16px" }}>
          <Button
            className={classes.borderedButton}
            variant="contained"
            color="info"
            onClick={handleAddSubCampaign}
          >
            <AddIcon />
          </Button>
        </Box>

        {subCampaigns.map((subCampaign, index) => (
          <Grid key={index} item>
            <Card
              variant="outlined"
              onClick={() => onSubCampaignClick(index)}
              className={`${classes.card} ${
                activeCard === index ? "active" : ""
              }`}
            >
              <CardContent>
                <Tooltip arrow title={subCampaign.name} placement="left-start">
                  <div style={{ display: "flex", alignItems: "start" }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      className={getSubCampaignNameClass(index)}
                    >
                      {subCampaign.name}
                    </Typography>
                    <div>
                      <CheckCircleIcon
                        className={
                          subCampaign.status
                            ? `${classes.checkCircleIcon} ${classes.checkCircleIconActive}`
                            : `${classes.checkCircleIcon} ${classes.checkCircleIconInactive}`
                        }
                      />
                    </div>
                  </div>
                </Tooltip>
                <Tooltip arrow title="Số lượng" placement="left-start">
                  <div>
                    {subCampaign.ads.reduce(
                      (acc, ad) => acc + (ad.quantity ? ad.quantity : 0),
                      0
                    ) ?? 0}
                  </div>
                </Tooltip>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default SubCampaignsList;
