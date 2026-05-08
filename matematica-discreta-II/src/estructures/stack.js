export class Queue {

    constructor() {
        this.items = []          
    }

    // Añadir un elemento a la pila (top)
    push(item) {
        this.items.push(item)
    }   

    // Elimina y retorna el último elemento (top)
    pop(){
        if(this.isEmpty()) return undefined;
        return this.items.pop()
    }

    // Muestra el último elemento sin eliminarlo
    peek() {
        return this.items[this.items.length - 1];
    }

    // Verificar si una pila está vacía
    isEmpty() {
        return this.items.length === 0 ;
    }

    // Devuelve el tamaño de la pila
    size() {
        return this.items.length
    }

    clear(){
        this.items = []
    }


}