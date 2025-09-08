import { loadRespecWithConfiguration } from "https://logius-standaarden.github.io/publicatie/respec/organisation-config.mjs";

loadRespecWithConfiguration({
  useLogo: true,
  useLabel: true,
  specStatus: "WV",
  specType: "PR",
  pubDomain: "api",
  shortName: "oauth-inleiding",
  publishDate: "2024-11-16",
  publishVersion: "0.1.0",
  prevVersion: [],
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
});
