var http = require('http')
var { parse } = require('querystring')
var nodejieba = require('nodejieba')
nodejieba.load({
  userDict: './dict/userdict.utf8',
  stopWordDict: './dict/stopWord.utf8'
})
// jieba top setting
var topN = 20
// return how many top keywords
var maxN = 10
// number in this list won't be filtered
var numberList = ['520', '921', '1111', '9453', '9487']
var stripHtml = require('string-strip-html')

var server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    collectRequestData(req, result => {
      var top20 = nodejieba.extract(stripHtml(result.query).trim(), topN)
      // console.log(top20)

      var ouptutString = ''
      var counter = 1
      for (let key in top20) {
        let value = top20[key] // get the value by key
        if (counter > maxN)
          break
        if (isNaN(value.word)) {
          ouptutString += counter + '. ' + value.word + '<br>'
          counter += 1
        } else {
          if (numberList.indexOf(value.word) > -1) {
            ouptutString += counter + '. ' + value.word + '<br>'
            counter += 1
          }
        }
      }
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
                  <textarea rows="25" cols="100" maxlength="3000" name="query">
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
