const express = require("express")
const fs = require("fs")
const template = require("./lib/template.js")
const sanitizeHtml = require("sanitize-html")
var path = require("path")
// var qs = require("querystring")
var compression = require("compression")
var bodyParser = require("body-parser")

const app = express()
const port = 3000

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
// app.use((req, res, next) => {
//   fs.readdir("./data", (err, filelist) => {
//     req.list = filelist
//     next()
//   })
// })
/*
위 코드와 동일하나,
데이터를 읽어 올 필요가 없는 post 메소드에게
정보를 넘겨주는 행위 자체를 없애기 위한다면
아래와 같은 코드를 사용하면 된다.
*/
app.get("*", (req, res, next) => {
  fs.readdir("./data", (err, filelist) => {
    req.list = filelist
    next() // 다음 middleware가 실행될지 아닐지를 앞에서 결정함.
  })
})

app.get("/", (req, res) => {
  var title = "Welcome"
  var description = "Hello, Node.js"
  var list = template.list(req.list)
  var html = template.HTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`)
  res.send(html)
})

app.get("/page/:pageId", (req, res) => {
  var filteredId = path.parse(req.params.pageId).base
  fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
    var title = req.params.pageId
    var sanitizedTitle = sanitizeHtml(title)
    var sanitizedDescription = sanitizeHtml(description, {
      allowedTags: ["h1"],
    })
    var list = template.list(req.list)
    var html = template.HTML(
      sanitizedTitle,
      list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      `
      <a href="/create">create</a>
      <a href="/update/${sanitizedTitle}">update</a>
      <form action="/delete_process" method="post">
        <input type="hidden" name="id" value="${sanitizedTitle}">
        <input type="submit" value="delete">
      </form>
      `
    )
    res.send(html)
  })
})

app.get("/create", (req, res) => {
  var title = "WEB - create"
  var list = template.list(req.list)
  var html = template.HTML(
    title,
    list,
    `
    <form action="/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
        <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
    `,
    ""
  )
  res.send(html)
})

app.post("/create_process", (req, res) => {
  /*
  var body = ""
  req.on("data", function (data) {
    body = body + data
  })
  req.on("end", function () {
    var post = qs.parse(body)
    var title = post.title
    var description = post.description
    fs.writeFile(`data/${title}`, description, "utf8", function (err) {
      res.writeHead(302, { Location: `/page/${title}` })
      res.end()
    })
  })
  */
  var post = req.body
  var title = post.title
  var description = post.description
  fs.writeFile(`data/${title}`, description, "utf8", function (err) {
    res.redirect(`/page/${title}`)
  })
})

app.get("/update/:pageId", (req, res) => {
  var filteredId = path.parse(req.params.pageId).base
  fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
    var title = req.params.pageId
    var list = template.list(req.list)
    var html = template.HTML(
      title,
      list,
      `
      <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
      `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
    )
    res.send(html)
  })
})

app.post("/update_process", (req, res) => {
  req.on("end", function () {
    var post = req.body
    var id = post.id
    var title = post.title
    var description = post.description
    fs.rename(`data/${id}`, `data/${title}`, function (err) {
      fs.writeFile(`data/${title}`, description, "utf8", function (err2) {
        res.redirect(`/page/${title}`)
      })
    })
  })
})

app.post("/delete_process", (req, res) => {
  req.on("end", function () {
    var post = req.body
    var id = post.id
    var filteredId = path.parse(id).base
    fs.unlink(`data/${filteredId}`, function (err) {
      res.redirect("/")
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
