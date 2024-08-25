import { SiteInfo } from '@/common/models/siteInfo';

import { siteInfos } from './siteInfoData';

const seedSiteInfos = async () => {
  try {
    console.log('Seeding Site Infos...');

    await Promise.all(
      siteInfos.map(async (siteInfo) => {
        await SiteInfo.findOneAndUpdate(
          { siteName: siteInfo.siteName },
          { ...siteInfo },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      })
    );

    console.log('Site Infos seeded!');
  } catch (err) {
    console.log('Error seeding Site Infos:', err);
    throw new Error('Something went wrong while seeding Site Infos');
  }
};

export default seedSiteInfos;
