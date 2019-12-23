#!/usr/bin/env node

const program = require('commander')
const { execSync } = require('child_process')
const red = require('@f0c1s/color-red')
const yellow = require('@f0c1s/color-yellow')
const cmd = `netstat | grep tcp4 | awk '{print $4 "|||" $5}'` // eslint-disable-line

function lookup (sortBy = 'port') {
  const out = execSync(cmd).toString()
    .split('\n').slice(0, -1)
    .map(i => i.split('|||'))
    .map(([self, foreign]) => {
      const sf = foreign.split('.')
      const protocol = sf.pop()
      const host = sf.join('.')
      const ss = self.split('.')
      const port = ss.pop()
      return { protocol, host, port }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'host': return a.host.localeCompare(b.host)
        case 'port': return a.port - b.port
        case 'protocol':
        default:
          return a.protocol.localeCompare(b.protocol)
      }
    })
    .map(({ protocol, host, port }) => `${red(protocol)}://${red(host)} is connected on port:${yellow(port)}`)
  console.log(out.join('\n'))
}

program.arguments('<sortBy>')
  .action(lookup)
  .parse(process.argv)
