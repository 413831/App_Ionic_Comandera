export class Imagen
{
    id: string;
    url: string;
    base64: string;
    fecha: string;
    rutaStorage?: string;

    public static CrearImagen(id: string, base64: string, url: string, fecha: string, rutaStorage: string)
    {
        let imagen = new Imagen();

        imagen.id = id;
        imagen.base64 = base64;
        imagen.url = url;
        imagen.fecha = fecha;
        imagen.rutaStorage = rutaStorage;

        return imagen;
    }
}