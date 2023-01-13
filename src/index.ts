import { getInfos } from "../getInfos";

const baseURL = "https://www.webmotors.com.br/carros/estoque/de.2010?tipoveiculo=carros&anode=2010&media=com%20fotos&precoate=35000&precode=20000&cambio=Autom%C3%A1tica%7CManual&opcionais=Ar%20condicionado&combustivel=Gasolina%7CGasolina%20e%20%C3%A1lcool";

(async () => {
  
  try {
    const pages = await getInfos.getUrl(baseURL)
  
    for (let i = 1; i < 10; i++) {  
      const infos = await getInfos.getCarInfos(pages[i])
      console.log(infos)
    }
  } catch (error) {
    console.log(error);
  }

})()