export interface Ad {
  name: string;
  quantity: number;
}

export interface SubCampaign {
  name: string;
  status: boolean;
  ads: Ad[];
}

export interface Campaign {
  information: {
    name: string;
    describe?: string;
  };
  subCampaigns: SubCampaign[];
}

export interface ErrorMessages {
  index: number;
  subCampaignIndex: number;
}

export interface ErrorForm {
  campaignName: string;
  subCampaignName: number[];
  adNames: ErrorMessages[];
  adQuantities: ErrorMessages[];
}
