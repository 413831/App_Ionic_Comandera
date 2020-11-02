import { Producto } from './producto';

export enum EstadoPedido
{
    SOLICITADO = "Solicitado", // Cliente solicita pedido 
    PENDIENTE = "Pendiente", // Pedido confirmado por mozo 
    EN_PROGRESO = "En progreso", // Recibido por cocina y barra
    ENTREGADO = "Entregado", // Recibido en mesa
    CERRADO = "Cerrado", // Cobrado
}

export class Pedido
{
    id: string;
    productos: Producto[];
    valorTotal: number;
    estado: EstadoPedido;
    isActive: boolean;

    constructor()
    {
        this.estado = EstadoPedido.SOLICITADO;
        this.productos = [];
    }

    public static CrearPedido(id: string, productos: Producto[], valorTotal: number,
        estado: EstadoPedido, isActive: boolean)
    {
        let pedido = new Pedido();

        pedido.id = id;
        pedido.productos = productos;
        pedido.valorTotal = valorTotal;
        pedido.estado = estado;
        pedido.isActive = isActive;

        return pedido
    }

    public calcularTotal()
    {
        this.valorTotal = 0;

        this.productos.forEach(producto =>
        {
            this.valorTotal = this.valorTotal + producto.precio;
        });
        return this.valorTotal;
    }

    public cambiarEstado()
    {
        switch (this.estado)
        {
            case EstadoPedido.PENDIENTE:
                this.estado = EstadoPedido.EN_PROGRESO;
                break;
            case EstadoPedido.EN_PROGRESO:
                this.estado = EstadoPedido.ENTREGADO;
                break;
            case EstadoPedido.ENTREGADO:
                this.estado = EstadoPedido.CERRADO;
                break;
        }
    }
}