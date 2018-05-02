let fs = require('fs');
let path = require('path')

const amendNgCliJson = (answers, resolve, reject) => {
  if (!answers.appName) return resolve("no appName, .angular-cli.json not modified")
  const filePath = path.join(`${process.env.PWD}/.angular-cli.json`)

  fs.readFile(filePath, {encoding: 'utf-8'}, function(err, ngCliJson) {
    if (err) reject(err)

    ngCliJson = ngCliJson.replace(/"name": .*/gi, `"name": "${answers.appName}",`)

    fs.writeFile(filePath, ngCliJson, err => resolve(err))

  })
}

const amendEnv = answers => {
  return new Promise((resolve, reject) => {

    filePaths = [
      path.join(`${process.env.PWD}/src/environments/environment.ts`),
      path.join(`${process.env.PWD}/src/environments/environment.prod.ts`),
    ]

    for(let filePath of filePaths)  {
      fs.readFile(filePath, {encoding: 'utf-8'}, function(err, ngEnv) {
        if (err) reject(err)

        ngEnv = ngEnv
          .replace(/realm: .*/gi, `realm: "${answers.realm}",`)
          .replace(/databaseId: .*/gi, `databaseId: "${answers.dbid}",`)

        fs.writeFile(filePath, ngEnv, err => {
          if (filePath.includes('.prod.')) amendNgCliJson(answers, resolve, reject)
        })

      })
    }
  })
}

module.exports = amendEnv;
