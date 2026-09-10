import { indexOfficialBahyaSources } from "../server/rag";

async function main() {
  const indexed = await indexOfficialBahyaSources();
  console.log(JSON.stringify(indexed));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
