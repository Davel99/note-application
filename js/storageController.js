class storageCtrl {
    constructor() {

    }

    set(name, value, stringify = false){
        if(stringify){
            localStorage.setItem(name, JSON.stringify(value));
        } else {
            localStorage.setItem(name,value);
        }
        return true;
        
    }

    delete(item) {
        localStorage.removeItem(item);
        return true;
    }

    get(item, JSONparsed = false) {
        if (JSONparsed) {
            return JSON.parse(localStorage.getItem(item));
        } else {
            return localStorage.getItem(item);
        }

    }

    keyExists(key){
        let keys = Object.keys(localStorage);
        let comp = false;
        keys.forEach(element =>{
            if(element == key){
                comp = true;
            }
        });

        if(comp == true){
            return true;
        } else {
            return false;
        }

        

    }

    getAllStorage(JSONparsed = false) {
        let values = [], keys = Object.keys(localStorage), i = keys.length;
            while (i--) {
                if(JSONparsed){
                    values.push(JSON.parse(localStorage.getItem(keys[i])));
                } else {
                    values.push(localStorage.getItem(keys[i]));  
                }
            }

        return values;
    }

}
