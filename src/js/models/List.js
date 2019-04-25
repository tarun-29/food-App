import uinqid from 'uniqid'

export default class List {
    constructor(){
        this.items = [];
    }

    addItem (count, unit, ingredient){
        const item = {
            id : uinqid(),
            count,
            unit, 
            ingredient
        }
        this.items.push(item);
        return item
    }

    deleteItem(id){
        const index =  this.item.findIndex(el=>el.id===id)
        this.items.splice(index, 1);
    }
    upadateCount(id, newCount){
        this.items.find(el=> el.id === id).count = newCount //find index return index but find return element
    }
}