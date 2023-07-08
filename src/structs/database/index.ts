import { GameTable } from './GameTable.js'
import { PlayerTable } from './PlayerTable.js'
import { PrismaClient } from '@prisma/client'

export class Database {
    #prisma = new PrismaClient()

    games = new GameTable(this.#prisma)
    players = new PlayerTable(this.#prisma)
}