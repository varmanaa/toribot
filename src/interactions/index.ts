import type { Command, Modal } from '#types/interaction'
import { AddScoreCommand } from './command/index.js'

import { AddScoreModal } from './modal/addscore.js'

export const commands: Map<string, Command> = new Map([
    ['addscore', AddScoreCommand]
])
export const modals: Map<string, Modal> = new Map([
    ['addscore', AddScoreModal]
])