import { ToribotClient } from '#structs'
import { handleEvents } from '#events'

const client = new ToribotClient()

await handleEvents(client)
await client.login()