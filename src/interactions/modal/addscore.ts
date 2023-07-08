import type { Modal } from '#types/interaction'
import type { ModalSubmitInteraction, ToribotClient } from '#structs'
import type { APIEmbed } from 'discord-api-types/v10'
import type { GameLocation, GameType } from '@prisma/client'

export const AddScoreModal: Modal = {
    async handle (client: ToribotClient, interaction: ModalSubmitInteraction): Promise<void> {
        await interaction.defer()

        let embed: Partial<APIEmbed> = { color: 0xF8F8FF }

        const values = interaction.values()
        const usernames: string[] = []
        const scores: number[] = []

        let totalScore = 0

        for (const [username, submittedScore] of values.slice(0, 4)) {
            if (!/^((0|-?100,?000|-?([1-9]|[1-9]\d?,?\d)00)|(-?(0?\.[1-9]|100(\.0)?|([1-9]\d?(\.\d)?))k?))$/g.test(submittedScore)) {
                embed.description = 'One or more scores are in an invalid format. Please try again.'

                await interaction.updateReply({ embeds: [embed] })

                return
            }

            let score = Number(submittedScore.replace(/[^0-9.]/g, ''))

            if (score % 100 !== 0)
                score = score * 1_000

            usernames.push(username)
            scores.push(score)
            totalScore += score

            if (totalScore > 100_000) {
                embed.description = 'The total score exceeds 100,000 points. Please ensure that all scores sum to a maximum of 100,000 points.'

                await interaction.updateReply({ embeds: [embed] })

                return
            }
        }

        const [,location, type] = interaction.data.custom_id.split('-')
        const gameId = await client.database.games.insertGame(
            usernames[0],
            usernames[1],
            usernames[2],
            usernames[3],
            scores[0],
            scores[1],
            scores[2],
            scores[3],
            interaction.username,
            location as GameLocation,
            type as GameType,
            values[4][1]
        )

        embed = {
            ...embed,
            description: [0, 1, 2, 3]
                .map(index => `${ usernames[index] } - ${ scores[index] }`)
                .join('\n'),
            footer: { text: `Submitted by ${ interaction.username }`},
            title: `Game #${ gameId }`
        }

        if (values[4][1]?.length)
            embed.fields = [{ inline: false, name: 'Notes', value: values[4][1] }]

        await interaction.updateReply({ embeds: [embed] })
    }
}