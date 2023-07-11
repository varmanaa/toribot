import type { Player, PrismaClient } from '@prisma/client'

export class PlayerTable {
    #prisma: PrismaClient

    public constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async insertPlayer(
        username: string,
        discordUserId?: bigint
    ): Promise<Player> {
        const player = await this.#prisma.player.create({
            data: {
                username,
                discordUserId
            }
        })

        return player
    }

    async getUsernames(ids?: number[]): Promise<string[]> {
        const rows = await this.#prisma.player.findMany({
            select: {
                username: true
            },
            where: {
                id: {
                    in: ids
                }
            }
        })
        const usernames = rows.map(row => row.username)

        return usernames
    }
}