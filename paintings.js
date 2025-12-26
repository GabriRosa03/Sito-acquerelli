// Array di oggetti che rappresentano i quadri
// Per aggiungere un nuovo quadro, copia un blocco tra parentesi graffe {},
// incollalo alla fine della lista (prima della parentesi quadra finale ])
// e modifica i testi tra virgolette.
//
// OPTIONAL: Puoi aggiungere una proprietà "thumb" per usare un'immagine più piccola nella griglia:
// {
//    src: "images/paint1.jpg",
//    thumb: "images/paint1_thumb.jpg", // Immagine piccola
//    title: "...",
//    ...
// }

const paintings = [
    {
        src: "images/paint2.jpg",
        title: "Riflessi d'Oro",
        title_en: "Golden Reflections",
        description: "Acquerello - Il sole che si specchia nei canali",
        description_en: "Watercolor - The sun mirroring in the canals",
        alt: "Riflessi d'Oro"
    },
    {
        src: "images/paint3.jpg",
        title: "Sogno in Laguna",
        title_en: "Lagoon Dream",
        description: "Tecnica mista - Atmosfera",
        description_en: "Mixed media - Atmosphere",
        alt: "Sogno in Laguna"
    },
    {
        src: "images/paint4.jpg",
        title: "Giardino Fiorito",
        title_en: "Flowery Garden",
        description: "Acquerello su carta - Un angolo di giardino primaverile con rose e glicini",
        description_en: "Watercolor on paper - A corner of a spring garden with roses and wisterias",
        alt: "Giardino Fiorito"
    },

    {
        src: "images/paint6.jpg",
        title: "Sentiero di Montagna",
        title_en: "Mountain Path",
        description: "Acquerello su carta - Un viottolo tra i boschi alpini in autunno",
        description_en: "Watercolor on paper - A path through alpine woods in autumn",
        alt: "Sentiero di Montagna"
    },
    {
        src: "images/paint7.jpg",
        title: "Piazza Antica",
        title_en: "Ancient Square",
        description: "Acquerello su carta - Scorci di vita quotidiana in una piazza storica italiana",
        description_en: "Watercolor on paper - Glimpses of daily life in a historic Italian square",
        alt: "Piazza Antica"
    },
    {
        src: "images/paint8.jpg",
        title: "Nebbie Lagunari",
        title_en: "Lagoon Mists",
        description: "Acquerello su carta - La laguna avvolta dalla nebbia mattutina",
        description_en: "Watercolor on paper - The lagoon wrapped in morning mist",
        alt: "Nebbie Lagunari"
    },
    {
        src: "images/paint9.jpg",
        title: "Campagna Toscana",
        title_en: "Tuscan Countryside",
        description: "Acquerello su carta - Dolci colline e cipressi sotto un cielo azzurro",
        description_en: "Watercolor on paper - Rolling hills and cypresses under a blue sky",
        alt: "Campagna Toscana"
    },

    {
        src: "images/paint11.jpg",
        title: "Finestre Veneziane",
        title_en: "Venetian Windows",
        description: "Acquerello su carta - Dettagli architettonici di antichi palazzi veneziani",
        description_en: "Watercolor on paper - Architectural details of ancient Venetian palaces",
        alt: "Finestre Veneziane"
    },
    {
        src: "images/paint12.jpg",
        title: "Tramonto sul Mare",
        title_en: "Sunset on the Sea",
        description: "Acquerello su carta - Il sole che si tuffa nell'orizzonte marino",
        description_en: "Watercolor on paper - The sun diving into the marine horizon",
        alt: "Tramonto sul Mare"
    },
    {
        src: "images/paint13.jpg",
        title: "Vicolo Silenzioso",
        title_en: "Silent Alley",
        description: "Acquerello su carta - Una stretta calle veneziana nelle ore pomeridiane",
        description_en: "Watercolor on paper - A narrow Venetian street in the afternoon hours",
        alt: "Vicolo Silenzioso"
    },
    {
        src: "images/paint14.jpg",
        title: "Natura Selvaggia",
        title_en: "Wild Nature",
        description: "Acquerello su carta - Vegetazione rigogliosa lungo un sentiero di campagna",
        description_en: "Watercolor on paper - Lush vegetation along a country path",
        alt: "Natura Selvaggia"
    },
    {
        src: "images/paint15.jpg",
        title: "Gondole al Tramonto",
        title_en: "Gondolas at Sunset",
        description: "Acquerello su carta - Gondole ormeggiate sotto la luce dorata del tramonto",
        description_en: "Watercolor on paper - Gondolas moored under the golden light of sunset",
        alt: "Gondole al Tramonto"
    },
    {
        src: "images/paint16.jpg",
        title: "Borgo Medievale",
        title_en: "Medieval Village",
        description: "Acquerello su carta - Le mura e le torri di un antico borgo italiano",
        description_en: "Watercolor on paper - The walls and towers of an ancient Italian village",
        alt: "Borgo Medievale"
    },
    {
        src: "images/paint17.jpg",
        title: "Lago di Montagna",
        title_en: "Mountain Lake",
        description: "Acquerello su carta - Acque cristalline circondate da vette innevate",
        description_en: "Watercolor on paper - Crystal clear waters surrounded by snowy peaks",
        alt: "Lago di Montagna"
    },

    {
        src: "images/paint19.jpg",
        title: "Chiostro Francescano",
        title_en: "Franciscan Cloister",
        description: "Acquerello su carta - La quiete di un antico chiostro monastico",
        description_en: "Watercolor on paper - The quiet of an ancient monastic cloister",
        alt: "Chiostro Francescano"
    },
    {
        src: "images/paint20.jpg",
        title: "Vigneto al Tramonto",
        title_en: "Vineyard at Sunset",
        description: "Acquerello su carta - Filari di viti illuminate dalla luce calda del crepuscolo",
        description_en: "Watercolor on paper - Rows of vines illuminated by the warm light of twilight",
        alt: "Vigneto al Tramonto"
    },
    {
        src: "images/paint21.jpg",
        title: "Rialto al Mattino",
        title_en: "Rialto at Morning",
        description: "Acquerello su carta - Il celebre ponte di Rialto nelle prime ore del giorno",
        description_en: "Watercolor on paper - The famous Rialto bridge in the early hours of the day",
        alt: "Rialto al Mattino"
    },
    {
        src: "images/paint22.jpg",
        title: "Cascina Lombarda",
        title_en: "Lombard Farmhouse",
        description: "Acquerello su carta - Una tipica cascina della pianura padana",
        description_en: "Watercolor on paper - A typical farmhouse of the Po Valley",
        alt: "Cascina Lombarda"
    },
    {
        src: "images/paint23.jpg",
        title: "Isola all'Alba",
        title_en: "Island at Dawn",
        description: "Acquerello su carta - Un'isola della laguna nelle prime luci del mattino",
        description_en: "Watercolor on paper - An island of the lagoon in the first light of morning",
        alt: "Isola all'Alba"
    },
    {
        src: "images/paint10.jpg",
        title: "Ponte Antico",
        title_en: "Ancient Bridge",
        description: "Acquerello su carta - Un vecchio ponte di pietra sopra un torrente di montagna",
        description_en: "Watercolor on paper - An old stone bridge over a mountain stream",
        alt: "Ponte Antico"
    },
]
