import { LocalStorage } from "pix0-core-ui";

export interface Jwt {

	jwt : string,

	date : number,
}

export class JWTStorage {

    private static key : string = "LocalJwtKey23";

    static get() {

        let p = LocalStorage.get(this.key);
        if ( p !== null) {

            let pp = null;

            try {
                pp = JSON.parse(p) as Jwt;
            }
            catch(e : any){}

            if ( pp === undefined || pp === null ){

                this.remove();
                return null;
            }
            //revoke if more than 1 hour
            if ((new Date().getTime() - pp.date) > (1000*60*60)){

                this.remove();
                return null;
            }
              
            return pp.jwt;
        }
        return p;
    }

    static set(jwt : string) {

        let jwtObj : Jwt = { jwt : jwt, date : new Date().getTime()};

        LocalStorage.set(this.key, JSON.stringify(jwtObj));
    }

    static remove(){
        LocalStorage.remove(this.key);
    }

}


interface CachedData {

    data : any,

    date : number, 
}


export const LOCAL_STORED_IP_TO_COUNTRY_CODE = "LastStoredIpToCountry";

export class LastStoredCache {

    static set(key : string, data : any ) {

        let Obj :CachedData  = { data : data, date : new Date().getTime()};

        LocalStorage.set(key, JSON.stringify(Obj));
    }


    static get(key : string , expiryTime: number = (1000*60*60*24)) {

        let p = LocalStorage.get(key);
        if ( p !== null) {

            let pp = null;

            try {
                pp = JSON.parse(p) as CachedData
            }
            catch(e : any){}

            if ( pp === undefined || pp === null ){

                this.remove(key);
                return null;
            }
            //revoke if more than 1 day
            if ((new Date().getTime() - pp.date) > expiryTime){

                this.remove(key);
                return null;
            }
              
            return pp.data;
        }
        return p;
    }

    static remove(key : string ){
        LocalStorage.remove(key);
    }

}