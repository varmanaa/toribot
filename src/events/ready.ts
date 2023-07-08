import { commands } from '#interactions'
import type { ToribotClient } from '#structs'
import type { GatewayReadyDispatchData, WithIntrinsicProps } from '@discordjs/core'

export async function handleReady(client: ToribotClient, payload: WithIntrinsicProps<GatewayReadyDispatchData>) {
    const { user } = payload.data
    const commandJson = [...commands.values()].map(command => command.getCommand())
    const usernames = await client.database.players.getUsernames()

    await client.api.applicationCommands.bulkOverwriteGlobalCommands(user.id, commandJson)

    client.cache.usernames.insert(usernames)

    console.log(`${ user.username }#${ user.discriminator } is online!`)
}