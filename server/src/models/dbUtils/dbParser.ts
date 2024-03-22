
export class dbParser {

    /**
     * Dado un valor entero o de tipo string, lo parsea correctamente para insertarlo en la db
     */
    public static parseNumber(d: any): number | null {

        // si el valor no está correctamente definido 
        if (d === null || d === undefined || d === '') {
            return null;
        }

        switch (typeof (d)) {
            // si el tipo de dato ya es number, se devuelve tal como es
            case "number":
                return d;

            // si el tipo de dato ya es string 
            case "string":
                // parse using Number primero que es mas estricto
                if (!isNaN(Number(d))) {
                    return Number(d);
                }

                // parse using parseFloat 
                if (!isNaN(parseFloat(d))) {
                    return parseFloat(d);
                }

                // parser using parseInt
                if (!isNaN(parseInt(d))) {
                    return parseInt(d);
                }

                // si el tipo es string pero no se pudo parsear retorno null
                console.error(`No se pudo parsear el valor '${d}' al tipo number. Se devolvió null`);
                return null;

            // si el tipo es boolean true en 1, el resto en 0
            case "boolean":
                return d === true ? 1 : 0;

            // otro tipo de objeto se logea y pasa a null
            case "object":
            case "symbol":
            case "function":
            case "undefined":
            default:
                // si el tipo es string pero no se pudo parsear retorno null
                console.error(`No se pudo parsear el valor '${d}' de tipo '${typeof d}' al tipo double. Se devolvió null`);
                return null;
        }
    }
}