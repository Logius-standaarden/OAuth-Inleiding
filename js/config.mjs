import { loadRespecWithConfiguration } from "https://logius-standaarden.github.io/publicatie/respec/organisation-config.mjs";

loadRespecWithConfiguration({
  useLogo: true,
  useLabel: true,
  // license: "cc0",
  specStatus: "WV",
  specType: "PR",
  pubDomain: "api",
  shortName: "oauth-inleiding",
  publishDate: "2024-11-16",
  publishVersion: "0.1.0",
  // previousPublishVersion: "(none)",
  editors:
    [
      {
        name: "Logius Standaarden",
        company: "Logius",
        companyURL: "https://logius.nl",
      }
    ],
  authors:
    [
      {
        name: "Martin van der Plas",
        company: "Logius",
        companyURL: "https://logius.nl",
      }
    ],
  github: "https://github.com/Logius-standaarden/OAuth-Inleiding",


  // Create PDF and link to file in header (optional):
  alternateFormats: [
      {
          label: "pdf",
          uri: "OAuth-Inleiding.pdf",
      },
  ],
});
