const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const { admin } = require('./firebase-config');
const nodemailer = require("nodemailer");
require('dotenv').config();
const app = express();

app.use(bodyparser.json());
app.use(cors());

app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
        req.url = req.url.replace(/^\/api/, '') || '/';
    }
    next();
});

// app.use((req, res, next) =>
// {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');

//     // app.options('*', (req, res) =>
//     // {
//     //     // allowed XHR methods  
//     //     res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
//     //     res.send();
//     // });
//     next();
// })


const port = 5000
const notification_options = {
    priority: "normal",
    timeToLive: 60 * 60 * 24
};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

app.get('/', function (req, res) {
    res.send('Servidor dedicado a las notificaciones del proyecto "La Comandera"');
});

app.get('/test', function (req, res) {
    const options = notification_options;
    const payload = {
        notification: {
            title: 'Testing',
            body: 'Testeando'
        },
    }
    console.log("TEST");
    console.log(req);

    admin.messaging().sendToTopic('jefes', payload, options)
        .then(response => {
            //res.status(200).send("Notification sent successfully");
            res.status(200).send("Notification sent successfully")
        })
        .catch(error => {
            console.log(error);
        });
});

app.post('/jefes', function (req, res) {
    const options = notification_options;
    const payload = req.body;

    console.log("JEFES");
    console.log(req);
    console.log(payload);
    console.log(res);

    admin.messaging().sendToTopic('jefes', payload, options)
        .then(() => {
            //res.status(200).send("Notification sent successfully");
            res.status(200).send("Notification sent successfully");
        })
        .catch(error => {
            console.log(error);
        });
});

app.post('/cocineros', function (req, res) {
    const options = notification_options;
    const payload = req.body;

    console.log(payload);

    admin.messaging().sendToTopic('cocineros', payload, options)
        .then(response => {
            res.status(200).send("Notification sent successfully")
        })
        .catch(error => {
            console.log(error);
        });
});

app.post('/bartenders', function (req, res) {
    const options = notification_options;
    const payload = req.body;

    console.log(payload);

    admin.messaging().sendToTopic('bartenders', payload, options)
        .then(response => {
            res.status(200).send("Notification sent successfully")
        })
        .catch(error => {
            console.log(error);
        });
});

app.post('/mozos', function (req, res) {
    const options = notification_options;
    const payload = req.body;

    console.log(payload);

    admin.messaging().sendToTopic('mozos', payload, options)
        .then(response => {
            res.status(200).send("Notification sent successfully")
        })
        .catch(error => {
            console.log(error);
        });
});

app.post('/mensaje', function (req, res) {
    const options = notification_options;
    const payload = req.body;

    console.log(payload);

    admin.messaging().send(payload)
        .then(response => {
            res.status(200).send("Notification sent successfully")
        })
        .catch(error => {
            console.log(error);
        });
});


