#!/usr/bin/env node

import '../lib/globals.js'
import '../lib/completion.js'
import '../lib/header.js'
import { mainMenu } from '../lib/menus.js'
import { getConfig } from '../lib/config.js'

import updateNotifier from 'update-notifier'

updateNotifier({
  pkg: { name: PKG_NAME, version: PKG_VERSION },
  updateCheckInterval: 0
}).notify({ isGlobal: true })

process.on('uncaughtException', $.verbose ? console.error : () => { })
process.on('unhandledRejection', $.verbose ? console.error : () => { })
process.on('SIGINT', process.exit)

global.cfg = await getConfig()
mainMenu()
