import type { ChatInputCommandInteraction, ToribotClient } from '#structs'
import type { ChatInputCommand } from '#types/interaction'
import {
    type APIActionRowComponent,
    type APIApplicationCommandOptionChoice,
    type APIInteractionDataOptionBase,
    type APIEmbed,
    type APIModalInteractionResponseCallbackData,
    type APITextInputComponent,
    ApplicationCommandOptionType,
    ComponentType,
    MessageFlags,
    TextInputStyle,
    type RESTPostAPIApplicationCommandsJSONBody,
} from '@discordjs/core'
import { GameLocation, GameType } from '@prisma/client'

export const AddScoreCommand: ChatInputCommand = {
    getCommand(): RESTPostAPIApplicationCommandsJSONBody {
        return {
            description: 'Record an in-person game',
            name: 'addscore',
            options: [
                {
                    choices: [
                        { name: 'Peel', value: GameLocation.PEEL },
                        { name: 'Toronto', value: GameLocation.TORONTO },
                        { name: 'Waterloo', value: GameLocation.WATERLOO },
                        { name: 'York', value: GameLocation.YORK }
                    ],
                    description: 'The game location',
                    name: 'location',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    choices: [
                        { name: 'Hanchan', value: GameType.HANCHAN }
                    ],
                    description: 'The game type',
                    name: 'type',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    autocomplete: true,
                    description: 'Player 1',
                    name: 'player-one',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    autocomplete: true,
                    description: 'Player 2',
                    name: 'player-two',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    autocomplete: true,
                    description: 'Player 3',
                    name: 'player-three',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    autocomplete: true,
                    description: 'Player 4',
                    name: 'player-four',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }
            ]
        }
    },
    async run(client: ToribotClient, interaction: ChatInputCommandInteraction): Promise<void> {
        const focusedOption = interaction.getFocusedOption()

        if (focusedOption) {
            const { value } = focusedOption
            const valueSanitized = value.toString().toLowerCase()
            const choices: APIApplicationCommandOptionChoice<string>[] = []

            for (const username of client.cache.usernames.items) {
                if (username.toLowerCase().includes(valueSanitized))
                    choices.push({ name: username, value: username })
                if (choices.length >= 25)
                    break
            }

            choices.sort((a, b) => a.name.localeCompare(b.name))

            return interaction.autocomplete(choices)
        }

        const options = interaction.data.options as APIInteractionDataOptionBase<ApplicationCommandOptionType.String, string>[]
        const location = options[0].value
        const type = options[1].value
        const playerOne = options[2].value
        const playerTwo = options[3].value
        const playerThree = options[4].value
        const playerFour = options[5].value
        const uniquePlayers = [...new Set([playerOne, playerTwo, playerThree, playerFour])]
        const embed: Partial<APIEmbed> = { color: 0xF8F8FF }

        if (uniquePlayers.length !== 4) {
            embed.description = 'Please provide 4 unique player usernames.'

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })

            return
        }

        const areAllUsernamesValid = uniquePlayers.every(username => /^[a-z0-9_\.]*$/g.test(username))

        if (!areAllUsernamesValid) {
            embed.description = 'Please ensure that all users consist of **only** lowercase letters, numbers, underscores, and periods.'

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })

            return
        }

        client.cache.usernames.insert([...uniquePlayers, interaction.username])

        const playerActionRows: APIActionRowComponent<APITextInputComponent>[] = uniquePlayers
            .map(username => ({
                components: [{
                    custom_id: username,
                    label: `Score for ${username}`,
                    max_length: 8,
                    placeholder: `Enter score for ${username} here!`,
                    required: true,
                    style: TextInputStyle.Short,
                    type: ComponentType.TextInput
                }],
                type: ComponentType.ActionRow
            }))
        const modal: APIModalInteractionResponseCallbackData = {
            components: [
                ...playerActionRows,
                {
                    components: [
                        {
                            custom_id: 'notes',
                            label: 'Notes',
                            max_length: 200,
                            placeholder: 'Add any notes (if applicable)',
                            required: false,
                            style: TextInputStyle.Paragraph,
                            type: ComponentType.TextInput
                        }
                    ],
                    type: ComponentType.ActionRow
                }
            ],
            custom_id: `addscore:${location}:${type}`,
            title: `Record ${type.toLowerCase()} at ${location.charAt(0).toUpperCase()}${location.slice(1).toLowerCase()}`
        }

        await interaction.replyWithModal(modal)
    }
}