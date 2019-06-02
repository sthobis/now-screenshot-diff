const { withUiHook, htm } = require("@zeit/integration-utils");

const compareImages = deployments => {
  const diffUrl = `https://screenshot-diff.now.sh/?url=https://${
    deployments[0].url
  },https://${deployments[1].url}`;
  return htm`
    <Box
      width="300px"
      height="300px"
      border="1px solid rgb(234,234,234)"
      borderRadius="5px"
      padding="9px"
      marginRight="20px"
      display="flex"
      flexDirection="column"
    >
      Screenshot Diff
      <Link href=${diffUrl} target="_blank">
        <Box
          display="inline-block"
          width="100%"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
        >
          ${diffUrl}
        </Box>
      </Link>
      <Box
        flexGrow="1"
        flexShrink="1"
        width="280px"
        height="100%"
        overflow="hidden"
      >
        <Link
          href=${diffUrl}
          target="_blank"
        >
          <Img
            width="280"
            height="auto"
            src=${diffUrl}
          />
        </Link>
      </Box>
    </Box>
  `;
};

module.exports = withUiHook(async ({ payload, zeitClient }) => {
  const projects = await zeitClient.fetchAndThrow("/v1/projects/list", {
    method: "GET"
  });

  const projectsDeployments = await Promise.all(
    projects.map(project =>
      zeitClient.fetchAndThrow(
        `/v4/now/deployments?projectId=${project.id}&limit=2`,
        {
          method: "GET"
        }
      )
    )
  );

  const projectId = false;

  return htm`
		<Page>
			<H1>Latest deployments on this ${projectId ? "project" : "account"}</H1>
      ${projectsDeployments.map(({ deployments }, projectIndex) => {
        return htm`
          <Box
            margin="20px 0"
            padding="20px"
            border="1px solid rgb(234,234,234)"
            borderRadius="5px"
            background="#ffffff"
          >
            <H2>${projects[projectIndex].name}</H2>
            <Box
              display="flex"
            >
              ${deployments.map(
                (deployment, deploymentIndex) => htm`
                <Box
                  width="300px"
                  height="300px"
                  border="1px solid rgb(234,234,234)"
                  borderRadius="5px"
                  padding="9px"
                  marginRight="20px"
                  display="flex"
                  flexDirection="column"
                >
                  ${
                    deploymentIndex === 0
                      ? "Latest deployment"
                      : "Previous deployment"
                  }
                  <Link href=${`https://${deployment.url}`} target="_blank">
                    <Box
                      display="inline-block"
                      width="100%"
                      textOverflow="ellipsis"
                      overflow="hidden"
                      whiteSpace="nowrap"
                    >
                      ${`https://${deployment.url}`}
                    </Box>
                  </Link>
                  <Box
                    flexGrow="1"
                    flexShrink="1"
                    width="280px"
                    height="100%"
                    overflow="hidden"
                  >
                    <Link
                      href=${`https://puppeteer-screenshot-sthobis.now.sh/${
                        deployment.url
                      }`}
                      target="_blank"
                    >
                      <Img
                        width="280"
                        height="auto"
                        src=${`https://puppeteer-screenshot-sthobis.now.sh/${
                          deployment.url
                        }`}
                      />
                    </Link>
                  </Box>
                </Box>
              `
              )}
              ${deployments.length === 2 ? compareImages(deployments) : ""}
            </Box>
          </Box>
        `;
      })}
		</Page>
	`;
});
