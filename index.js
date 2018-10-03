var http = require('http')
var { parse } = require('querystring')
var nodejieba = require('nodejieba')
nodejieba.load({
  userDict: './dict/userdict.utf8',
  stopWordDict: './dict/stopWord.utf8'
})
var topN = 10
var stripHtml = require('string-strip-html')

var server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    collectRequestData(req, result => {
      var top10 = nodejieba.extract(stripHtml(result.query).trim(), topN)
      // console.log(top10)
      var ouptutString = ''
      for (let key in top10) {
        let value = top10[key]; // get the value by key
        ouptutString += (parseInt(key)+1).toString() + '. ' + value.word +'<br>'
      }
      /*
      top10.forEach(function(element) {
        console.log(element)
        ouptutString += element.word +'<br>'
      })
      */
      res.end(`<!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Top 10 Keywords</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <form action="/" method="post">
          <textarea rows="25" cols="100" maxlength="3000" name="query">
          </textarea>
          <input type="submit" value="Submit">
          </form>
      ` + ouptutString + '</body></html>')
    })
  } else {
    res.end(`
            <!doctype html>
            <html>
            <head>
              <meta charset="utf-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <title>Top 10 Keywords</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
                <form action="/" method="post">
                  <textarea rows="10" cols="100" maxlength="2000" name="query">
                  </textarea>
                  <input type="submit" value="Submit">
                </form>
            </body>
            </html>
        `)
  }
})
server.listen(3000)

function collectRequestData (request, callback) {
  const FORM_URLENCODED = 'application/x-www-form-urlencoded'
  if (request.headers['content-type'] === FORM_URLENCODED) {
    let body = ''
    request.on('data', chunk => {
      body += chunk.toString()
    })
    request.on('end', () => {
      callback(parse(body))
    })
  } else {
    callback(null)
  }
}
