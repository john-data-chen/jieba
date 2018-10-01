var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
var nodejieba = require('nodejieba')
nodejieba.load({
  userDict: './dict/userdict.utf8',
  stopWordDict: './dict/stopWord.utf8'
})
var topN = 10

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/', function (req, res) {
  // console.log(req.body)
  var result = ''
  result = nodejieba.extract(req.body.query, topN)
  res.send(result)
})

app.listen(3000, function () {
  // console.log('Example app listening on port 3000!')
})
