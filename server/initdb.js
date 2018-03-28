const Sequelize = require('sequelize')
const database = process.env.database
const username = 'sa'
const password = process.env.password
const host = process.env.hostDb
const Op = Sequelize.Op

console.log('database', database)
console.log('username', username)
console.log('password', password)
console.log('host', host)
var randomFloat = require('random-float')
const sequelize = new Sequelize(database, username, password, {
  timezone: '+07:00',
  host: host,
  // dialect: 'sqlite',
  dialect: 'mssql',
  // storage: 'database.sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  port: 1433, // Default port
  dialectOptions: {
    instanceName: 'SQLEXPRESS',
    requestTimeout: 30000, // timeout = 30 seconds
  },
  timeout: 60000,
  max: Infinity,

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false,
})

const tbrealtime = sequelize.define(
  'tbrealtimes',
  {
    id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brix: { type: Sequelize.FLOAT, allowNull: false },
    flow: { type: Sequelize.FLOAT, allowNull: false },
    onoff: { type: Sequelize.INTEGER, allowNull: false },
    mass: { type: Sequelize.FLOAT, allowNull: false },
  },
  {
    // timestamp: Sequelize.DATE,
    timestamps: true,
    // I want createdAt to actually be called timestamp
    createdAt: 'timestamp',
    // I don't want updatedAt
    updatedAt: false,
  },
)

sequelize
  .sync()
  .then(() => {
    console.log('TERKONEK KE SEREVER')
    tbrealtime.sync().then(res => {
      for (let i = 0; i < 100; i++) {
        let valBool = 0
        if (i <= 5) {
          valBool = 0
        } else if (i >= 5 && i <= 30) {
          valBool = 1
        } else if (i >= 20 && i <= 30) {
          valBool = 0
        } else if (i >= 30 && i <= 40) {
          valBool = 1
        } else if (i >= 40 && i <= 50) {
          valBool = 1
        } else if (i >= 50 && i <= 60) {
          valBool = 0
        } else if (i >= 60 && i <= 80) {
          valBool = 1
        } else if (i >= 80 && i <= 100) {
          valBool = 0
        }
        tbrealtime
          .build({
            brix: randomFloat(0.0, 100.0),
            flow: randomFloat(0.0, 100.0),
            onoff: valBool,
            mass: randomFloat(0.0, 100.0),
          })
          .save()
          .then(res => {
            console.log(i)
            // console.log(res)
            // you can now access the currently saved task with the variable anotherTask... nice!
          })
          .catch(err => {
            console.log(err)
          })
      }
    })
  })
  .catch(err => {
    console.log(err)
    process.exit(0)
  })

module.exports = {
  getData(startDate, endDate) {
    return new Promise((resolve, reject) => {
      tbrealtime
        .findAll({
          where: {
            timestamp: {
              [Op.lte]: endDate,
              [Op.gte]: startDate,
            },
          },
          attributes: ['id', 'onoff'],
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getDataMass(idStart, idEnd) {
    return new Promise((resolve, reject) => {
      tbrealtime
        .findAll({
          where: {
            id: {
              [Op.lte]: idEnd,
              [Op.gte]: idStart,
            },
          },
          attributes: ['id', 'mass', 'timestamp'],
          order: [['timestamp', 'DESC']],
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getDataMassOnlyId(idDb) {
    return new Promise((resolve, reject) => {
      tbrealtime
        .findAll({
          where: {
            id: {
              [Op.eq]: idDb,
            },
          },
          attributes: ['id', 'mass', 'timestamp'],
          order: [['timestamp', 'DESC']],
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getLastData(limit) {
    return new Promise((resolve, reject) => {
      tbrealtime
        .findAll({ limit: limit, order: [['timestamp', 'DESC']] })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
}
