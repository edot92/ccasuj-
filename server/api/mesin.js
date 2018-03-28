import { Router } from 'express'
const db = require('../initdb')
const moment = require('moment')
const router = Router()
const csv = require('express-csv')
var jsonexport = require('jsonexport')

async function getIDDataMass (paramdataArray) {
  var listDataKey = []
  var start = false
  return new Promise((resolve, reject) => {
    try {
      //   isinya {
      // minId:x,
      // maxId:x
      // }

      let temp = {
        minId: 0,
        maxId: 0
      }
      var dataArray = paramdataArray
      const length = dataArray.length
      for (let index = 0; index < length; index++) {
        if (dataArray[index].dataValues.onoff === 1 && start === false) {
          temp.minId = dataArray[index].dataValues.id
          start = true
        } else if (dataArray[index].dataValues.onoff === 0 && start === true) {
          temp.maxId = dataArray[index].dataValues.id - 1
          start = false
          console.log(temp)
          listDataKey.push(temp)
          temp = null
          temp = {
            minId: 0,
            maxId: 0
          }
        }
      }
      resolve(listDataKey)
    } catch (error) {
      console.log(error)
      console.log('ada error')
      reject(error)
    }
  })
}
async function generateCsv (params) {
  return new Promise((resolve, reject) => {
    var dataCsv = [
      // {
      //   starttime: '',
      //   endtime: '',
      //   mass: ''
      // }
    ]
    const length = params.length
    for (var index = 0; index < length; index++) {
      /*
 id: 9,
  mass: 40.6344280862936,
  timestamp: 2018-03-28T15:43:46.615Z
        */
      let tempStart = params[index].start[0].dataValues
      let tempEnd = params[index].end[0].dataValues
      let tempArrayKolomCsv = {
        starttime: moment(tempStart.timestamp).format('DD-MM-YYYY HH:mm:ss'),
        endtime: moment(tempEnd.timestamp).format('DD-MM-YYYY HH:mm:ss'),
        mass: tempEnd.mass
      }

      dataCsv.push(tempArrayKolomCsv)
    }
    jsonexport(dataCsv, function (err, csv) {
      if (err) return reject(err)
      resolve(csv)
    })
  })
}
router.get('/report/:startdate/:enddate', async function (req, res, next) {
  var startdate = req.params.startdate
  var enddate = req.params.enddate
  startdate = moment(startdate + ' 00:00:00+07:00').format(moment.ISO_860)
  enddate = moment(enddate + ' 23:59:59+07:00').format(moment.ISO_860)

  try {
    var resDatabaseAll = await db.getData(startdate, enddate)
    var dataArray = await getIDDataMass(resDatabaseAll)
    if (dataArray.length === 0) {
      res.send('tidak ada data')
    } else {
      var resultDb = []
      for (let index = 0; index < dataArray.length; index++) {
        let tempMin = await db.getDataMassOnlyId(dataArray[index].minId)
        let tempMax = await db.getDataMassOnlyId(dataArray[index].maxId)
        let temp = {
          start: tempMin,
          end: tempMax
        }
        resultDb.push(temp)
      }
      const reCsv = await generateCsv(resultDb)
      res.setHeader(
        'Content-disposition',
        'attachment; filename=exportdata.csv'
      )
      res.set('Content-Type', 'text/csv')
      res.send(reCsv)
    }
  } catch (error) {
    res.send(error)
  }
})
router.get('/trend/:limit', async function (req, res, next) {
  var limit = parseInt(req.params.limit)
  try {
    let temp = await db.getLastData(limit)
    res.send(temp)
  } catch (e) {
    res.send(e)
  }
})

/* GET user by ID. */

export default router
