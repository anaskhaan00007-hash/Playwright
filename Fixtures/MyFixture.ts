import { test as base } from '@playwright/test';

type newFixture = {
    newFix: any
    nextFix:String
}
type workerFixture = {
    wokerFix:String
}

export const test = base.extend<newFixture,workerFixture>({
    newFix: async ({}: any, use: () => any)=>{
        console.log("start")
        await use()
         console.log("end")
    },
    nextFix: async ({newFix,page}, use)=>{
        const text = "next start"
        await page.screenshot()
        console.log("screenshot taken")
        await use(text)
         console.log("next end")
    },
    wokerFix: [async ({}, use,workerInfo)=>{
        const work = "worker start "+workerInfo.workerIndex
        await use(work)
        console.log("worker end")
    },{scope:'worker'}]
})

