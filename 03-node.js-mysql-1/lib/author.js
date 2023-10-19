var db = (exports.home = function (request, response) {
  db.query(`SELECT * FROM topic`, function (err, results) {
    var title = "Welcome"
    var description = "Hello, Node.js"
    var list = template.list(results)
    var html = template.HTML(
      title,
      list,
      `
      <table>
    <tr>
        <td></td>
        </tr>
    </table>
    <style>
        table{
            border-collapse:collapse;
        }
        td{
            border:1px solid black;
        }
    </style>
    
      `,
      `<a href="/create">create</a>`
    )
    response.writeHead(200)
    response.end(html)
  })
})
