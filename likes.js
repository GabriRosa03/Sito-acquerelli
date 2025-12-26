// Sistema di gestione Like per i quadri
class LikeSystem {
    constructor() {
        this.database = firebase.database();
        this.likesRef = this.database.ref('likes');
        this.userLikesKey = 'userLikedPaintings'; // localStorage key
        this.userLikes = this.loadUserLikes();
    }

    // Carica i like dell'utente dal localStorage
    loadUserLikes() {
        const stored = localStorage.getItem(this.userLikesKey);
        return stored ? JSON.parse(stored) : {};
    }

    // Salva i like dell'utente nel localStorage
    saveUserLikes() {
        localStorage.setItem(this.userLikesKey, JSON.stringify(this.userLikes));
    }

    // Ottieni un ID univoco per ogni quadro basato sul suo src
    getPaintingId(painting) {
        // Usa il nome del file come ID (es: "paint2.jpg" → "paint2")
        return painting.src.split('/').pop().split('.')[0];
    }

    // Verifica se l'utente ha già messo like a questo quadro
    hasUserLiked(paintingId) {
        return this.userLikes[paintingId] === true;
    }

    // Toggle like (aggiungi o rimuovi)
    async toggleLike(painting) {
        const paintingId = this.getPaintingId(painting);
        const hasLiked = this.hasUserLiked(paintingId);
        const paintingRef = this.likesRef.child(paintingId);

        try {
            if (hasLiked) {
                // Rimuovi like
                await paintingRef.transaction((currentLikes) => {
                    return Math.max(0, (currentLikes || 0) - 1);
                });
                delete this.userLikes[paintingId];
            } else {
                // Aggiungi like
                await paintingRef.transaction((currentLikes) => {
                    return (currentLikes || 0) + 1;
                });
                this.userLikes[paintingId] = true;
            }

            this.saveUserLikes();
            return !hasLiked; // Ritorna il nuovo stato
        } catch (error) {
            console.error('Errore nel toggle del like:', error);
            throw error;
        }
    }

    // Ottieni il numero di like per un quadro
    async getLikes(painting) {
        const paintingId = this.getPaintingId(painting);
        try {
            const snapshot = await this.likesRef.child(paintingId).once('value');
            return snapshot.val() || 0;
        } catch (error) {
            console.error('Errore nel recupero dei like:', error);
            return 0;
        }
    }

    // Ascolta i cambiamenti in tempo reale per un quadro
    onLikesChange(painting, callback) {
        const paintingId = this.getPaintingId(painting);
        this.likesRef.child(paintingId).on('value', (snapshot) => {
            callback(snapshot.val() || 0);
        });
    }

    // Rimuovi listener
    offLikesChange(painting) {
        const paintingId = this.getPaintingId(painting);
        this.likesRef.child(paintingId).off();
    }

    // Ottieni tutti i like in una volta (utile per la galleria)
    async getAllLikes() {
        try {
            const snapshot = await this.likesRef.once('value');
            return snapshot.val() || {};
        } catch (error) {
            console.error('Errore nel recupero di tutti i like:', error);
            return {};
        }
    }

    // Ascolta tutti i cambiamenti (per aggiornamenti real-time nella galleria)
    onAllLikesChange(callback) {
        this.likesRef.on('value', (snapshot) => {
            callback(snapshot.val() || {});
        });
    }
}

// Istanza globale del sistema di like
const likeSystem = new LikeSystem();
