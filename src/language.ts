import { Language } from "./stores/useSettings";

const da = {
    term: {
        student: "studerende | studerende",
        team: "gruppe | grupper"
    },
    page: {
        home: "Hjem",
        students: "Studerende",
        lab: "Værksted",
        teams: "Grupper",
        info: "Info",
        settings: "Indstillinger"
    },
    roleDesc: {
        "Co-ordinator": "Nødvendig for at fokusere på teamets mål, trække teammedlemmer ud og uddelegere arbejde på passende vis.",

        "Teamworker": "Hjælper teamet med at spille sammen ved at bruge deres alsidighed til at identificere det nødvendige arbejde og fuldføre det på vegne af teamet.",

        "Resource Investigator": "Bruger deres nysgerrige natur til at finde ideer til at bringe tilbage til teamet.",

        "Shaper": "Giver det nødvendige drive for at sikre, at teamet bliver ved med at bevæge sig og ikke mister fokus eller fremdrift.",

        "Completer Finisher": "Anvendes mest effektivt i slutningen af ​​opgaver til at polere og undersøge arbejdet for fejl og underkaste det de højeste standarder for kvalitetskontrol.",

        "Specialist": "Tilfører teamet dybdegående viden om et nøgleområde.",

        "Plant": "Har tendens til at være yderst kreativ og god til at løse problemer på utraditionelle måder.",

        "Monitor Evaluator": "Giver et logisk blik, foretager upartiske vurderinger, hvor det er nødvendigt, og afvejer teamets muligheder på en lidenskabsløs måde.",

        "Implementer": "Nødvendig for at planlægge en brugbar strategi og udføre den så effektivt som muligt.",
    },
    man: "mand | mænd",
    woman: "kvinde | kvinder",
    "non-binary": "ikke-binær | ikke-binære",
    "Co-ordinator": "Koordinator | koordinatore",
    "Teamworker": "Formidler | formidlere",
    "Resource Investigator": "Kontaktskaber | kontaktskabere",
    "Shaper": "Opstarter | opstartere",
    "Completer Finisher": "Afslutter | afsluttere",
    "Specialist": "Specialist | specialister",
    "Plant": "Idémand | idémænd",
    "Monitor Evaluator": "Analysator | analysatore",
    "Implementer": "Organisator | organisatore",
    option: "mulighed | muligheder",
    home: "hjem",
    lab: "værksted",
    setting: "indstilling | indstillinger",
    student: "studerende | studerende",
    download: "download",
    spreadsheet_template: "spreadsheet-skabelon",
    import: "importer",
    filled_out: "udfyldt | udfyldte",
    CSV_template: "CSV-skabelon | CSV-skabeloner",
    name: "navn | navne",
    belbin_role: "Belbin-rolle | Belbin-roller",
    former: "tidligere",
    previous: "tidligere",
    team: "gruppe | grupper",
    "team creation": "gruppering",
    automatic: "automatisk | automatiske",
    edit: "rediger",
    delete: "slet",
    cancel: "afbryd",
    confirm: "bekræft",
    new: "ny | nye",
    add: "tilføj",
    language: "sprog | sprog",
    license: "licens | licenser",
    belbin_compass: "Belbin-kompas | Belbin-kompasser",
    preview: "forhåndsvisning | forhåndsvisninger",
    package: "pakke | pakker",
    package_2: "pak",
    export: "eksporter",
    export2: "eksport | eksporter",
    as: "som",
    CSV_file: "CSV-fil",
    unpackaged: "upakket | upakkede",
    member: "medlem | medlemmer",
    reset: "gendan",
    forward: "videresend",
    tab: "fane | faner",
    link_2: "sammenkæd",
    unlink: "fjern sammenkædning fra",
    undo: "fortryd",
    forward_2: "videresendelse | videresendelser",
    "filled-out": "udfyldt | udfyldte",
    gender_distribution: "kønsfordeling | kønsfordelinger",
    "unlock": "lås op",
    "lock": "lås",
    welcome: "velkommen",
    "member limit": "medlemsgrænse | medlemsgrænser",
    da: "dansk",
    en: "english",
    letsbegin: "Tilføj {msg} for at begynde.",
    gender: "køn | køn",
    undefined: "-",
    welcomeMessage: "Velkommen til Tiamate!\nHaha!",
    connectingSpace: "",
    connectingSpace2: "s",
    connectingSpace3: "-",
    exceeded: "overskredet | overskredne",
    custom: "tilpasset | tilpassede",
    decimalPoint: ",",
    balance: "balance | balancer",
    move: "ryk",
    trial: "forsøg | forsøg",
    limit: "grænse | grænser",
    by: "af",
    max: "maks",
    unfilled: "ikke-udfuldt | ikke-udfyldte",
    role: "rolle | roller",
    run: "kør",
    on: "ved | på",
    packaging: "pakning | pakninger",
    template: "skabelon | skabeloner",
    analysis: "analyse | analyser",
    select: "vælg",
    to: "til",
    seat: "plads | pladser",
    remove: "fjern",
    selected: "valgt | valgte",
    file: "fil | filer",
    enable: "aktiver",
    disable: "deaktiver",
    spreadsheet: "spreadsheet",
    type: "type | typer",
    in: "i",
    default: "default",
    app: "program | programmer",
    open: "åbn",
    open2: "åben | åbne",
    folder: "mappe | mapper",
    average: "gennemsnitlig | gennemsnitlige",
    number_of: "antal",
    include: "inkluder",
    stat: "nøgletal",
    source: "kilde | kilder",
    link: "link | links",
    based: "baseret",
    weight: "vægt",
    of: "af"
};
type LangData = typeof da;
export const language: Record<Language, Partial<LangData>> = {
    da: da,
    en: {
        term: {
            student: "studerende | studerende",
            team: "gruppe | grupper"
        },
        page: {
            home: "Home",
            students: "Students",
            lab: "Lab", 
            teams: "Teams",
            info: "Info",
            settings: "Settings"
        },
        roleDesc: {
            "Co-ordinator": "Needed to focus on the team's objectives, draw out team members and delegate work appropriately.",

            "Teamworker": "Helps the team to gel, using their versatility to identify the work required and complete it on behalf of the team.",

            "Resource Investigator": "Uses their inquisitive nature to find ideas to bring back to the team.",

            "Shaper": "Provides the necessary drive to ensure that the team keeps moving and does not lose focus or momentum.",

            "Completer Finisher": "Most effectively used at the end of tasks to polish and scrutinise the work for errors, subjecting it to the highest standards of quality control.",

            "Specialist": "Brings in-depth knowledge of a key area to the team.",

            "Plant": "Tends to be highly creative and good at solving problems in unconventional ways.",

            "Monitor Evaluator": "Provides a logical eye, making impartial judgements where required and weighs up the team's options in a dispassionate way.",

            "Implementer": "Needed to plan a workable strategy and carry it out as efficiently as possible.",
        },
        man: "man | men",
        woman: "woman | women",
        "non-binary": "non-binary | non-binaries",
        "Co-ordinator": "Co-ordinator | co-ordinators",
        "Teamworker": "Teamworker | teamworkers",
        "Resource Investigator": "Resource Investigator | resource investigators",
        "Shaper": "Shaper | shapers",
        "Completer Finisher": "Completer Finisher | completer finisher",
        "Specialist": "Specialist | specialists",
        "Plant": "Plant | plants",
        "Monitor Evaluator": "Monitor Evaluator | monitor evaluators",
        "Implementer": "Implementer | implementers",
        option: "option | options",
        setting: "setting | settings",
        student: "student | students",
        filled_out: "filled-out | filled-out",
        CSV_template: "CSV template | CSV templates",
        name: "name | names",
        belbin_role: "Belbin role | Belbin roles",
        team: "team | teams",
        automatic: "automatic | automatic",
        new: "new | new",
        language: "language | languages",
        license: "license | licenses",
        belbin_compass: "Belbin compass | Belbin compasses",
        unpackaged: "unpackaged | unpackaged",
        preview: "preview | previews",
        package: "package | packages",
        package_2: "package",
        member: "member | members",
        tab: "tab | tabs",
        link_2: "link",
        forward_2: "forward | forwards",
        gender_distribution: "gender distribution | gender distributions",
        "member limit": "member limit | member limits",
        da: "dansk",
        en: "english",
        letsbegin: "Add {msg} to begin.",
        gender: "gender | genders",
        undefined: "-",
        connectingSpace: " ",
        connectingSpace2: " ",
        connectingSpace3: " ",
        exceeded: "exceeded | exceeded",
        custom: "custom",
        decimalPoint: ".",
        balance: "balance | balances",
        move: "move",
        trial: "trial | trials",
        limit: "limit | limits",
        by: "by",
        max: "max",
        unfilled: "unfilled",
        role: "role | roles",
        run: "run",
        reset: "reset",
        on: "on",
        packaging: "packaging | packagings",
        export: "export",
        export2: "export | exports",
        add: "add",
        template: "template | templates",
        "filled-out": "filled-out",
        import: "import",
        previous: "previous",
        analysis: "analysis | analyses",
        select: "select",
        edit: "edit",
        delete: "delete",
        "team creation": "team creation",
        to: "to",
        seat: "seat | seats",
        remove: "remove",
        lock: "lock",
        unlock: "unlock",
        welcome: "welcome",
        selected: "selected",
        file: "file | files",
        download: "download",
        enable: "enable",
        disable: "disable",
        spreadsheet: "spreadsheet",
        type: "type | types",
        in: "in",
        default: "default",
        app: "app | apps",
        open: "open",
        open2: "open",
        folder: "folder | folders",
        average: "average",
        number_of: "number of",
        include: "include",
        stat: "stat | stats",
        source: "source | sources",
        link: "link | links",
        based: "based",
        weight: "weight | weights",
        of: "of"
    }
    
}