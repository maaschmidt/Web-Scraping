# Certidão de débitos

### Com esta aplicação você pode consultar a situação de um CPF ou CNPJ.

Para isto você deverá seguir os passos seguintes:

1- Fazer o dowload desta branch

```bash
wget https://github.com/maaschmidt/Web-Scraping/archive/refs/heads/certidao-debitos.zip
```

2- Extrair em seu diretório de preferencia

```bash
unzip certidao-debitos.zip
```

3- Acessar a pasta extraida
```bash
cd Web-Scraping-certidao-debitos/
```

4- Instalar as dependencias

```bash
npm install
```

6- Inserir o CPF ou CNPJ a ser consultado no arquivo ./index.ts

```bash
main('<DOCUMENTO>') 

```

7- Inicie a aplicação

```bash
npm run start
```

## Resultado esperado é o console log da situação do CPF ou do CNPJ, mais o tempo de consulta