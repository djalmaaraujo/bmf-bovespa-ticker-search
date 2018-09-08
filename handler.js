'use strict';

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const SYMBOL = '#SYMBOL#';
const URL = `http://bvmf.bmfbovespa.com.br/cias-listadas/Titulos-Negociaveis/ResumoTitulosNegociaveis.aspx?or=bus&tip=I&cb=${SYMBOL}&idioma=pt-BR`;
const TICKER_REGEX = /\&cb=([a-zA-Z0-9].*)\&tip/

module.exports.search = (event, context, callback) => {
  const queryString = (event.hasOwnProperty('queryStringParameters')) ? event.queryStringParameters : { q: null };
  const query = queryString.q;
  const response = {
    query,
    results: []
  };

  if (!query) {
    return callback(new Error('Provide a ticker name or part of it, ex: ?q=USIM5'), {statusCode: 400})
  }

  fetch(URL.replace(SYMBOL, query))
    .then(res => res.text())
    .then(body => {
      setTimeout(() => {
        const $ = cheerio.load(body);
        const linksRelated = $('body').find(`#ctl00_contentPlaceHolderConteudo_grdEmpresas_ctl01 > tbody > tr > td:nth-child(1) > [href*=${query}]`);

        if (linksRelated.length === 0) {
          response.error = `nothing found for ${query}`;
          return callback(null, {statusCode: 200, body: response});
        }

        linksRelated.each((i, elem) => {
          const name = elem.children[0].data.trim()
          const tickerName = TICKER_REGEX.exec(elem.attribs.href)
          const ticker = (tickerName) ? tickerName[1] : null

          if (!tickerName) return

          response.results.push({ name, ticker })
        });

        callback(null, {
          statusCode: 200,
          body: response,
        });
      }, 2000)
    });
};