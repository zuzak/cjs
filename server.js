const chalk = require('chalk')
const getData = async () => {
  try {
    return require(__dirname + '/data/data.json')
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      console.error('No data; parsing')
      return await require('./parse.js')()
    }
  }
}

const run = async () => {
  const data = await getData()
  let keys = Object.keys(data)
  let randomInstrument = data[keys[Math.floor(Math.random() * keys.length)]]
  console.log(chalk.underline(randomInstrument.instrument))
  for (crime of randomInstrument.crimes) {
    console.log('\t' + crime.name + ' ' + chalk.gray(crime.section ? crime.section : ''))
  }
}

run()

