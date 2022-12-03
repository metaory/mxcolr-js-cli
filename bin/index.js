#!/usr/bin/env node

import '../lib/completion.js'
import '../lib/globals.js'
import '../lib/header.js'
import menu from '../lib/menus.js'

import updateNotifier from 'update-notifier'

updateNotifier({
  pkg: { name: PKG_NAME, version: PKG_VERSION },
  updateCheckInterval: 0
}).notify({ isGlobal: true })

const noop = () => {}
process.on('uncaughtException', $.verbose ? console.error : noop)
process.on('unhandledRejection', $.verbose ? console.error : noop)
process.on('SIGINT', process.exit)

menu()
