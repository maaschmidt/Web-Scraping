import { getPagesInfos } from "../getPagesInfos";

const baseURL = 'https://www.olx.com.br/imoveis/aluguel/estado-rs/regioes-de-porto-alegre-torres-e-santa-cruz-do-sul/outras-cidades?gsp=1&sd=4354&sd=4310';

(async () => {
  const pages = await getPagesInfos.getUrl(baseURL);

  for (let i = 0; i < pages.length; i++) {
    const infos = await getPagesInfos.getHomeInfo(pages[i])
    console.log(infos);
  }
  
})()
