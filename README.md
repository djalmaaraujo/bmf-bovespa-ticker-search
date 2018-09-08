# BMF Bovespa Search for Ticker

URL used: http://bvmf.bmfbovespa.com.br/cias-listadas/Titulos-Negociaveis/ResumoTitulosNegociaveis.aspx?or=bus&tip=I&cb=CS&idioma=pt-BR

## Deploy

`sls deploy`

## Run Local

`SLS_DEBUG=* sls invoke local --function hello --data '{"queryStringParameters": { "q": "CSN" }}'`

## Production

URL_generated`?q=CSN`