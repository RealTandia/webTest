class Worker {
    constructor(){   
        this.start_energy = 100;
        this.energy = this.start_energy;
        this.money = 0;
        this.depth = 0;
        this.items = [{"ItemID":0,"ItemName":"1","ItemDiscription":"None","ItemOnable":0},
                      {"ItemID":1,"ItemName":"2","ItemDiscription":"None","ItemOnable":0}];
    }

    WorkEnergyConsume() {

    }

    RelaxMoneyConsume() {

    }

    WorkMoneyObtain() {

    }

    ItemObtain(item) {
        this.items[item] = 1;
    }

    Work() {
        this.energy -= 3 + this.depth*0.5;
        this.money += 5;
        this.depth += 1;
    }

    Relax() {
        this.money -= 10 + this.depth*1.5;
        this.energy = this.start_energy;
        this.depth = 0;
    }
}