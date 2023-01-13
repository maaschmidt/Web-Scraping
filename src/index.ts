import { getInfos } from "../getInfos";

const baseURL = "https://www.webmotors.com.br/carros/estoque/de.2010?tipoveiculo=carros&anode=2010&media=com%20fotos&precoate=35000&precode=20000&cambio=Autom%C3%A1tica%7CManual&opcionais=Ar%20condicionado&combustivel=Gasolina%7CGasolina%20e%20%C3%A1lcool";

(async () => {
  // const pages = await getInfos.getUrl(baseURL)

  // for (let i = 0; i < pages.length; i++) {  
    const infos = await getInfos.getCarInfos('https://www.webmotors.com.br/comprar/nissan/march/10-s-16v-flex-4p-manual/4-portas/2012-2013/43187226?pos=a43187226g:&np=1')
    console.log(infos)
  // }

})()