import type { Token } from './token';
import type { Project } from './project';
import type { AirdropCampaign } from './airdrop';
import type { Presale, FairLaunch } from './launchpad';
import type { StakingPool } from './staking';
import type { PartnerItem } from './partner';

export interface ProjectRelationships {
  project: Project;
  tokens: Token[];
  airdrops: AirdropCampaign[];
  presales: Presale[];
  fairLaunches: FairLaunch[];
  stakingPools: StakingPool[];
  partners: PartnerItem[];
}

export interface TokenRelationships {
  token: Token;
  project?: Project | null;
  airdrops: AirdropCampaign[];
  presales: Presale[];
  fairLaunches: FairLaunch[];
  stakingPools: StakingPool[];
  partners: PartnerItem[];
  isEcosystem: boolean;
  isExternal: boolean;
}

export interface AirdropRelationships {
  airdrop: AirdropCampaign;
  project?: Project | null;
  token?: Token | null;
}

export interface LaunchpadRelationships {
  item: Presale | FairLaunch;
  kind: 'presale' | 'fair-launch';
  project?: Project | null;
  token?: Token | null;
}

export interface StakingRelationships {
  pool: StakingPool;
  project?: Project | null;
  token?: Token | null;
}

export interface PartnerRelationships {
  partner: PartnerItem;
  projects: Project[];
  tokens: Token[];
}

export interface CrossEcosystemSearchResult {
  tokens: Token[];
  projects: Project[];
  airdrops: AirdropCampaign[];
  presales: Presale[];
  fairLaunches: FairLaunch[];
  stakingPools: StakingPool[];
  partners: PartnerItem[];
}

