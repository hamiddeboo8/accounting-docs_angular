import { DocItem } from "./doc-item";
export class Doc {
    constructor(
        public ID: number,
        public DocNum: number,
        public Date: string,
        public AtfNum: number,
        public MinorNum: string,
        public Desc: string,
        public State: string,
        public DailyNum: number,
        public DocType: string,
        public EmitSystem: string,
        public DocItems: DocItem[]
    ) {}
}

export class DocEdit {
    constructor(
        public ID: number,
        public DocNum: number,
        public Date: string,
        public AtfNum: number,
        public MinorNum: string,
        public Desc: string,
        public State: string,
        public DailyNum: number,
        public DocType: string,
        public EmitSystem: string,
        public AddDocItems: DocItem[],
        public RemoveDocItems: number[],
        public EditDocItems: DocItem[],
    ) {}
}

export class DocToSend {
    constructor(
        public ID: number,
        public DocNum: number,
        public Year: number,
        public Month: number,
        public Day: number,
        public Hour: number,
        public Minute: number,
        public Second: number,
        public AtfNum: number,
        public MinorNum: string,
        public Desc: string,
        public State: string,
        public DailyNum: number,
        public DocType: string,
        public EmitSystem: string,
        public DocItems: DocItem[]
    ) {}
}

export class DocEditToSend {
    constructor(
        public ID: number,
        public DocNum: number,
        public Year: number,
        public Month: number,
        public Day: number,
        public Hour: number,
        public Minute: number,
        public Second: number,
        public AtfNum: number,
        public MinorNum: string,
        public Desc: string,
        public State: string,
        public DailyNum: number,
        public DocType: string,
        public EmitSystem: string,
        public AddDocItems: DocItem[],
        public RemoveDocItems: number[],
        public EditDocItems: DocItem[],
    ) {}
}


export function convertTo(doc: Doc): DocToSend {
    const rExp : RegExp = new RegExp("(\\d+)-(\\d+)-(\\d+) (\\d+):(\\d+):(\\d+)");
    var matches = rExp.exec(doc.Date)
    var year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0
    if (matches != null) {
        year = +matches[1]
        month = +matches[2]
        day = +matches[3]
        hour = +matches[4]
        minute = +matches[5]
        second = +matches[6]
    }
    const docSend = new DocToSend(doc.ID, doc.DocNum, year, month, day, hour, minute, second, doc.AtfNum, doc.MinorNum, doc.Desc, doc.State, doc.DailyNum, doc.DocType, doc.EmitSystem, doc.DocItems)
    return docSend
}

export function convertFrom(docSend: DocToSend): Doc {
    var date = docSend.Year.toString().concat("-").concat(docSend.Month.toString()).concat('-').concat(docSend.Day.toString())
    date = date.concat(" ").concat(docSend.Hour.toString()).concat(":").concat(docSend.Minute.toString()).concat(":").concat(docSend.Second.toString())
    const doc = new Doc(docSend.ID, docSend.DocNum, date, docSend.AtfNum, docSend.MinorNum, docSend.Desc, docSend.State, docSend.DailyNum, docSend.DocType, docSend.EmitSystem, docSend.DocItems)
    return doc
}

export function convertToEdit(doc: DocEdit): DocEditToSend {
    const rExp : RegExp = new RegExp("(\\d+)-(\\d+)-(\\d+) (\\d+):(\\d+):(\\d+)");
    var matches = rExp.exec(doc.Date)
    var year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0
    if (matches != null) {
        year = +matches[1]
        month = +matches[2]
        day = +matches[3]
        hour = +matches[4]
        minute = +matches[5]
        second = +matches[6]
    }
    const docSend = new DocEditToSend(doc.ID, doc.DocNum, year, month, day, hour, minute, second, doc.AtfNum, doc.MinorNum, doc.Desc, doc.State, doc.DailyNum, doc.DocType, doc.EmitSystem, doc.AddDocItems, doc.RemoveDocItems, doc.EditDocItems)
    return docSend
}

export function convertFromEdit(docSend: DocEditToSend): DocEdit {
    var date = docSend.Year.toString().concat("-").concat(docSend.Month.toString()).concat('-').concat(docSend.Day.toString())
    date = date.concat(" ").concat(docSend.Hour.toString()).concat(":").concat(docSend.Minute.toString()).concat(":").concat(docSend.Second.toString())
    const doc = new DocEdit(docSend.ID, docSend.DocNum, date, docSend.AtfNum, docSend.MinorNum, docSend.Desc, docSend.State, docSend.DailyNum, docSend.DocType, docSend.EmitSystem, docSend.AddDocItems, docSend.RemoveDocItems, docSend.EditDocItems)
    return doc
}