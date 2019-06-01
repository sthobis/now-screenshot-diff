const { withUiHook, htm } = require("@zeit/integration-utils");

module.exports = withUiHook(async ({ payload, zeitClient }) => {
  const { projectId } = payload;
  let apiUrl = `/v4/now/deployments?limit=3`;
  if (projectId) {
    apiUrl += `&projectId=${projectId}`;
  }

  const { deployments } = await zeitClient.fetchAndThrow(apiUrl, {
    method: "GET"
  });
  return htm`
		<Page>
			<H1>Latest deployments on this ${projectId ? "project" : "account"}</H1>
			<UL>
        ${deployments.map(
          d => htm`
          <LI>
            <H2>${d.name}</H2>
            <Link href=${`https://${d.url}`} target="_blank">
              <Box display="inline-block">
                <P>https://${d.url}</P>
              </Box>
            </Link>
            <Box
              width="300px"
              height="300px"
              border="1px solid #ccc"
              borderRadius="5px"
              padding="9px"
              >
              <Link href=${`https://puppeteer-screenshot.sthobis.now.sh/${
                d.url
              }?fullPage=true`} target="_blank">
                <Box
                  width="280px"
                  height="280px"
                  overflow="hidden"
                >
                  <Img
                    width="280"
                    height="auto"
                    src=${`https://puppeteer-screenshot.sthobis.now.sh/${
                      d.url
                    }?fullPage=true`}
                  />
                </Box>
              </Link>
            </Box>
          </LI>
        `
        )}
			</UL>
		</Page>
	`;
});
