class Worker {
    constructor(){   
        this.start_energy = 100;
        this.energy = this.start_energy;
        this.money = 0;
        this.depth = 0;
        this.max_depth = 0;
        this.item = 0;
        this.items = [{"ItemID":0,"ItemName":"笔记本","ItemPrice":100,"ItemDiscription":"普通的笔记本","EffectDiscription":"写字用","ItemOnable":0,"ItemRarity":10,"ItemPremise":[]},
                      {"ItemID":1,"ItemName":"水杯","ItemPrice":100,"ItemDiscription":"可以容纳400ml水","EffectDiscription":"只接水，不泡茶","ItemOnable":0,"ItemRarity":10,"ItemPremise":[]},
                      {"ItemID":2,"ItemName":"抱枕","ItemPrice":500,"ItemDiscription":"休息起来更舒服","EffectDiscription":"每次工作消耗的体力减少0.1","ItemOnable":0,"ItemRarity":5,"ItemPremise":[]},
                      {"ItemID":3,"ItemName":"有线耳机","ItemPrice":100,"ItemDiscription":"工作会议专用","EffectDiscription":"开会不戴耳机还是不太好","ItemOnable":0,"ItemRarity":10,"ItemPremise":[]},
                      {"ItemID":4,"ItemName":"蓝牙耳机","ItemPrice":100,"ItemDiscription":"没有线，这下摸鱼也能用了","EffectDiscription":"摸鱼是没有意义的，只有加班才能实现价值","ItemOnable":0,"ItemRarity":10,"ItemPremise":[3]},
                      {"ItemID":5,"ItemName":"人体工学椅","ItemPrice":100,"ItemDiscription":"据说能保护脊椎","EffectDiscription":"保护了个寂寞","ItemOnable":0,"ItemRarity":10,"ItemPremise":[]},
                      {"ItemID":6,"ItemName":"防蓝光显示器","ItemPrice":500,"ItemDiscription":"保护眼睛后，眼睛就能更好地逛淘宝了","EffectDiscription":"每次工作获得道具的概率提升","ItemOnable":0,"ItemRarity":10,"ItemPremise":[]},
                      {"ItemID":7,"ItemName":"折叠床","ItemPrice":500,"ItemDiscription":"加班生存必备","EffectDiscription":"休息时回复每点体力需要的金钱减少0.05","ItemOnable":0,"ItemRarity":5,"ItemPremise":[2]},
                      {"ItemID":8,"ItemName":"定制键盘","ItemPrice":500,"ItemDiscription":"敲键盘更快了，指水群的时候","EffectDiscription":"工作时获得高收入的概率提高","ItemOnable":0,"ItemRarity":5,"ItemPremise":[]},
                      {"ItemID":9,"ItemName":"红虎饮料","ItemPrice":500,"ItemDiscription":"不如麦动好喝","EffectDiscription":"初始能量+5","ItemOnable":0,"ItemRarity":5,"ItemPremise":[]},
                      {"ItemID":10,"ItemName":"小游戏","ItemPrice":100,"ItemDiscription":"5分钟一局,摸鱼专用,但我从没用过","EffectDiscription":"摸鱼当然没有用","ItemOnable":0,"ItemRarity":10,"ItemPremise":[]},
                      {"ItemID":11,"ItemName":"显眼工位","ItemPrice":500,"ItemDiscription":"加班很容易被领导看到","EffectDiscription":"每工作一小时的收入提高0.3","ItemOnable":0,"ItemRarity":5,"ItemPremise":[0,1,2,3]}];
    }

    WorkEnergyConsume() {
        this.energy -= 3 + this.depth*0.5 + 0.1*this.items[2]["ItemOnable"];
    }

    RelaxResourceConsume() {
        if(this.energy < 3+2*this.depth/10*this.depth/5) {
            this.money -= this.depth*5;
        }
        this.money -= 20 + (this.start_energy - this.energy) * (0.5 - 0.05*this.items[7]["ItemOnable"])
        this.energy = this.start_energy + 5*this.items[9]["ItemOnable"];
        if(this.money < 0) {
            this.money = 0;
        }
    }

