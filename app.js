const express = require('express')
const path = require('path')
const app = express()
let db = null
const {open} = require('sqlite')
const dbpath = path.join(__dirname, 'todoApplication.db')
const sqlite3 = require('sqlite3')
app.use(express.json())
let initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Sevser Running...')
    })
  } catch (e) {
    console.log(`error at : ${e.message}`)
    process.exit(1)
  }
}
initializeDbAndServer()
//1.GET
const getPriorityandStatus = requestQuery => {
  return requestQuery.priority != undefined && requestQuery.status != undefined
}
const getPriority = requestQuery => {
  return requestQuery.priority != undefined
}
const getstatus = requestQuery => {
  return requestQuery.status != undefined
}
app.get('/todos/', async (request, response) => {
  let getBookQuery = ''
  const {search_q = '', priority, status} = request.query
  switch (true) {
    case getPriorityandStatus(request.query):
      getBookQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%' AND status='${status}' AND priority='${priority}';`
      break
    case getPriority(request.query):
      getBookQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%'  AND priority='${priority}';`
      break
    case getstatus(request.query):
      getBookQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%'  AND status='${status}';`
      break
  }
  let getBooks = await db.all(getBookQuery)
  response.send(getBooks)
})
