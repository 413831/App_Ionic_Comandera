import { Injectable } from '@angular/core';
import { Cliente, EstadoAceptacion } from '../clases/cliente';
import { Empleado, TipoEmpleado } from '../clases/empleado';
import { Imagen } from '../clases/imagen';
import { Jefe, TipoJefe } from '../clases/jefe';
import { Mesa, TipoMesa } from '../clases/mesa';
import { EstadoPedido, Pedido } from '../clases/pedido';
import { Producto } from '../clases/producto';
import { Usuario } from '../clases/usuario';
import { AuthService, USERS_TEST } from './auth.service';
import { ClienteService } from './cliente.service';
import { EmpleadoService } from './empleado.service';
import { JefeService } from './jefe.service';
import { MesaService } from './mesa.service';
import { PedidoService } from './pedido.service';
import { ProductoService } from './producto.service';

@Injectable({
  providedIn: 'root'
})
export class MockDataService
{
  constructor() {}

  /**
   * Obtiene un usuario mock tipado según el correo electrónico
   */
  public static obtenerUsuarioPorEmail(email: string, uid?: string): Usuario
  {
    const id = uid || `mock-${Date.now()}`;
    const mailLower = (email || '').toLowerCase().trim();

    if (mailLower === USERS_TEST.duenio.mail.toLowerCase())
    {
      return Jefe.CrearJefe(
        id,
        'Carlos',
        'Dueño',
        '30111222',
        Imagen.CrearImagen(id, '_', '/assets/img/icono_food.png', new Date().toISOString(), '_'),
        USERS_TEST.duenio.mail,
        true,
        TipoJefe.Dueno,
        '20-30111222-8'
      );
    }

    if (mailLower === USERS_TEST.supervisor.mail.toLowerCase())
    {
      return Jefe.CrearJefe(
        id,
        'Sofía',
        'Supervisora',
        '31222333',
        Imagen.CrearImagen(id, '_', '/assets/img/icono_food.png', new Date().toISOString(), '_'),
        USERS_TEST.supervisor.mail,
        true,
        TipoJefe.Supervisor,
        '27-31222333-4'
      );
    }

    if (mailLower === USERS_TEST.mozo.mail.toLowerCase())
    {
      return Empleado.CrearEmpleado(
        id,
        'Martín',
        'Mozo',
        '32333444',
        Imagen.CrearImagen(id, '_', '/assets/img/icono_food.png', new Date().toISOString(), '_'),
        USERS_TEST.mozo.mail,
        true,
        TipoEmpleado.Mozo,
        '20-32333444-9'
      );
    }

    if (mailLower === USERS_TEST.cocinero.mail.toLowerCase())
    {
      return Empleado.CrearEmpleado(
        id,
        'Lucas',
        'Cocinero',
        '33444555',
        Imagen.CrearImagen(id, '_', '/assets/img/icono_food.png', new Date().toISOString(), '_'),
        USERS_TEST.cocinero.mail,
        true,
        TipoEmpleado.Cocinero,
        '20-33444555-1'
      );
    }

    if (mailLower === USERS_TEST.bartender.mail.toLowerCase())
    {
      return Empleado.CrearEmpleado(
        id,
        'Brenda',
        'Bartender',
        '34555666',
        Imagen.CrearImagen(id, '_', '/assets/img/icono_food.png', new Date().toISOString(), '_'),
        USERS_TEST.bartender.mail,
        true,
        TipoEmpleado.Bartender,
        '27-34555666-3'
      );
    }

    if (mailLower === USERS_TEST.delivery.mail.toLowerCase())
    {
      return Empleado.CrearEmpleado(
        id,
        'Pedro',
        'Delivery',
        '35666777',
        Imagen.CrearImagen(id, '_', '/assets/img/icono_food.png', new Date().toISOString(), '_'),
        USERS_TEST.delivery.mail,
        true,
        TipoEmpleado.Delivery,
        '20-35666777-6'
      );
    }

    if (mailLower === USERS_TEST.cliente.mail.toLowerCase())
    {
      return Cliente.CrearCliente(
        id,
        'Juan',
        'Cliente',
        '38456123',
        Imagen.CrearImagen(id, '_', '/assets/img/icono_food.png', new Date().toISOString(), '_'),
        USERS_TEST.cliente.mail,
        true,
        EstadoAceptacion.Aceptado,
        { isWaiting: false, horario: null }
      );
    }

    // Por defecto retorna cliente aceptado
    return Cliente.CrearCliente(
      id,
      'Cliente',
      'Demo',
      '38000999',
      Imagen.CrearImagen(id, '_', '/assets/img/icono_food.png', new Date().toISOString(), '_'),
      email || 'cliente@mail.com',
      true,
      EstadoAceptacion.Aceptado,
      { isWaiting: false, horario: null }
    );
  }