    WorkMoneyObtain() {
        let obtained_money = 5 + this.depth * 1.5 + 0.3*this.items[11]["ItemOnable"];
        this.money += obtained_money;
        SendMessage("赚了" + obtained_money + "块");
    }

    ItemObtain(item) {
        this.items[item] = 1;
    }

    ItemPoolGenerate() {
        let item_pool = [];
        let item_flag = 1;
        for(let item_id = 0;item_id < this.items.length;item_id++) {        //对于所有道具
            for(let item_primise in this.items[item_id]["ItemPremise"]) {       //遍历道具获取前提
                if(this.items[item_primise]["ItemOnable"] == 0) {           //如果有前提不满足就排除
                    item_flag = 0;
                }
            }
            if((item_flag == 1) && (this.items[item_id]["ItemOnable"] == 0)) {      //如果所有前提满足且未拥有则加入道具池
                item_pool.push(item_id);
            }
            item_flag = 1;
        }
        return item_pool;
    }

    DoWorkItemObtain(obj) {
        $('#ItemChooseModal').modal('hide');
        this.item = window.event.target.title;
        this.items[this.item]["ItemOnable"] = 1;
        SendMessage("获得物品" + this.items[this.item]["ItemName"]);
    }

    WorkItemObtain() {
        let item_pool = this.ItemPoolGenerate();
        let lottery_pool = []; 
        let choose_pool = [];
        let chosen_num = 0;
        let chosen_item = 0;
        let modal_body = document.getElementById("ItemChooseModalBody");

        if(item_pool.length > 0) {
            for(let item_id in item_pool) {     //道具的概率参数是n，则往奖池里加入n个该道具
                for(let num = 0;num < this.items[item_pool[item_id]]["ItemRarity"];num++) {
                    lottery_pool.push(item_pool[item_id]);
                }
            }
            
            for(let item_count=0;item_count<3;item_count++) {
                chosen_num = Math.round((lottery_pool.length - 1)*Math.random())
                chosen_item = lottery_pool[chosen_num];  //从奖池抽道具供选择
                choose_pool.push(chosen_item);
                //已抽出的道具不在池子中再出现
                while(lottery_pool.indexOf(chosen_item) != -1) {
                    lottery_pool.splice(lottery_pool.indexOf(chosen_item),1);
                }  
                if(lottery_pool.length == 0) {
                    break;
                }
            }
            

            $('#ItemChooseModal').modal('show');
            modal_body.innerHTML = null;
            
            //生成道具选项
            for(let show_item=0;show_item<choose_pool.length;show_item++) {
                let item_color = this.GetRarity(this.items[choose_pool[show_item]]["ItemRarity"]);
                modal_body.insertAdjacentHTML("beforeend",'<div class="btn btn-outline-' + item_color + '" title=' + this.items[choose_pool[show_item]]["ItemID"] + ' onclick="worker.DoWorkItemObtain(this)">' + this.items[choose_pool[show_item]]["ItemName"] + '</div>');
            }
            
        }
    }

    GetRarity(item_rarity) {
        let item_color;
        if(item_rarity >= 10) {
            item_color = "secondary";
        } else if(item_rarity < 10 && item_rarity >= 5) {
            item_color = "primary";
        } else if(item_rarity < 5 && item_rarity >= 2) {
            item_color = "warning";
        } else if(item_rarity < 2 && item_rarity >= 1) {
            item_color = "danger";
        }
        return item_color;
    }

    //工作，消耗体力，获取金钱与道具
    Work() {
        if(this.energy >= 3 + this.depth*0.5) {
            if(Math.random() > 0.7) {
                this.WorkItemObtain();      //30%概率获得物品
            }
            this.WorkEnergyConsume();
            this.WorkMoneyObtain();
            this.depth += 1;
        } else {
            this.Relax();
        }

        if(this.depth > this.max_depth) {
            this.max_depth = this.depth;
        }    
    }

    Relax() {
        this.RelaxResourceConsume();
        this.depth = 0;
    }

}