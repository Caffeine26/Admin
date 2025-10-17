export interface Tables{
    id: number,
    table_number: number,
    location_des: string,
    status?: 'reserved'| 'available',
    qr_code: string,
}

export type CreateTable = Omit<Tables, 'id'>;