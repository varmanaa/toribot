export class UsernameCache {
    #items: Set<string> = new Set()

    get items() {
        return this.#items
    }

    insert(usernames: string[]) {
        this.#items = new Set([...this.#items, ...usernames])
    }

    remove(usernames: string[]) {
        for (const username of usernames)
            this.#items.delete(username)
    }
}