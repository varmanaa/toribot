import type { GameLocation, GameType, PrismaClient } from '@prisma/client'

export class GameTable {
    #prisma: PrismaClient

    public constructor(prisma: PrismaClient) {
        this.#prisma = prisma
    }

    async insertGame(
        playerOne: string,
        playerTwo: string,
        playerThree: string,
        playerFour: string,
        playerOneScore: number,
        playerTwoScore: number,
        playerThreeScore: number,
        playerFourScore: number,
        submitter: string,
        location: GameLocation,
        type: GameType,
        notes: string
    ): Promise<number> {
        const row = await this.#prisma.game.create({
            data: {
                playerOneFk: {
                    connectOrCreate: {
                        create: { username: playerOne },
                        where: { username: playerOne }
                    }
                },
                playerTwoFk: {
                    connectOrCreate: {
                        create: { username: playerTwo },
                        where: { username: playerTwo }
                    }
                },
                playerThreeFk: {
                    connectOrCreate: {
                        create: { username: playerThree },
                        where: { username: playerThree }
                    }
                },
                playerFourFk: {
                    connectOrCreate: {
                        create: { username: playerFour },
                        where: { username: playerFour }
                    }
                },
                playerOneScore,
                playerTwoScore,
                playerThreeScore,
                playerFourScore,
                submitterFk: {
                    connectOrCreate: {
                        create: { username: submitter },
                        where: { username: submitter }
                    }
                },
                location,
                type,
                notes
            }
        })

        return row.id
    }
}