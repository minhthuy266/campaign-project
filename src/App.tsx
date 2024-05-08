import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Grid, Tab } from "@mui/material";
import React, { useEffect, useState } from "react";
import CampaignInformation from "./components/CampaignInformation";
import SubCampaignDetails from "./components/SubCampaignDetails";
import SubCampaignsList from "./components/SubCampaignList";
import { Ad, Campaign, ErrorForm, SubCampaign } from "./interface";
import * as constants from "./utils/constants";

const App: React.FC = () => {
  const [campaign, setCampaign] = useState<Campaign>({
    information: {
      name: "",
      describe: "",
    },
    subCampaigns: [
      {
        name: "Chiến dịch con 1",
        status: true,
        ads: [{ name: "Quảng cáo 1", quantity: 0 }],
      },
    ],
  });
  const [isClickSubmit, setIsClickSubmit] = useState(false);
  const [value, setValue] = useState("1");
  const [activeCard, setActiveCard] = useState(0);
  const [errors, setErrors] = useState<ErrorForm>({
    campaignName: "",
    adNames: [],
    subCampaignName: [],
    adQuantities: [],
  });
  // Event handlers

  // Function to handle tab change
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Function to add a new sub-campaign
  const handleAddSubCampaign = () => {
    const newSubCampaign: SubCampaign = {
      name: `Chiến dịch con ${campaign.subCampaigns.length + 1}`,
      status: true,
      ads: [{ name: "Quảng cáo 1", quantity: 0 }],
    };
    setCampaign({
      ...campaign,
      subCampaigns: [...campaign.subCampaigns, newSubCampaign],
    });
    setActiveCard(campaign.subCampaigns.length);
  };

  // Function to handle removing selected ads from a sub-campaign
  const handleRemoveSelectedAds = (
    subCampaignIndex: number,
    selectedAdIndexes: number[]
  ) => {
    setCampaign({
      ...campaign,
      subCampaigns: campaign.subCampaigns.map((subCampaign, index) =>
        index === subCampaignIndex
          ? {
              ...subCampaign,
              ads: subCampaign.ads.filter(
                (_, adIndex) => !selectedAdIndexes.includes(adIndex)
              ),
            }
          : subCampaign
      ),
    });
  };

  // Function to update sub-campaigns
  const updateSubCampaigns = (newSubCampaigns: SubCampaign[]) => {
    setCampaign({ ...campaign, subCampaigns: newSubCampaigns });
  };

  // Function to get errors for a specific sub-campaign
  const getSubCampaignErrors = (index: number) => {
    return {
      ...errors,
      subCampaign: errors.subCampaignName.filter((error) => error === index),
      adNames: errors.adNames.filter(
        (error) => error.subCampaignIndex === index
      ),
      adQuantities: errors.adQuantities.filter(
        (error) => error.subCampaignIndex === index
      ),
    };
  };

  // Function to handle name change for a sub-campaign
  const handleSubCampaignNameChange = (index: number, value: string) => {
    updateSubCampaigns(
      campaign.subCampaigns.map((sc, idx) =>
        idx === index ? { ...sc, name: value } : sc
      )
    );
  };

  // Function to handle status change for a sub-campaign
  const handleSubCampaignStatusChange = (index: number, value: boolean) => {
    updateSubCampaigns(
      campaign.subCampaigns.map((sc, idx) =>
        idx === index ? { ...sc, status: value } : sc
      )
    );
  };

  // Function to add an ad to a sub-campaign
  const handleAddAdToSubCampaign = (index: number) => {
    const newAd: Ad = {
      name: `Quảng cáo ${campaign.subCampaigns[index].ads.length + 1}`,
      quantity: 0,
    };
    updateSubCampaigns(
      campaign.subCampaigns.map((sc, idx) =>
        idx === index ? { ...sc, ads: [...sc.ads, newAd] } : sc
      )
    );
  };

  // Function to remove an ad from a sub-campaign
  const handleRemoveAdFromSubCampaign = (
    subCampaignIndex: number,
    adIndex: number
  ) => {
    updateSubCampaigns(
      campaign.subCampaigns.map((sc, idx) =>
        idx === subCampaignIndex
          ? { ...sc, ads: sc.ads.filter((_ad, aIdx) => aIdx !== adIndex) }
          : sc
      )
    );
  };

  // Function to handle ad name change for a sub-campaign
  const handleAdNameChange = (
    subCampaignIndex: number,
    adIndex: number,
    value: string
  ) => {
    updateSubCampaigns(
      campaign.subCampaigns.map((sc, idx) =>
        idx === subCampaignIndex
          ? {
              ...sc,
              ads: sc.ads.map((ad, aIdx) =>
                aIdx === adIndex ? { ...ad, name: value } : ad
              ),
            }
          : sc
      )
    );
  };

  // Function to handle ad quantity change for a sub-campaign
  const handleAdQuantityChange = (
    subCampaignIndex: number,
    adIndex: number,
    value: number
  ) => {
    updateSubCampaigns(
      campaign.subCampaigns.map((sc, idx) =>
        idx === subCampaignIndex
          ? {
              ...sc,
              ads: sc.ads.map((ad, aIdx) =>
                aIdx === adIndex ? { ...ad, quantity: value } : ad
              ),
            }
          : sc
      )
    );
  };

  // Function to handle form submission
  const handleSubmit = () => {
    setIsClickSubmit(true);
    if (!validateForm()) {
      alert(constants.FAIL_VALIDATION);
    } else {
      alert(constants.SUCCESS_VALIDATION + JSON.stringify({ campaign }));
    }
  };

  // Function to validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors: ErrorForm = {
      campaignName: "",
      subCampaignName: [],
      adNames: [],
      adQuantities: [],
    };

    if (!campaign.information.name.trim()) {
      newErrors.campaignName =  constants.CAMPAIGN_NAME_VALIDATION;
      isValid = false;
    }

    campaign.subCampaigns.forEach((subCampaign, index) => {
      if (subCampaign.ads.length === 0) {
        isValid = false;
      }
      if (subCampaign.name.trim() === "") {
        newErrors.subCampaignName.push(index);
        isValid = false;
      }
      subCampaign.ads.forEach((ad, adIndex) => {
        if (ad.name.trim() === "") {
          newErrors.adNames.push({
            index: adIndex,
            subCampaignIndex: index,
          });
          isValid = false;
        }

        if (
          ad.quantity <= 0 ||
          ad.quantity === null ||
          Number.isNaN(ad.quantity)
        ) {
          newErrors.adQuantities.push({
            index: adIndex,
            subCampaignIndex: index,
          });
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    if (isClickSubmit) {
      validateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign, isClickSubmit]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <Grid
        container
        spacing={2}
        xs={12}
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingBottom: "16px",
        }}
      >
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Grid>
      <Box
        sx={{ width: "100%", typography: "body1" }}
        style={{ border: "1px solid rgb(224, 224, 224)", padding: "24px" }}
      >
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="THÔNG TIN" value="1" />
            <Tab label="CHIẾN DỊCH CON" value="2" />
          </TabList>
          <TabPanel value="1">
            <CampaignInformation
              name={campaign.information.name}
              describe={campaign.information.describe || ""}
              errors={errors}
              onNameChange={(value) =>
                setCampaign({
                  ...campaign,
                  information: { ...campaign.information, name: value },
                })
              }
              onDescriptionChange={(value) =>
                setCampaign({
                  ...campaign,
                  information: { ...campaign.information, describe: value },
                })
              }
            />
          </TabPanel>
          <TabPanel value="2">
            <SubCampaignsList
              subCampaigns={campaign.subCampaigns}
              onSubCampaignClick={(index) => setActiveCard(index)}
              handleAddSubCampaign={handleAddSubCampaign}
              errors={errors}
              activeCard={activeCard}
              isClickSubmit={isClickSubmit}
            />
            {campaign.subCampaigns.map((subCampaign, index) => (
              <SubCampaignDetails
                key={index}
                subCampaignIndex={index}
                subCampaign={subCampaign}
                activeCard={activeCard === index}
                errors={getSubCampaignErrors(index)}
                handleRemoveSelectedAds={(selectedAdIndexes) =>
                  handleRemoveSelectedAds(index, selectedAdIndexes)
                }
                onNameChange={(value) =>
                  handleSubCampaignNameChange(index, value)
                }
                onStatusChange={(value) =>
                  handleSubCampaignStatusChange(index, value)
                }
                onAddAd={() => handleAddAdToSubCampaign(index)}
                onRemoveAd={(adIndex) =>
                  handleRemoveAdFromSubCampaign(index, adIndex)
                }
                onAdNameChange={(adIndex, value) =>
                  handleAdNameChange(index, adIndex, value)
                }
                onAdQuantityChange={(adIndex, value) =>
                  handleAdQuantityChange(index, adIndex, value)
                }
              />
            ))}
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default App;
