import fetchURL from "../../utils/fetchURL";
import { SimpleAdapter } from "../../adapters/types";
import { CHAIN } from "../../helpers/chains";

const thalaDappURL = "https://app.thala.fi/";
const feesQueryURL = `${thalaDappURL}/api/defillama/trading-fee-chart?`;

const DAY_SECONDS = 86400;

const PROTOCOL_REVENUE_RATIO = 0.0001;

const feesEndpoint = (timestamp: number) =>
  feesQueryURL + `timestamp=${timestamp}`;

interface IVolumeall {
  value: number;
  timestamp: string;
}

const fetch = async (timestamp: number) => {
  const dayFeesQuery = (await fetchURL(feesEndpoint(timestamp - DAY_SECONDS)))
    ?.data;
  const dailyFees = dayFeesQuery.reduce(
    (partialSum: number, a: IVolumeall) => partialSum + a.value,
    0
  );

  const totalFeesQuery = (await fetchURL(feesEndpoint(timestamp)))?.data;
  const totalFees = totalFeesQuery.reduce(
    (partialSum: number, a: IVolumeall) => partialSum + a.value,
    0
  );

  return {
    totalFees: `${totalFees}`,
    dailyFees: `${dailyFees}`,
    totalProtocolRevenue: `${totalFees}`,
    dailyProtocolRevenue: `${dailyFees}`,
    dailyRevenue: `${dailyFees}`,
    timestamp,
  };
};

const adapter: SimpleAdapter = {
  adapter: {
    [CHAIN.APTOS]: {
      fetch,
      start: 1680652406,
    },
  },
};

export default adapter;
