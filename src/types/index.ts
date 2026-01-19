export interface Depot {
    id: string;
    name: string;
    state: string;
    district: string;
    tlName: string;
    tlNumber: string;
    address: string;
    mapLink: string;
}

export type DepotState = 'All' | 'Bihar' | 'Jharkhand';
