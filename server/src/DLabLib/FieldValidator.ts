export class FieldValidator {
    constructor() { }

    validatePhone(number: string): boolean {
        //8 dígitos que empiezan con 2, 4 y 8
        //9 digitos que empiezan con 09
        //3, 4 digitos que empiezan con 1
        var uruguayPhones = /(^09\d{7}$)|(^[2|4|8]\d{7}$)|(^1\d{2,3}$)/g;
        return uruguayPhones.test(number);
    }

    validateCI(ci: string): boolean {
        ci = this.clean_ci(ci);
        let dig: number = parseInt(ci[ci.length - 1]);
        if (ci) {
            ci = ci.replace(/[0-9]$/, '');
        }
        return (dig == this.validation_digit(ci));
    }

    private validation_digit(ci: string): number {
        var a = 0;
        var i = 0;
        if (ci.length <= 6) {
            for (i = ci.length; i < 7; i++) {
                ci = '0' + ci;
            }
        }
        for (i = 0; i < 7; i++) {
            a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
        }
        if (a % 10 === 0) {
            return 0;
        } else {
            return 10 - a % 10;
        }
    }

    random_ci(): string {
        var ci = Math.floor(Math.random() * 10000000).toString();
        ci = ci.substring(0, 7) + this.validation_digit(ci);
        return ci;
    }

    private clean_ci(ci: string): string {
        return ci.replace(/\D/g, '');
    }
}