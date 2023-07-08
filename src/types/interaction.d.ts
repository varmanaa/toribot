import type {
    ChatInputCommandInteraction,
    ModalSubmitInteraction,
    ToribotClient,
} from '#structs'
import type {
    APIApplicationCommandInteractionDataIntegerOption,
    APIApplicationCommandInteractionDataNumberOption,
    APIApplicationCommandInteractionDataStringOption,
    APIChatInputApplicationCommandInteractionData,
    APIModalSubmission,
    ModalSubmitInteraction
} from '@discordjs/core'
import type { REST } from '@discordjs/rest'

export type AutocompleteFocusedOption =
    | APIApplicationCommandInteractionDataIntegerOption
    | APIApplicationCommandInteractionDataNumberOption
    | APIApplicationCommandInteractionDataStringOption

export type BaseInteractionOptions = {
    applicationId: string,
    id: string,
    rest: REST,
    token: string
}

export type ChatInputCommandInteractionOptions = BaseInteractionOptions & {
    data: APIChatInputApplicationCommandInteractionData,
    username: string
}

export interface Command {
    getAutocompleteChoices?(client: ToribotClient, interaction: ChatInputCommandInteraction)
    getCommand(): RESTPostAPIApplicationCommandsJSONBody
    run(client: ToribotClient, interaction: ChatInputCommandInteraction): Promise<void>
}

export interface Modal {
    handle(client: ToribotClient, interaction: ModalSubmitInteraction): Promise<void>
}

export type ModalSubmitInteractionOptions = BaseInteractionOptions & {
    data: APIModalSubmission,
    username: string
}