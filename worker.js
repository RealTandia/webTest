class Worker {
    constructor(){   
        this.start_energy = 100;
        this.energy = this.start_energy;
        this.money = 0;
        this.depth = 0;
        this.item = 0;
        this.items = [{"ItemID":0,"ItemName":"1","ItemPrice":500,"ItemDiscription":"yes","EffectDiscription":"miusa","ItemOnable":0,"ItemRarity":"white","ItemPremise":[]},
                      {"ItemID":1,"ItemName":"2","ItemPrice":500,"ItemDiscription":"nice","EffectDiscription":"miusa","ItemOnable":0,"ItemRarity":"blue","ItemPremise":[]},
                      {"ItemID":2,"ItemName":"3","ItemPrice":500,"ItemDiscription":"good","EffectDiscription":"miusa","ItemOnable":0,"ItemRarity":"purple","ItemPremise":[]},
                      {"ItemID":3,"ItemName":"4","ItemPrice":500,"ItemDiscription":"yeah","EffectDiscription":"miusa","ItemOnable":0,"ItemRarity":"golden","ItemPremise":[0,1,2]}];
    }

    WorkEnergyConsume() {
        this.energy -= 3 + this.depth*0.5;
    }

    RelaxResourceConsume() {
        if(this.energy < 3+2*this.depth/10*this.depth/5) {
            this.money -= this.depth*5;
        }
        this.money -= 20 + (this.start_energy - this.energy) * 0.5
        this.energy = this.start_energy;
        if(this.money < 0) {
            this.money = 0;
        }
    }

    WorkMoneyObtain() {
        this.money += (5 + this.depth * 1.5);
    }

    ItemObtain(item) {
        this.items[item] = 1;
    }

    Work() {
        if(this.energy >= 3 + this.depth*0.5) {
            this.WorkEnergyConsume();
            this.WorkMoneyObtain();
            this.depth += 1;
        } else {
            this.Relax();
        }
        
    }

    Relax() {
        this.RelaxResourceConsume();
        this.depth = 0;
    }

    ItemDrop() {

    }
}