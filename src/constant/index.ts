const headerHostNname = process.env.NEXT_HOST_NAME || "test.funnelliner.store";
// https://giftvaly.com/
// https://fldemo.xyz/
// bestbabybd.com
// fldemo.online
const hostDomain = "localhost:3000";
const NEXT_REVALIDATE_TIME = 300;
const themeCode = {
  theme_1: 201,
  theme_2: 202,
};

const BASE_URL_VISITOR = "https://funnelliner-report-api.vercel.app/api/v1/";

export {
  headerHostNname,
  BASE_URL_VISITOR,
  hostDomain,
  themeCode,
  NEXT_REVALIDATE_TIME,
};

// funnel-liner-custom-domain-staging-funnel.vercel.app\
// fldemo.xyz
