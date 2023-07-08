import type { ModalSubmitInteractionOptions } from '#types/interaction'
import type { APIModalSubmission } from '@discordjs/core'
import { BaseInteraction } from './BaseInteraction.js'

export class ModalSubmitInteraction extends BaseInteraction {
    readonly data: APIModalSubmission
    readonly username: string

    public constructor({ data, username, ...baseOptions }: ModalSubmitInteractionOptions) {
        super(baseOptions)

        this.data = data
        this.username = username
    }

    public values(): [string, string][] {
        const entries = this.data.components.map(component => {
            const { custom_id, value } = component.components[0]

            return [custom_id, value] as [string, string]
        })

        return entries
    }
}