app.post('/email', function (req, res) {
    const destinatario = req.body.email;
    //console.log(destinatario);
    // send mail with defined transport object
    transporter.sendMail({
        from: '"Comandera 🍴" <lacomandera.resto@gmail.com>', // sender address
        to: `${destinatario}`, // list of receivers
        subject: "¡Bienvenido! ✔", // Subject line
        text: "Usted fue aprobado y ahora podra disfrutar de las caracteristicas de un cliente registrado.", // plain text body
        html: "<html xmlns='https://github.com/413831/2020_TP_PPS_Comanda_2_cuatri'> <head> <meta http-equiv='content-type' content='text/html; charset=utf-8'>              <meta name='viewport' content='width=device-width, initial-scale=1.0;'>             <meta name='format-detection' content='telephone=no'/>                    <style>        body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}        body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }        table, td {  border-collapse: collapse !important; border-spacing: 0; }        img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }        #outlook a { padding: 0; }        .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }                /* Rounded corners for advanced mail clients only */         @media all and (min-width: 560px) {            .container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px; }        }                /* Set color for auto links (addresses, dates, etc.) */         a, a:hover {            color: #FFFFFF;        }        .footer a, .footer a:hover {            color: #828999;        }                     </style>                    <title>Comandera</title>                </head>                <body topmargin='0' rightmargin='0' bottommargin='0' leftmargin='0' marginwidth='0' marginheight='0' width='100%' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;            background-color: #2D3445;            color: #FFFFFF;'            bgcolor='#2D3445'            text='#FFFFFF'>                <table width='100%' align='center' border='0' cellpadding='0' cellspacing='0' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;' class='background'><tr><td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;'            bgcolor='#2D3445'>                <table border='0' cellpadding='0' cellspacing='0' align='center'            width='500' style='border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;            max-width: 500px;' class='wrapper'>                    <tr>                <td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;                    padding-top: 20px;                    padding-bottom: 20px;'>                                              <a target='_blank' style='text-decoration: none;'                        href='https://github.com/konsav/email-templates/'><img border='0' vspace='0' hspace='0'                                                                                                                                                             src='https://firebasestorage.googleapis.com/v0/b/tp2-comanda-pps.appspot.com/o/readme%2Ficono_food.png?alt=media&token=a3afc41b-5306-42f3-8a3c-dd709c29e0ba'                                                                                                                                                             width='100' height='100'                        alt='Logo' title='Logo' style='                        color: #FFFFFF;                        font-size: 10px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;' /></a>                        </td>            </tr>                    <tr>                <td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;                    padding-top: 0px;' class='hero'><a target='_blank' style='text-decoration: none;'                    href='https://github.com/konsav/email-templates/'><img border='0' vspace='0' hspace='0'                    src='https://firebasestorage.googleapis.com/v0/b/tp2-comanda-pps.appspot.com/o/readme%2Flogo.png?alt=media&token=99928d52-07f6-42b1-b8fe-ad8da6f78413'                    alt='Please enable images to view this content' title='Hero Image'                    width='340' style='                    width: 87.5%;                    max-width: 340px;                    color: #FFFFFF; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;'/></a></td>            </tr>            <tr>                <td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 14px; font-weight: 400; line-height: 150%; letter-spacing: 2px;                    padding-top: 27px;                    padding-bottom: 0;                    color: #FFFFFF;                    font-family: sans-serif;' class='supheader'>                        La Comandera                </td>            </tr>         <tr>                <td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;  padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;                    padding-top: 5px;                    color: #FFFFFF;                    font-family: sans-serif;' class='header'>                        Bienvenido                </td>            </tr>              <tr>                <td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;                    padding-top: 15px;                     color: #FFFFFF;                    font-family: sans-serif;' class='paragraph'>                        Usted ha sido aceptado como&nbsp; cliente registrado.&nbsp;&nbsp;Ahora podrá disfrutar de los beneficios de pertenecer&nbsp;a&nbsp;esta gran familia&nbsp;— &nbsp;Esperamos verlo pronto por nuestros locales&nbsp;&nbsp;—&nbsp;Movimentarios SRL.                </td>            </tr>         <tr>                <td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;                    padding-top: 25px;                    padding-bottom: 5px;' class='button'><a                    href='https://github.com/konsav/email-templates/' target='_blank' style='text-decoration: underline;'>                        <table border='0' cellpadding='0' cellspacing='0' align='center' style='max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;'><tr><td align='center' valign='middle' style='padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;'                            bgcolor='#E9703E'><a target='_blank' style='text-decoration: underline;                            color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;'                            href='https://github.com/413831/2020_TP_PPS_Comanda_2_cuatri'>                                En GitHub                            </a>                    </td></tr></table></a>                </td>            </tr>                    <tr>                <td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;                    padding-top: 30px;' class='line'><hr                    color='#565F73' align='center' width='100%' size='1' noshade style='margin: 0; padding: 0;' />                </td>            </tr>                    <tr>                <td align='center' valign='top' style='border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;                    padding-top: 10px;                    padding-bottom: 20px;                    color: #828999;                    font-family: sans-serif;' class='footer'>                                Este email fue enviado automaticamente cuando usted fue aceptado desde &nbsp;nuestro servidor dedicado&nbsp;a&nbsp;el&nbsp;proyecto&nbsp;La comandera.&nbsp;Para la materia Practica Profesional Supervisada UTN fra.&nbsp; Integrantes:                       <a href='https://github.com/Dfedericovera/' target='_blank' style='text-decoration: underline; color: #828999; font-family: sans-serif; font-size: 13px; font-weight: 400; line-height: 150%;'>Federico Vera</a>,        <a href='https://github.com/413831' target='_blank' style='text-decoration: underline; color: #828999; font-family: sans-serif; font-size: 13px; font-weight: 400; line-height: 150%;'>Alejandro Planes</a>,                    <a href='https://github.com/LeandroEgea/' target='_blank' style='text-decoration: underline; color: #828999; font-family: sans-serif; font-size: 13px; font-weight: 400; line-height: 150%;'>Leandro Egea</a>                                </td>            </tr>                </table>                </td></tr></table>                </body>        </html>",
    }).then(() => {
        res.send('Correo enviado!');
    })
        .catch(error => {
            res.send('Error', error);
        });

});


module.exports = app;

if (require.main === module) {
    const serverPort = process.env.PORT || port;
    app.listen(serverPort, () => {
        console.log('Listening on port ' + serverPort);
    });
}
