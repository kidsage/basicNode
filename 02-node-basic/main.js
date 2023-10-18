var http = require("http")
var fs = require("fs") // file system
var url = require("url")
var qs = require("querystring")
var template = require("./lib/template")
var path = require("path")

var app = http.createServer(function (request, response) {
  var _url = request.url
  var queryData = url.parse(_url, true).query
  var pathname = url.parse(_url, true).pathname

  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (err, filelist) {
        var title = "Welcome"
        var description = "Hello, Node.js"
        var list = template.list(filelist)
        html = template.html(
          title,
          list,
          `<h2>${title}</h2>
        <p>${description}</p>`,
          `<a href="/create">create</a>`
        )
        response.writeHead(200)
        response.end(html)
      })
    } else {
      fs.readdir("./data", function (err, filelist) {
        var filteredId = path.parse(queryData.id).base
        fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
          var title = queryData.id
          var list = template.list(filelist)
          html = template.html(
            title,
            list,
            `<h2>${title}</h2>
            <p>${description}</p>`,
            `<a href="/create">create</a>
              <a href="/update?id=${title}">update</a>
              <form action="/process_delete", method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
              </form>`
          )
          response.writeHead(200)
          response.end(html)
        })
      })
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (err, filelist) {
      var title = "WEB - create"
      var list = template.list(filelist)
      html = template.html(
        title,
        list,
        `
        <form action="/process_create" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="descriptionn"></textarea>
        </p>
        <p>
          <input type="submit" />
        </p>
      </form>
      `
      )
      response.writeHead(200)
      response.end(html)
    })
  } else if (pathname === "/process_create") {
    var body = ""
    // partial data callback function
    request.on("data", function (data) {
      body += data
    })
    request.on("end", function () {
      var post = qs.parse(body)
      var title = post.title
      var description = post.description
      // console.log(post)
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: `/?id=${title}` })
        response.end()
      })
    })
  } else if (pathname === "/update") {
    fs.readdir("./data", function (err, filelist) {
      var filteredId = path.parse(queryData.id).base
      fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
        var title = queryData.id
        var list = template.list(filelist)
        html = template.html(
          title,
          list,
          `
          <form action="/process_update" method="post">
          <input type="hidden" name="id" value="${title}">

          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="descriptionn">"${description}"</textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
          `,
          `<a href="/create">create</a>
            <a href="/update?id=${title}">update</a>`
        )
        response.writeHead(200)
        response.end(html)
      })
    })
  } else if (pathname === "/process_update") {
    var body = ""
    // partial data callback function
    request.on("data", function (data) {
      body += data
    })
    request.on("end", function () {
      var post = qs.parse(body)
      var id = post.id
      var title = post.title
      var description = post.description
      fs.rename(`./data/${id}`, `./data/${title}`, function (err) {
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, { Location: `/?id=${title}` })
          response.end()
        })
      })
    })
  } else if (pathname === "/process_delete") {
    var body = ""
    // partial data callback function
    request.on("data", function (data) {
      body += data
    })
    request.on("end", function () {
      var post = qs.parse(body)
      var id = post.id
      var filteredId = path.parse(id).base
      fs.unlink(`data/${filteredId}`, function (err) {
        response.writeHead(302, { Location: `/` })
        response.end()
      })
    })
  } else {
    response.writeHead(404)
    response.end("Not Found")
  }
})

app.listen(3000)
