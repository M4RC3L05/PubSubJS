import puppeteer from 'puppeteer'
import StaticServer from 'static-server'
import path from 'path'

let browser: puppeteer.Browser
let server

describe('PubSubJS e2e tests', () => {
    beforeAll(async () => {
        server = new StaticServer({
            rootPath: path.resolve(__dirname, 'html'),
            port: 8080,
            host: '127.0.0.1',
            cors: '*'
        })
        await new Promise(r =>
            server.start(() => {
                console.log('started')
                r()
            })
        )
    })

    afterAll(() => {
        if (server) {
            console.log('closing')
            server.stop()
        }
    })

    afterEach(async () => {
        if (browser) await browser.close()
    })

    it('Should expose the PubSubJS api to the window object [DEV]', async () => {
        browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('http://127.0.0.1:8080/dev.html')

        const h1content = JSON.parse(
            await page.evaluate(() =>
                JSON.stringify(
                    (document.querySelector('h1') as any).textContent
                )
            )
        )

        const expectedTag = '<h1>development tests</h1>'
        const retreavedTag = `<h1>${h1content}</h1>`

        expect(retreavedTag).toBe(expectedTag)

        const windowOBJ = JSON.parse(
            await page.evaluate(() =>
                JSON.stringify(Object.keys((window as any).PubSubJS || []))
            )
        )

        const expects = [
            'subscribe',
            'unsubscribe',
            'publish',
            'clearAllSubscriptions',
            'clearAllByTopic',
            'getTopics'
        ]

        expect(windowOBJ).toHaveLength(expects.length)
        expect(windowOBJ).toContain(expects[0])
        expect(windowOBJ).toContain(expects[1])
        expect(windowOBJ).toContain(expects[2])
        expect(windowOBJ).toContain(expects[3])
        expect(windowOBJ).toContain(expects[4])
        expect(windowOBJ).toContain(expects[5])
    })

    it('Should expose the PubSubJS api to the window object [PROD]', async () => {
        browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('http://127.0.0.1:8080/prod.html')

        const h1content = JSON.parse(
            await page.evaluate(() =>
                JSON.stringify(
                    (document.querySelector('h1') as any).textContent
                )
            )
        )

        const expectedTag = '<h1>production tests</h1>'
        const retreavedTag = `<h1>${h1content}</h1>`

        expect(retreavedTag).toBe(expectedTag)

        const windowOBJ = JSON.parse(
            await page.evaluate(() =>
                JSON.stringify(Object.keys((window as any).PubSubJS || []))
            )
        )

        const expects = [
            'subscribe',
            'unsubscribe',
            'publish',
            'clearAllSubscriptions',
            'clearAllByTopic',
            'getTopics'
        ]

        expect(windowOBJ).toHaveLength(expects.length)
        expect(windowOBJ).toContain(expects[0])
        expect(windowOBJ).toContain(expects[1])
        expect(windowOBJ).toContain(expects[2])
        expect(windowOBJ).toContain(expects[3])
        expect(windowOBJ).toContain(expects[4])
        expect(windowOBJ).toContain(expects[5])
    })
})
