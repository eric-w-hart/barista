module.exports = {
  title: 'Barista',
  tagline: 'open source license and vulnerability management',
  url: 'https://optum.github.io/barista',
  baseUrl: '/barista/',
  favicon: 'img/barista-icon.ico',
  organizationName: 'Optum', // Usually your GitHub org/user name.
  projectName: 'barista', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Barista Docs',
      logo: {
        alt: 'Barista logo',
        src: 'img/barista.png',
      },
      links: [
        {to: 'docs/overview', label: 'Docs', position: 'left'},
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Overview',
              to: 'docs/overview',
            },
            {
              label: 'Local Dev Environment Setup',
              to: 'docs/local-dev-environment',
            },
            {
              label: 'System Architecture',
              to: 'docs/architecture',
            },
            {
              label: 'License Scanners',
              to: 'docs/license-scanners',
            },
            {
              label: 'How to Develop a Web Feature',
              to: 'docs/how-to-develop-a-feature',
            },
            {
              label: 'Building and Running Barista Using Docker',
              to: 'docs/barista-on-docker',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/Optum/barista/issues',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Optum/barista',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Optum, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
