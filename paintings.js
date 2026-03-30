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
        src: "images/paint9.jpg",
        title: "Mesole - Tre Porti Venezia",
        title_en: "Mesole - Three Ports Venice",
        alt: "Three Ports of Venice",
        dimensions: { width: 38, height: 28 },
    },
    {
        src: "images/paint24.jpg",
        title: "Punta della Dogana Venezia",
        title_en: "Punta della Dogana Venice",
        alt: "Venice Customs Point",
        dimensions: { width: 56, height: 38 }
    },

    {
        src: "images/paint3.jpg",
        title: "Tramonto verso la laguna di Bibione - Venezia",
        title_en: "Sunset towards Bibione Lagoon - Venice",
        alt: "Bibione Lagoon Dream",
        dimensions: { width: 38, height: 28 }
    },

    {
        src: "images/paint17.jpg",
        title: "Riflessi, contrasti",
        title_en: "Reflections, Contrasts",
        alt: "Reflections and Contrasts",
        dimensions: { width: 28, height: 25 }
    },

    {
        src: "images/paint28.jpg",
        title: "Laguna di Venezia - Riflessi",
        title_en: "Venice Lagoon - Reflections",
        alt: "Lagoon Reflections",
        dimensions: { width: 38, height: 28 }
    },
    {
        src: "images/paint6.jpg",
        title: "Isola della Certosa - Venezia",
        title_en: "Certosa Island - Venice",
        alt: "Certosa Island",
        dimensions: { width: 28, height: 25 },
    },
    {
        src: "images/paint7.jpg",
        title: "Paesaggio urbano",
        title_en: "Urban Landscape",
        alt: "Urban Landscape",
        dimensions: { width: 14, height: 19 }
    },


    {
        src: "images/paint11.jpg",
        title: "Evening fog",
        title_en: "Evening Fog",
        alt: "Evening Fog",
        dimensions: { width: 21, height: 28 }
    },




    {
        src: "images/paint2.jpg",
        title: "Laguna di Bibione - Venezia",
        title_en: "Bibione Lagoon - Venice",
        alt: "Bibione Lagoon",
        dimensions: { width: 38, height: 28 }
    },

    {
        src: "images/paint13.jpg",
        title: "Emulazione Jan Min",
        title_en: "Jan Min Emulation",
        alt: "Jan Min Emulation",
        dimensions: { width: 38, height: 28 }
    },



    {
        src: "images/paint12.jpg",
        title: "Scorcio dietro a San Trovaso - Venezia",
        title_en: "Glimpse Behind San Trovaso - Venice",
        alt: "San Trovaso Corner",
        dimensions: { width: 28, height: 19 }
    },


    {
        src: "images/paint29.jpeg",
        title: "Lussino piccolo - Croazia",
        title_en: "Lussinpiccolo - Croatia",
        alt: "Lussinpiccolo Croatia",
        dimensions: { width: 38, height: 28 }
    },

    {
        src: "images/paint32.jpeg",
        title: "Tramonto dalla Laguna di Venezia",
        title_en: "Sunset from Venice Lagoon",
        alt: "Lagoon Sunset",
        dimensions: { width: 28, height: 19 }
    },



    {
        src: "images/paint26.jpg",
        title: "Al mare - Sicilia",
        title_en: "At the Sea - Sicily",
        alt: "Sicilian Seascape",
        dimensions: { width: 38, height: 28 }
    },
    {
        src: "images/paint25.jpg",
        title: "Darsena di San Giorgio nella nebbia",
        title_en: "San Giorgio Dockyard in the Mist",
        alt: "San Giorgio in Mist",
        dimensions: { width: 28, height: 38 }
    },
    {
        src: "images/paint14.jpg",
        title: "Canal Grande e Chiesa della Salute",
        title_en: "Canal Grande and Basilica of Santa Maria della Salute",
        alt: "Canal Grande",
        dimensions: { width: 28, height: 38 }
    },
    {
        src: "images/paint15.jpg",
        title: "Foggy",
        title_en: "Foggy",
        alt: "Foggy Venice",
        dimensions: { width: 25, height: 28 }
    },

    {
        src: "images/paint31.jpeg",
        title: "Yacht Sant'Elena - Venezia",
        title_en: "Yacht Sant'Elena - Venice",
        alt: "Sant'Elena Venice",
        dimensions: { width: 38, height: 28 }
    },

    {
        src: "images/paint4.jpg",
        title: "Saline di Mozzia - Sicilia",
        title_en: "Mozzia Salt Flats - Sicily",
        alt: "Mozzia Sicily",
        dimensions: { width: 33, height: 23 }
    },

    {
        src: "images/paint8.jpg",
        title: "Isola di San Giorgio da Piazza San Marco",
        title_en: "San Giorgio Island from St. Mark's Square",
        alt: "San Giorgio Island",
        dimensions: { width: 28, height: 38 }
    },



    {
        src: "images/paint16.jpg",
        title: "Lussino piccolo West Coast",
        title_en: "Lussinpiccolo West Coast",
        alt: "West Coast Lussinpiccolo",
        dimensions: { width: 28, height: 25 }
    },

    {
        src: "images/paint19.jpg",
        title: "Spiaggia la Brussa - Venezia",
        title_en: "La Brussa Beach - Venice",
        alt: "La Brussa Beach",
        dimensions: { width: 28, height: 21 }
    },

    {
        src: "images/paint30.jpeg",
        title: "Riva degli Schiavoni - Venezia (Abstract)",
        title_en: "Riva degli Schiavoni - Venice (Abstract)",
        alt: "Riva degli Schiavoni Abstract",
        dimensions: { width: 38, height: 56 }
    },


    {
        src: "images/paint20.jpg",
        title: "Laguna di Venezia",
        title_en: "Venice Lagoon",
        alt: "Venice Lagoon",
        dimensions: { width: 28, height: 25 }
    },
    {
        src: "images/paint21.jpg",
        title: "Isola di San Giorgio - Venezia",
        title_en: "San Giorgio Island - Venice",
        alt: "San Giorgio Island Venice",
        dimensions: { width: 31, height: 23 }
    },
    {
        src: "images/paint22.jpg",
        title: "Gran Canaria",
        title_en: "Gran Canaria",
        alt: "Gran Canaria",
        dimensions: { width: 19, height: 28 }
    },
    {
        src: "images/paint23.jpg",
        title: "Spiaggia Siciliana",
        title_en: "Sicilian Beach",
        alt: "Sicilian Beach",
        dimensions: { width: 31, height: 23 }
    },
    {
        src: "images/paint10.jpg",
        title: "Spiaggia di Cascais",
        title_en: "Cascais Beach",
        alt: "Cascais Beach",
        dimensions: { width: 31, height: 23 }
    },

    {
        src: "images/paint27.jpg",
        title: "Porticciolo di Marzamemi",
        title_en: "Little Harbor of Marzamemi",
        alt: "Marzamemi Harbor",
        dimensions: { width: 38, height: 28 }
    },

    {
        src: "images/paint33.jpeg",
        title: "Passeggiata al mare - Omaggio a Jan Min",
        title_en: "Walk to the beach - Homage to Jan Min",
        alt: "Walk to the beach",
        dimensions: { width: 38, height: 28 },
        date: "2026-03-30"
    },



]
