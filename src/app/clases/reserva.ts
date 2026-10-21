import { Cliente } from './cliente';
import { Mesa } from './mesa';

export class Reserva {
    public id: string;
    public mesa: Mesa;
    public cliente: Cliente;
    public pedido: any;//Tipo Pedido
    public isActive:boolean;
    public fecha:any;
    public hora:any;
    public timeStamp;
    public stringISO;
    public confirmada;
    public fechaInicio?: any;

    public constructor(init?: Partial<Reserva>) {
        if(init){
            Object.assign(this, init);
        }
    }

    public static CrearReserva( mesa: Mesa, cliente: Cliente,
        fecha:any, hora:any, timeStamp:number,
        id?: string) :Reserva {
        let reserva = new Reserva();
        
        reserva.id = id;
        reserva.mesa = mesa;
        reserva.cliente = cliente;

        reserva.fecha = fecha;
        reserva.hora = hora;
        reserva.timeStamp = timeStamp;
        

        return reserva;
    }


}