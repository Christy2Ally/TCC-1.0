var fs = require('fs')

var DataT1 = fs.readFileSync('./files/test.json', 'utf8')
console.log('o que tinha no json')
console.log(DataT1)

var newData = DataT1 + '\n]\n}'

console.log('oque vai ter')
console.log(newData)
