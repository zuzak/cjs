const parse = require('csv-parse')
const fs = require('fs') // core

const getInstruments = async () => {
  let data = {}
  const parser = fs.createReadStream(__dirname + '/data/cjs-level1.csv').pipe(parse())
  for await (const line of parser) {
    data[line[0]] = {
      code: line[0],
      instrument: line[3],
      crimes: []
    }
  }
  return data
}

const getCrimes = async (instruments) => {
  const parser = fs.createReadStream(__dirname + '/data/cjs-level2.csv').pipe(parse())
  for await (const line of parser) {
    if (line[0].trim() === 'Code') continue
    const parentCode = line[1]
    if (!instruments[parentCode]) throw new Error('No parent code ' + parentCode)
    instruments[parentCode].crimes.push({
      name: line[3],
      section: ((datum) => {
        if (datum == 'Section:') return null
        let sect = datum.substr(9)
        if (/^\d/.test(sect)) return '§' + sect
        return sect
      })(line[6])
    })
  }
  return instruments
}

module.exports = async () => {
  let data = await getInstruments()
  data = await getCrimes(data)
  return data
}

/*
    0    1           2         3       4               5                   6                 7                8     9
    Code,Parent Code,Full Code,Meaning,User Sort Order,Effective From Date,Effective To Date,Usage Guidelines,Notes,SortPolicyOrder
 */