  /**
   * Crea un cliente anónimo demo
   */
  public static crearClienteAnonimo(uid?: string): Cliente
  {
    const id = uid || `mock-anonimo-${Date.now()}`;
    return Cliente.CrearCliente(
      id,
      'Anónimo',
      'Demo',
      '0',
      Imagen.CrearImagen(id, '_', '/assets/img/icono_food.png', new Date().toISOString(), '_'),
      'anonimo@mail.com',
      true,
      EstadoAceptacion.Anonimo,
      { isWaiting: false, horario: null }
    );
  }

  /**
   * Inicializa todo el set de datos mock de productos, mesas, pedidos, jefes, empleados y clientes
   */
  public static inicializarDatosDemo()
  {
    // 1. Productos (Carta y Bebidas)
    if (!ProductoService.productos || ProductoService.productos.length === 0)
    {
      const defaultImg = '/assets/img/icono_food.png';
      ProductoService.productos = [
        // Platos (Cocina)
        Producto.CrearProducto('p1', 'Hamburguesa Completa', 'Medallón de carne con cheddar, bacon, lechuga y tomate con papas', [defaultImg, defaultImg, defaultImg], '15', 1800, TipoEmpleado.Cocinero, 'BEGIN:Producto:p1', true, true),
        Producto.CrearProducto('p2', 'Bife de Chorizo', 'Corte premium de 400g con papas rústicas y vegetales asados', [defaultImg, defaultImg, defaultImg], '25', 2800, TipoEmpleado.Cocinero, 'BEGIN:Producto:p2', true, true),
        Producto.CrearProducto('p3', 'Pizza Margherita', 'Masa madre, salsa pomodoro, mozzarella fior di latte y albahaca', [defaultImg, defaultImg, defaultImg], '20', 2200, TipoEmpleado.Cocinero, 'BEGIN:Producto:p3', true, false),
        Producto.CrearProducto('p4', 'Papas Rústicas Cheddar', 'Papas con salsa cheddar fundida, bacon crocante y ciboulette', [defaultImg, defaultImg, defaultImg], '12', 1200, TipoEmpleado.Cocinero, 'BEGIN:Producto:p4', true, true),
        Producto.CrearProducto('p5', 'Ensalada Caesar', 'Mix de hojas verdes, pollo grillé, croutons y aderezo caesar', [defaultImg, defaultImg, defaultImg], '10', 1500, TipoEmpleado.Cocinero, 'BEGIN:Producto:p5', true, true),

        // Bebidas (Barra)
        Producto.CrearProducto('b1', 'Cerveza Artesanal IPA', 'Cerveza rubia con amargor pronunciado y notas cítricas 500ml', [defaultImg, defaultImg, defaultImg], '3', 850, TipoEmpleado.Bartender, 'BEGIN:Producto:b1', true, true),
        Producto.CrearProducto('b2', 'Mojito Clásico', 'Ron blanco, hojas de menta fresca, jugo de lima y soda', [defaultImg, defaultImg, defaultImg], '5', 1200, TipoEmpleado.Bartender, 'BEGIN:Producto:b2', true, true),
        Producto.CrearProducto('b3', 'Fernet Branca con Coca', 'La clásica preparación argentina 70/30 en vaso grande', [defaultImg, defaultImg, defaultImg], '3', 1100, TipoEmpleado.Bartender, 'BEGIN:Producto:b3', true, true),
        Producto.CrearProducto('b4', 'Vino Malbec Copa', 'Copa de vino tinto selección especial de Mendoza', [defaultImg, defaultImg, defaultImg], '4', 950, TipoEmpleado.Bartender, 'BEGIN:Producto:b4', true, true),
        Producto.CrearProducto('b5', 'Limonada con Menta', 'Bebida refrescante sin alcohol con jengibre y menta fresca', [defaultImg, defaultImg, defaultImg], '5', 700, TipoEmpleado.Bartender, 'BEGIN:Producto:b5', true, true),
      ];
    }

    // 2. Mesas
    if (!MesaService.mesas || MesaService.mesas.length === 0)
    {
      const imgMesa = Imagen.CrearImagen('m1', '_', '/assets/img/icono_food.png', new Date().toISOString(), '_');
      MesaService.mesas = [
        Mesa.CrearMesa('1', 1, 4, TipoMesa.Normal, imgMesa, 'BEGIN:Mesa:1', true, true),
        Mesa.CrearMesa('2', 2, 2, TipoMesa.VIP, imgMesa, 'BEGIN:Mesa:2', true, true),
        Mesa.CrearMesa('3', 3, 6, TipoMesa.Normal, imgMesa, 'BEGIN:Mesa:3', false, true),
        Mesa.CrearMesa('4', 4, 4, TipoMesa.Discapacitados, imgMesa, 'BEGIN:Mesa:4', true, true),
      ];
    }

    // 3. Jefes
    if (!JefeService.jefes || JefeService.jefes.length === 0)
    {
      JefeService.jefes = [
        MockDataService.obtenerUsuarioPorEmail(USERS_TEST.duenio.mail, 'jefe-duenio-1') as Jefe,
        MockDataService.obtenerUsuarioPorEmail(USERS_TEST.supervisor.mail, 'jefe-super-2') as Jefe,
      ];
    }

    // 4. Empleados
    if (!EmpleadoService.empleados || EmpleadoService.empleados.length === 0)
    {
      EmpleadoService.empleados = [
        MockDataService.obtenerUsuarioPorEmail(USERS_TEST.mozo.mail, 'emp-mozo-1') as Empleado,
        MockDataService.obtenerUsuarioPorEmail(USERS_TEST.cocinero.mail, 'emp-coci-2') as Empleado,
        MockDataService.obtenerUsuarioPorEmail(USERS_TEST.bartender.mail, 'emp-bart-3') as Empleado,
        MockDataService.obtenerUsuarioPorEmail(USERS_TEST.delivery.mail, 'emp-deli-4') as Empleado,
      ];
    }

    // 5. Clientes
    if (!ClienteService.clientes || ClienteService.clientes.length === 0)
    {
      const clienteDemo = MockDataService.obtenerUsuarioPorEmail(USERS_TEST.cliente.mail, 'cli-demo-1') as Cliente;
      ClienteService.clientes = [
        clienteDemo,
        Cliente.CrearCliente('cli-demo-2', 'María', 'Gómez', '40123456', clienteDemo.foto, 'maria@mail.com', true, EstadoAceptacion.Aceptado, { isWaiting: false, horario: null }),
        Cliente.CrearCliente('cli-demo-3', 'Carlos', 'Pendiente', '35123999', clienteDemo.foto, 'carlos@mail.com', true, EstadoAceptacion.Pendiente, { isWaiting: true, horario: Date.now() }),
      ];
    }

    // 6. Pedidos
    if (!PedidoService.pedidos || PedidoService.pedidos.length === 0)
    {
      const clienteDemo = MockDataService.obtenerUsuarioPorEmail(USERS_TEST.cliente.mail, 'cli-demo-1') as Cliente;
      const mesa1 = MesaService.mesas[0];
      const mesa3 = MesaService.mesas[2];

      const pedido1 = Pedido.CrearPedido(
        'ped-1',
        clienteDemo,
        mesa1,
        [ProductoService.productos[0], ProductoService.productos[5]],
        Date.now() - 3600000,
        Date.now(),
        2650,
        EstadoPedido.SOLICITADO,
        true
      );
      pedido1.idMozo = 'emp-mozo-1';

      const pedido2 = Pedido.CrearPedido(
        'ped-2',
        clienteDemo,
        mesa3,
        [ProductoService.productos[1], ProductoService.productos[6]],
        Date.now() - 1800000,
        Date.now(),
        4000,
        EstadoPedido.EN_PROGRESO,
        true
      );

      PedidoService.pedidos = [pedido1, pedido2];
    }
  }

  /**
   * Loguea directamente en modo demo para portfolio y navegabilidad inmediata
   */
  public static loguearDemo(email: string, uid?: string): Usuario
  {
    this.inicializarDatosDemo();
    const usuario = this.obtenerUsuarioPorEmail(email, uid);
    AuthService.usuario = usuario;
    return usuario;
  }
}
