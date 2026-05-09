export class Queue {

    constructor(){
        this.items = {}             // Objeto {}, items = { 0: "a", 1: "b", 2: "c" }
        this.frontIndex = 0
        this.backIndex = 0
    }

    // Añadir un elemento al final (Enqueue)
    enqueue(item){
        this.items[this.backIndex] = item;
        this.backIndex++;
    }

    // Eliminar elemento del frente (Dequeue)
    dequeue(){

        if(this.isEmpty()) return undefined;
        const item = this.items[this.frontIndex];
        delete this.items[this.frontIndex];
        this.frontIndex++;

        return item;
    }

    // Ver el primero sin eliminarlo (peek)
    peek(){
        return this.items[this.frontIndex];
    }

    // Verificar si una cola está vacía
    isEmpty(){
        return this.backIndex - this.frontIndex === 0;
    }

    // Devuelve el tamaño de la cola
    size(){
        return this.backIndex - this.frontIndex;
    }



}