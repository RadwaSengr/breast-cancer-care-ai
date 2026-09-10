import { indexTrustedPdfFromUrl } from "../server/rag";

const sourceUrl = "https://www.cancer.gov/publications/patient-education/life-after-treatment.pdf";

async function main() {
  const result = await indexTrustedPdfFromUrl({
    title: "Facing Forward: Life After Cancer Treatment",
    organization: "National Cancer Institute",
    sourceUrl,
  });

  console.log(JSON.stringify(result));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
