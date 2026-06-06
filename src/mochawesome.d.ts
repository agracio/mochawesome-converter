export interface MochawesomeRoot {
    stats: MochawesomeStats
    results: MochawesomeResult[]
}

export interface MochawesomeStats {
    suites: number
    tests: number
    passes: number
    pending: number
    failures: number
    testsRegistered: number
    passPercent: number
    pendingPercent: number
    other: number
    hasOther: boolean
    skipped: number
    hasSkipped: boolean
    duration: number
}

export interface MochawesomeResult {
    uuid: string
    title: string
    fullFile: string
    file: string
    beforeHooks: any[]
    afterHooks: any[]
    tests: any[]
    suites: MochawesomeSuite[]
    passes: string[]
    failures: string[]
    pending: string[]
    skipped: string[]
    duration: number
    root: boolean
    rootEmpty: boolean
    _timeout: number
}

export interface MochawesomeSuite {
    uuid: string
    title: string
    file: string
    fullFile?: string
    beforeHooks: any[]
    afterHooks: any[]
    tests: MochawesomeTest[]
    suites: any[]
    passes: string[]
    failures: string[]
    pending: string[]
    skipped: string[]
    duration: number
    root: boolean
    rootEmpty: boolean
    _timeout: number
}

export interface MochawesomeTest {
    title: string
    fullTitle: string
    duration: number
    state: string
    speed: string
    pass: boolean
    fail: boolean
    pending: boolean
    context: string | null
    code: any
    err: MochawesomeErr | null
    uuid: string
    parentUUID: string | null
    isHook: boolean
    skipped: boolean
}

export interface MochawesomeErr {
    message?: string
    estack?: string
    diff: any
}
