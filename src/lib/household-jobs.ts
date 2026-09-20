import type { Job } from "@/data/jobs";
import { jobs } from "@/data/jobs";
import type { Profile } from "@/data/profile";
import { householdMarket, type HouseholdMarketAdult } from "@/lib/household-market";

export type HouseholdJobGroup = {
  adult: HouseholdMarketAdult;
  jobs: Job[];
};

export type HouseholdJobs = {
  groups: HouseholdJobGroup[];
  totalCount: number;
  intlCount: number;
};

export function householdJobs(profile: Profile, options?: { intlOnly?: boolean }): HouseholdJobs {
  const market = householdMarket(profile);
  const intlOnly = Boolean(options?.intlOnly);
  const groups = market.adults.map((adult) => {
    const matched = jobs.filter((job) => {
      if (job.profession !== adult.member.profession) return false;
      if (intlOnly && !job.intl) return false;
      return true;
    });
    return { adult, jobs: matched };
  });
  const listed = groups.flatMap((group) => group.jobs);
  return {
    groups,
    totalCount: listed.length,
    intlCount: listed.filter((job) => job.intl).length,
  };
}

