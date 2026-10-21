import { Injectable } from '@angular/core';
import { IEscaneable } from '../interfaces/IEscaneable';
import { ImagenService } from './imagen.service';
import { Imagen } from '../clases/imagen';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx/';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';

export enum Formato
{
  PDF_417 = "PDF_417", // Formato del DNI
  QR_CODE = "QR_CODE"  // Formato de QR común 
}

@Injectable({
  providedIn: 'root'
})
export class CodigoQRService
{

  constructor(
    private barcodeScanner: BarcodeScanner,
    private imagenService: ImagenService,
    private platform: Platform,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  )
  { }

  /**
   * Método para leer un código QR (con fallback web interactivo para portfolio/Vercel)
   * @param prompt Mensaje para mostrar al Usuario
   * @param formats Formato de lectura : PDF_417 , QR_CODE
   * @returns Retorna la informacion del QR como string
   */
  public async escanear(prompt: string, formats: string): Promise<BarcodeScanResult>
  {
    console.log("Leer QR");

    if (this.platform.is('cordova') || this.platform.is('capacitor'))
    {
      try
      {
        let scannerOpts: BarcodeScannerOptions = {
          prompt,
          formats,
          showTorchButton: true,
        };

        const scan = await this.barcodeScanner.scan(scannerOpts);
        if (scan && scan.text)
        {
          return scan;
        }
      }
      catch (error)
      {
        console.warn("Scanner nativo no disponible, ejecutando simulador web:", error);
      }
    }

    return await this.simularEscaneoWeb(formats);
  }

  /**
   * Simulador web interactivo para probar el flujo de la aplicación sin cámara nativa
   */
  private async simularEscaneoWeb(formats: string): Promise<BarcodeScanResult>
  {
    return new Promise<BarcodeScanResult>(async (resolve) =>
    {
      if (formats === Formato.PDF_417 || formats === 'PDF_417')
      {
        const actionSheet = await this.actionSheetController.create({
          header: 'Simular Lectura de DNI (Modo Web)',
          buttons: [
            {
              text: 'DNI: Juan Pérez (38456123)',
              handler: () => resolve({
                text: '00000000000@PEREZ@JUAN CARLOS@M@38456123@A@01/01/1990@01/01/2015@200',
                format: 'PDF_417',
                cancelled: false
              })
            },
            {
              text: 'DNI: María Gómez (40123456)',
              handler: () => resolve({
                text: '00000000000@GOMEZ@MARIA@F@40123456@B@15/05/1995@15/05/2017@200',
                format: 'PDF_417',
                cancelled: false
              })
            },
            {
              text: 'Ingresar DNI manualmente...',
              handler: async () =>
              {
                const alert = await this.alertController.create({
                  header: 'Ingresar DNI',
                  inputs: [
                    { name: 'apellido', placeholder: 'Apellido', value: 'Perez' },
                    { name: 'nombre', placeholder: 'Nombre', value: 'Juan' },
                    { name: 'dni', placeholder: 'Número de DNI', value: '38456123' },
                  ],
                  buttons: [
                    {
                      text: 'Cancelar',
                      role: 'cancel',
                      handler: () => resolve({ text: '', format: 'PDF_417', cancelled: true })
                    },
                    {
                      text: 'Aceptar',
                      handler: (data) =>
                      {
                        const text = `00000000000@${data.apellido || 'Perez'}@${data.nombre || 'Juan'}@M@${data.dni || '38456123'}@A@01/01/1990@01/01/2015@200`;
                        resolve({ text, format: 'PDF_417', cancelled: false });
                      }
                    }
                  ]
                });
                await alert.present();
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => resolve({ text: '', format: 'PDF_417', cancelled: true })
            }
          ]
        });
        await actionSheet.present();
      }
      else
      {
        const actionSheet = await this.actionSheetController.create({
          header: 'Simular Código QR (Modo Web)',
          buttons: [
            {
              text: '🚪 Ingreso al Local',
              handler: () => resolve({ text: 'BEGIN:Ingreso:local', format: 'QR_CODE', cancelled: false })
            },
            {
              text: '🪑 Mesa 1',
              handler: () => resolve({ text: 'BEGIN:Mesa:1', format: 'QR_CODE', cancelled: false })
            },
            {
              text: '🪑 Mesa 2',
              handler: () => resolve({ text: 'BEGIN:Mesa:2', format: 'QR_CODE', cancelled: false })
            },
            {
              text: '🪑 Mesa 3',
              handler: () => resolve({ text: 'BEGIN:Mesa:3', format: 'QR_CODE', cancelled: false })
            },
            {
              text: '💵 Propina 10%',
              handler: () => resolve({ text: 'BEGIN:Propina:10', format: 'QR_CODE', cancelled: false })
            },
            {
              text: '💵 Propina 15%',
              handler: () => resolve({ text: 'BEGIN:Propina:15', format: 'QR_CODE', cancelled: false })
            },
            {
              text: '💵 Propina 20%',
              handler: () => resolve({ text: 'BEGIN:Propina:20', format: 'QR_CODE', cancelled: false })
            },
            {
              text: '✏️ Ingresar QR manual...',
              handler: async () =>
              {
                const alert = await this.alertController.create({
                  header: 'Ingresar Código QR',
                  inputs: [
                    { name: 'codigo', placeholder: 'Ej: BEGIN:Mesa:1', value: 'BEGIN:Mesa:1' }
                  ],
                  buttons: [
                    {
                      text: 'Cancelar',
                      role: 'cancel',
                      handler: () => resolve({ text: '', format: 'QR_CODE', cancelled: true })
                    },
                    {
                      text: 'Aceptar',
                      handler: (data) => resolve({ text: data.codigo, format: 'QR_CODE', cancelled: false })
                    }
                  ]
                });
                await alert.present();
              }
            },
            {
              text: 'Cancelar',
              role: 'cancel',
              handler: () => resolve({ text: '', format: 'QR_CODE', cancelled: true })
            }
          ]
        });
        await actionSheet.present();
      }
    });
  }

  /**
   * Método para generar QR
   * @param elemento Objeto con data para generar QR
   * @param id UID que identificará al objeto
   */
  public async generar(elemento: IEscaneable, id: string)
  {
    console.log(elemento);

    let data = `BEGIN:${elemento.constructor.name}%3A${id}`;
    let carpeta = elemento.constructor.name.toLowerCase();

    // Se genera el código QR (vía HTTPS para evitar bloqueo de contenido mixto en Vercel)
    const ruta = `https://api.qrserver.com/v1/create-qr-code/?data=${data}&size=300x300&format=svg`;
    // Se convierte URL del código en string BASE64
    const base64 = await this.convertirUrlABase64(ruta, "image/jpeg");
    // Se crea Imagen y se guarda en Storage
    let imagen = Imagen.CrearImagen(id, base64.slice(23), "_", new Date().toUTCString(), "_");
    const imagenQR = await this.imagenService.guardarImagen(imagen, `qr-${carpeta}`);
    // Se asocia URL del código QR 
    elemento.codigoQR = await imagenQR.ref.getDownloadURL();

  }

  /**
   * Método para convertir URL de imagen en string base64
   * @param url Ruta de la imagen para convertir en base64
   * @param outputFormat Formato de la imagen
   */
  convertirUrlABase64(url, outputFormat)
  {
    return new Promise<string>((resolve, reject) =>
    {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function ()
      {
        let canvas = <HTMLCanvasElement>document.createElement('CANVAS');
        let ctx = canvas.getContext('2d');
        let dataURL: string;

        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        //callback(dataURL);
        canvas = null;
        resolve(dataURL);
      };
      img.src = url;
    });
  }

}
