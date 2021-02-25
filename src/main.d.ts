declare var jsonElements: {
    name: string;
    category: string;
    number: number;
    symbol: string;
    xpos: number;
    ypos: number;
    source: string;
    atomicMass: number;
    firstIonizationEnergy: number | null;
    electronAfinity: number | null,
    electronegativity: number | null,
    locales: {
        fr: {
            name: string;
            source: string;
        };
        es: {
            name: string;
            source: string;
        };
    };
}[];
export default jsonElements;
