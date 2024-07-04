export class ParameterType implements IParameterType {
    id: number = 0;
    name: string = "";
    min_value: number = 0;
    max_value: number = 0;
    description: string = "";

}

export interface IParameterType {
    id: number;
    name: string;
    min_value: number;
    max_value: number;
    description: string;
}