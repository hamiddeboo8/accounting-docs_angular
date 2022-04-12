export class DocItem {
    constructor(
        public ID: number,
        public Num: number,
        public Moein: Code,
        public Tafsili: Code,
        public Bedehkar: number,
        public Bestankar: number,
        public Desc: string,
        public CurrPrice: number,
        public Curr: string,
        public CurrRate: number,
        public SaveDB: boolean
    ){}
}

export class Code {
    constructor(
        public ID: number,
        public CodeVal: string,
        public Name: string,
        public Track: boolean,
        public Curr: boolean
    ){}
}

export class Codes {
    constructor(
        public Moein: Code,
        public Tafsili: Code
    ){}
}