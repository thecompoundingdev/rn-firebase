const { http } = require('./request');
const configs = require('../configs/endpoints');

exports.getDynamicLinks = async () => {
  const res = await http.post(
    configs.dynamicLinksRestEndpoint,
    {
      dynamicLinkInfo: {
        domainUriPrefix: configs.domainUriPrefix,
        // not sure what to enter here for "link"
        link: configs.domainUriPrefix,
        androidInfo: {
          androidPackageName: process.env.ANDROID_PACKAGE_NAME,
        },
      },
    },
    { params: { key: configs.clientApiKey } }
  );

  return res.data;
};
