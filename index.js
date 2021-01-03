console.log('Portentier is now gazing into your future!')

Hooks.on("ready", function() {
    Hooks.on(`renderLongRestDialog`, (dialog, html)=> { 
        
        if(game.user.data.name !== "Felicity Highhill"){
            return;
        }
        
        const actor = game.user.character
        const portenter = new Portenter(actor)

        portenter.rollPortents().then(function(){
            const message = portenter.getMessage();
            ChatMessage.create({
                speaker: {alias: 'Portenter'},
                content: message,
                whisper: [],
                timestamp: Date.now()
             });
        });
 

    });
});


class Portenter {

    constructor(actor){
        this.actor = actor
        this.portents = []
        this.messageTable = [
            `"Signs Point to Yes!"`,
            `"It is certain.`,
            `"Outlook not so good`,
            `"WINNER WINNER CHICKEN DINNER! (Gain one free divination to be used right now)"`,
            `"Chance of Melons: High!"`,
            `"Everyone gets inspiration! You get an inspiration and YOU get an inspiration..."`,
            `"Oh no, Carric will die of dysentery! Wait, no, that was a smudge."`,
            `"One of us had some trouble sleeping last night, didn't they. (A random person gains one level of exhaustion)"`,
            `"Ask again later"`,
            `"A great evil has grown stronger this day (The DM gets an inspiration)"`
        ]
    }

    getMessage(){
        let randomMessage = this.fetchRandomMessage();
        let portents = this.getPortents();
        let message = `<i>Felicity gazes into crystal magic eight ball and reads aloud, ${randomMessage}</i><br><br>Your Daily Portents are: <b>${portents}</b>`
        return message
    }

    fetchRandomMessage(){
        let ranNum = Math.floor(Math.random() * this.messageTable.length)
        return this.messageTable[ranNum]
    }

    async clearPortents(){
        const consumables = this.actor.data.items.filter(i => i.name.includes('Portent:'));
        const deletions = consumables.map(i => i._id);
        let updated = await this.actor.deleteEmbeddedEntity("OwnedItem", deletions); // Deletes multiple EmbeddedEntity objects
        for(let i = 0; i<deletions.length; i++){
            await this.actor.deleteEmbeddedEntity('OwnedItem', deletions[i]._id)
        }
        this.portents = []
    }

    getPortents(){
        return this.portents;
    }

    async rollPortents(){
        await this.clearPortents()
        let ranNum;
        let item;
        for(let i = 0; i<2; i++){
            ranNum = Math.floor(1 + Math.random() * 20)
            this.portents.push(ranNum)
            item = {name: 'Portent: ' + ranNum, type: 'consumable'}
            await this.actor.createOwnedItem(item);

        }
        return this.portents
    }

}