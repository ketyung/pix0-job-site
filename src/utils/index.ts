import { PhoneNumberUtil } from 'google-libphonenumber';
import countryCodesFromJson from '@/models/country_dial_info.json';
import { SearchResult } from '@/models';

export function copyToClipboard(text : string ) {
    // Create a temporary textarea element
    const textArea = document.createElement("textarea");
  
    // Set the text to be copied
    textArea.value = text;
  
    // Append the textarea to the document
    document.body.appendChild(textArea);
  
    // Select the text in the textarea
    textArea.select();
  
    try {
      // Copy the selected text to the clipboard
      document.execCommand("copy");
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  
    // Remove the temporary textarea
    document.body.removeChild(textArea);
}
  
// Function to get all cases of an enum
export const getAllEnumValues = <T extends Record<string, string | number>>(enumObj: T): T[keyof T][] => {
  return Object.values(enumObj).filter(value => typeof value === "string" || typeof value === "number") as T[keyof T][];
};

export function isWeakPassword(password?: string): boolean {
    // Check if the password is too short
    if (password === undefined || (password?.length ?? 0)< 8) {
        return true;
    }

    // Check if the password contains only letters or only numbers
    if (/^[a-zA-Z]+$/.test(password) || /^[0-9]+$/.test(password)) {
        return true;
    }

    // Check if the password is a common weak password
    const weakPasswords = [
        'password',
        '123456',
        'qwerty',
        // Add more common weak passwords here
    ];
    if (weakPasswords.includes(password.toLowerCase())) {
        return true;
    }

    // If none of the above conditions are met, the password is not weak
    return false;
}


export function isValidEmail(email?: string|null ): boolean {

  if ( email === undefined) return false;

  if ( email === null) return false;

  // Regular expression for validating email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test the email against the regular expression
  return emailRegex.test(email);
}


export function isValidPhoneNumber(phoneNumber?: string|null): boolean {

  if (phoneNumber === undefined) return false;
  
  if ( phoneNumber === null) return false;

  try {

      return PhoneNumberUtil.getInstance().isValidNumber(PhoneNumberUtil.getInstance().parse(phoneNumber));

  }catch(e:any) {
      return false;
  }
 
    /*
    // Regular expression for validating phone numbers
    const phoneRegex = /^\+?\d{1,3}[- ]?\d{3,}$/;

    // Test the phone number against the regular expression
    return phoneRegex.test(phoneNumber);
    */
}

export function isBlank (text? : string|null) : boolean {

  if ( text === undefined) return true;

  if ( text === null) return true;

  return (text.trim() === "");

}

export function generateRandomString(length: number = 20): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
  }

  return result;
}


export function extractProps(struct : any , excludes: string[]): any {
	const extractedData: any = {};
	const propertyNames = Object.keys(struct);
  
	for (const propertyName of propertyNames) {
	  if (!excludes.includes(propertyName)) {
		extractedData[propertyName] = struct[propertyName];
	  }
	}
  
	return extractedData;
}

export function ntb(text : string|null|undefined){

    return (text===undefined || text=== null) ? "" : text;
}


export function ntu(obj : any|null){
    return (obj === null) ? undefined : obj;
}

export function getPageOffsetAndLimit(pageNumber: number, rowsPerPage: number): { offset: number, limit: number } {
    const offset = (pageNumber - 1) * rowsPerPage;
    const limit = rowsPerPage;
    return { offset, limit };
}


const phoneUtil = PhoneNumberUtil.getInstance();

export function removeDialCode (phoneNumber : string) {

    let dialCode = getDialCode(phoneNumber);
    if ( dialCode )
      return phoneNumber.replace(dialCode, "");
    return phoneNumber;
}


function getDialCodeByRegion(regCode: string ){

    let c = countryCodesFromJson.filter(cc=>{
        return cc.code === regCode;
    })

    if ( c.length >0) {
        return c[0].dial_code;
    }else {
        return undefined;
    }
}

export function getDialCode(phoneNumber : string ) {
    try {
        const parsedNumber = phoneUtil.parse(phoneNumber, 'ZZ'); // 'ZZ' is the default region
        //const countryCode = parsedNumber.getCountryCode();
        const regionCode = phoneUtil.getRegionCodeForNumber(parsedNumber);
        
        if ( regionCode) {

            let dialCode  = getDialCodeByRegion(regionCode);
            
            if ( dialCode) return dialCode;
            
            dialCode = `+${phoneUtil.getCountryCodeForRegion(regionCode)}`;
            //console.log("dial::reg::Code::", dialCode, regionCode);
   
            return dialCode;
     
        }
    } catch (error) {
        console.error('Error parsing phone number:', error);
        return null;
    }
}

export function toTotalPages(searchRes : SearchResult): number {
    let x = (searchRes.total ?? 0);
    let y = (searchRes.rowsPerPage ?? 10)
    const quotient = Math.floor(x / y );
    const remainder = x % y;
    let t = quotient + (remainder > 0 ? 1 : 0);
    return t; 
}

export function shortenString(input: string, maxLength: number = 20): string {
    if (input.length <= maxLength) {
        return input;
    }

    const prefixLength = Math.floor((maxLength - 3) / 2);
    const suffixLength = maxLength - prefixLength - 3;
    const prefix = input.slice(0, prefixLength);
    const suffix = input.slice(input.length - suffixLength);

    return `${prefix}...${suffix}`;
}



export const shortenStringTo = (str : string, length : number = 32, strInBetween : string = "...") => {

    if ( str.length <= length){
        return str ;
    }

    const halfLen = length / 2;

	return (
		str.substring(0, halfLen) + (strInBetween ? strInBetween : "") + 
		str.substring(str.length - halfLen, str.length)
	);
};


export function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export function padNum(num : number, numOfPads = 4) {
    return `${num}`.padStart(numOfPads, "0");
}


export const randomInt = (min : number, max : number) =>{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); 
}