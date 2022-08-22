import express, { NextFunction, Request, Response } from "express";
import { postNewProposal, putProposalIsActive, putProposalState, updateProposalWorkerPremium } from "../controllers/proposalController";
import { ProposalType } from "../types";
import transporter from "../utils/nodemailer/nodemailerConfig";
const { REWORK_MAIL } = process.env;
const {UserWorker, Proposal, UserClient, Offer} = require ('../db');

const proposal = express.Router();

proposal.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const {idWorker, idOffer, ...proposal } = req.body;
  try {
    let response: string;
    response = await postNewProposal(proposal, idOffer, idWorker);
    const offer:any = await Offer.findByPk(idOffer, {
      include: [UserClient]
    })
    const offerJson = offer.toJSON()
    transporter.sendMail({
      from: `"REWork" <${REWORK_MAIL}>`,
        to: offerJson.userClient.user_mail, 
        subject: "Tu oferta de trabajo ha recibido una propuesta",
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
            <style>
                p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Poppins', sans-serif !important;}
                h1{ font-size: 30px !important;}
                h2{ font-size: 25px !important;}
                h3{ font-size: 18px !important;}
                h4{ font-size: 16px !important;}
                p{font-size: 15px !important;}
                a{font-size: 30px !important;}
        
                .claseBoton{
                    width: 30%;
                        background-color: #fcae3b;
                        border: 2px solid #fcae3b;
                        color: black; 
                        padding: 16px 32px;
                        text-align: center;
                        text-decoration: none;
                        font-weight: bold;
                        display: inline-block;
                        font-size: 16px;
                        margin: 4px 2px;
                        transition-duration: 0.4s;
                        cursor: pointer;
                }
                .claseBoton:hover{
                    background-color: #000000;
                    color: #ffffff;
                }
                .imag{
                    width: 20px;
                    height: 20px;
                }
                .contA{
                    margin: 0px 5px 0 5px;
                }
                .afooter{
                    color: #ffffff !important; 
                    text-decoration: none;
                    font-size: 13px !important;
                }
            </style>
        </head>
        <body>
            <div style="width: 100%; background-color: #e3e3e3;">
                <div style="padding: 20px 10px 20px 10px;">
                    <!-- Contenido principal -->
                    <div style="background-color: #ffffff; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                        <h1>¡Felicitaciones, tu oferta de trabajo: ${offerJson.title} recibió una nueva propuesta!</h1>
                        <p>Accede a verla en el detalle de tu oferta o a través del siguiente link.</p>
                        <a class="claseBoton" href="http://localhost:3000/detailOffer/${offerJson.idOffer}">Detalle de oferta</a>
                        <!-- Gracias -->
        
                    </div>
                    <!-- Contenido principal -->
        
                    <!-- Footer -->
                    <div style="background-color: #ffffff; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                        <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                            © 2022 REwork, todos los derechos reservados.
                        </p>
                    </div>
                    <!-- Footer -->
        
                </div>
            </div>
        </body>
        </html>`
    })
    res.json(response);
  } catch (error) {
    next(error);
  }
});

proposal.put("/state", async (req: Request, res: Response, next: NextFunction) => {
  const { id, state } = req.body;
  try {
      const proposalState: String = await putProposalState(id, state);
      const proposal:any = await Proposal.findByPk(id, {
        include: [UserWorker, {model: Offer, include: UserClient}]
      })
      const proposalJson:any = proposal.toJSON()
      console.log("el user client: ", proposalJson)
      if (state === "accepted"){
            transporter.sendMail({
          from: `"REWork" <${REWORK_MAIL}>`,
            to: proposalJson.userWorker.user_mail, 
            subject: "Aceptaron tu propuesta de trabajo",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
                <style>
                    p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Poppins', sans-serif !important;}
                    h1{ font-size: 30px !important;}
                    h2{ font-size: 25px !important;}
                    h3{ font-size: 18px !important;}
                    h4{ font-size: 16px !important;}
                    p{font-size: 15px !important;}
                    a{font-size: 30px !important;}
            
                    .claseBoton{
                        width: 30%;
                            background-color: #fcae3b;
                            border: 2px solid #fcae3b;
                            color: black; 
                            padding: 16px 32px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            transition-duration: 0.4s;
                            cursor: pointer;
                    }
                    .claseBoton:hover{
                        background-color: #000000;
                        color: #ffffff;
                    }
                    .imag{
                        width: 20px;
                        height: 20px;
                    }
                    .contA{
                        margin: 0px 5px 0 5px;
                    }
                    .afooter{
                        color: #ffffff !important; 
                        text-decoration: none;
                        font-size: 13px !important;
                    }
                </style>
            </head>
            <body>
                <div style="width: 100%; background-color: #e3e3e3;">
                    <div style="padding: 20px 10px 20px 10px;">
                        <!-- Contenido principal -->
                        <div style="background-color: #ffffff; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                            <h1>¡Felicitaciones, aceptaron tu propuesta en la oferta: ${proposalJson.offer.title}!</h1>
                            <p>Sólo falta que leas y aceptes el contrato en el siguiente link.</p>
                            <a class="claseBoton" href="http://localhost:3000/contract/${proposalJson.offer.idOffer}">Contrato</a>
                            <!-- Gracias -->
            
                            <!-- Botón -->
                            <a class="claseBoton" href="http://localhost:3000/detailOffer/${proposalJson.offer.idOffer}">Click aquí para ir a la oferta</a>
                        </div>
                        <!-- Contenido principal -->
            
                        <!-- Footer -->
                        <div style="background-color: #ffffff; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                            <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                                © 2022 REwork, todos los derechos reservados.
                            </p>
                        </div>
                        <!-- Footer -->
            
                    </div>
                </div>
            </body>
            </html>`
        })
        res.send(proposalState);
      } else if (state === "rejected") {
        transporter.sendMail({
          from: `"REWork" <${REWORK_MAIL}>`,
            to: proposalJson.userWorker.user_mail,
            subject: "La oferta a la que aplicaste se cerró",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
                <style>
                    p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Poppins', sans-serif !important;}
                    h1{ font-size: 30px !important;}
                    h2{ font-size: 25px !important;}
                    h3{ font-size: 18px !important;}
                    h4{ font-size: 16px !important;}
                    p{font-size: 15px !important;}
                    a{font-size: 30px !important;}
            
                    .claseBoton{
                        width: 30%;
                            background-color: #fcae3b;
                            border: 2px solid #fcae3b;
                            color: black; 
                            padding: 16px 32px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            transition-duration: 0.4s;
                            cursor: pointer;
                    }
                    .claseBoton:hover{
                        background-color: #000000;
                        color: #ffffff;
                    }
                    .imag{
                        width: 20px;
                        height: 20px;
                    }
                    .contA{
                        margin: 0px 5px 0 5px;
                    }
                    .afooter{
                        color: #ffffff !important; 
                        text-decoration: none;
                        font-size: 13px !important;
                    }
                </style>
            </head>
            <body>
                <div style="width: 100%; background-color: #e3e3e3;">
                    <div style="padding: 20px 10px 20px 10px;">
                        <!-- Contenido principal -->
                        <div style="background-color: #ffffff; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                            <h1>La oferta: ${proposalJson.offer.title} a la que habías aplicado una propuesta, ya ha terminado</h1>
            
                            <!-- Gracias -->
            
                            <!-- Botón -->
                            <a class="claseBoton" href="http://localhost:3000/detailOffer/${proposalJson.offer.idOffer}">Click aquí para ir a la oferta</a>
                        </div>
                        <!-- Contenido principal -->
            
                        <!-- Footer -->
                        <div style="background-color: #ffffff; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                            <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                                © 2022 REwork, todos los derechos reservados.
                            </p>
                        </div>
                        <!-- Footer -->
            
                    </div>
                </div>
            </body>
            </html>`
        })
        res.send(proposalState); 
      } else if (state === "cancelled"){
        transporter.sendMail({
          from: `"REWork" <${REWORK_MAIL}>`,
            to: proposalJson.userWorker.user_mail,
            subject: "Has cancelado tu propuesta",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
                <style>
                    p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Poppins', sans-serif !important;}
                    h1{ font-size: 30px !important;}
                    h2{ font-size: 25px !important;}
                    h3{ font-size: 18px !important;}
                    h4{ font-size: 16px !important;}
                    p{font-size: 15px !important;}
                    a{font-size: 30px !important;}
            
                    .claseBoton{
                        width: 30%;
                            background-color: #fcae3b;
                            border: 2px solid #fcae3b;
                            color: black; 
                            padding: 16px 32px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            transition-duration: 0.4s;
                            cursor: pointer;
                    }
                    .claseBoton:hover{
                        background-color: #000000;
                        color: #ffffff;
                    }
                    .imag{
                        width: 20px;
                        height: 20px;
                    }
                    .contA{
                        margin: 0px 5px 0 5px;
                    }
                    .afooter{
                        color: #ffffff !important; 
                        text-decoration: none;
                        font-size: 13px !important;
                    }
                </style>
            </head>
            <body>
                <div style="width: 100%; background-color: #e3e3e3;">
                    <div style="padding: 20px 10px 20px 10px;">
                        <!-- Contenido principal -->
                        <div style="background-color: #ffffff; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                            <h1>Lamentamos que hayas cancelado tu propuesta</h1>
                            <p>A no desanimarse, dirígete a nuestra página principal para aplicar a otras fabulosas ofertas</p>
                            <!-- Gracias -->
            
                            <!-- Botón -->
                            <a class="claseBoton" href="http://localhost:3000/home">Click aquí</a>
                        </div>
                        <!-- Contenido principal -->
            
                        <!-- Footer -->
                        <div style="background-color: #ffffff; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                            <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                                © 2022 REwork, todos los derechos reservados.
                            </p>
                        </div>
                        <!-- Footer -->
            
                    </div>
                </div>
            </body>
            </html>`
        })
        res.send(proposalState);
      } else if (state === "contract accepted"){
        transporter.sendMail({
          from: `"REWork" <${REWORK_MAIL}>`,
            to: proposalJson.offer.userClient.user_mail,
            subject: "Firma de contrato",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
                <style>
                    p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Poppins', sans-serif !important;}
                    h1{ font-size: 30px !important;}
                    h2{ font-size: 25px !important;}
                    h3{ font-size: 18px !important;}
                    h4{ font-size: 16px !important;}
                    p{font-size: 15px !important;}
                    a{font-size: 30px !important;}
            
                    .claseBoton{
                        width: 30%;
                            background-color: #fcae3b;
                            border: 2px solid #fcae3b;
                            color: black; 
                            padding: 16px 32px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            transition-duration: 0.4s;
                            cursor: pointer;
                    }
                    .claseBoton:hover{
                        background-color: #000000;
                        color: #ffffff;
                    }
                    .imag{
                        width: 20px;
                        height: 20px;
                    }
                    .contA{
                        margin: 0px 5px 0 5px;
                    }
                    .afooter{
                        color: #ffffff !important; 
                        text-decoration: none;
                        font-size: 13px !important;
                    }
                </style>
            </head>
            <body>
                <div style="width: 100%; background-color: #e3e3e3;">
                    <div style="padding: 20px 10px 20px 10px;">
                        <!-- Contenido principal -->
                        <div style="background-color: #ffffff; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                            <h1>Solo falta firmar el contrato para que empiece el trabajo el freelancer, puedes ingresar a través del siguiente link</h1>
            
                            <!-- Gracias -->
            
                            <!-- Botón -->
                            <a class="claseBoton" href="http://localhost:3000/contract/${proposalJson.offer.idOffer}">Click aquí</a>
                        </div>
                        <!-- Contenido principal -->
            
                        <!-- Footer -->
                        <div style="background-color: #ffffff; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                            <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                                © 2022 REwork, todos los derechos reservados.
                            </p>
                        </div>
                        <!-- Footer -->
            
                    </div>
                </div>
            </body>
            </html>`
        })
        res.send(proposalState);
      } else if (state === "contract started") {
        transporter.sendMail({
          from: `"REWork" <${REWORK_MAIL}>`,
            to: proposalJson.userWorker.user_mail,
            subject: "Todo listo para empezar",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
                <style>
                    p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Poppins', sans-serif !important;}
                    h1{ font-size: 30px !important;}
                    h2{ font-size: 25px !important;}
                    h3{ font-size: 18px !important;}
                    h4{ font-size: 16px !important;}
                    p{font-size: 15px !important;}
                    a{font-size: 30px !important;}
            
                    .claseBoton{
                        width: 30%;
                            background-color: #fcae3b;
                            border: 2px solid #fcae3b;
                            color: black; 
                            padding: 16px 32px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            transition-duration: 0.4s;
                            cursor: pointer;
                    }
                    .claseBoton:hover{
                        background-color: #000000;
                        color: #ffffff;
                    }
                    .imag{
                        width: 20px;
                        height: 20px;
                    }
                    .contA{
                        margin: 0px 5px 0 5px;
                    }
                    .afooter{
                        color: #ffffff !important; 
                        text-decoration: none;
                        font-size: 13px !important;
                    }
                </style>
            </head>
            <body>
                <div style="width: 100%; background-color: #e3e3e3;">
                    <div style="padding: 20px 10px 20px 10px;">
                        <!-- Contenido principal -->
                        <div style="background-color: #ffffff; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                            <h1>¡Felicitaciones, ya puedes empezar!</h1>
                              <p>Te brindamos los datos del cliente para que puedas ponerte en contacto y llevar a cabo el trabajo:
                              Nombre: ${proposalJson.offer.userClient.name}
                              Mail: ${proposalJson.offer.userClient.user_mail} </p>

                              Detalle de la oferta de empleo en el siguiente link
                            <!-- Gracias -->
            
                            <!-- Botón -->
                            <a class="claseBoton" href="http://localhost:3000/detailOffer/${proposalJson.offer.idOffer}">Click aquí</a>
                        </div>
                        <!-- Contenido principal -->
            
                        <!-- Footer -->
                        <div style="background-color: #ffffff; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                            <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                                © 2022 REwork, todos los derechos reservados.
                            </p>
                        </div>
                        <!-- Footer -->
            
                    </div>
                </div>
            </body>
            </html>`
        })
        res.send(proposalState);
      } else if (state === "contract rejected") {
          transporter.sendMail({
            from: `"REWork" <${REWORK_MAIL}>`,
              to: proposalJson.userWorker.user_mail,
              subject: "El contrato ha sido rechazado",
              html: `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
              
                  <style>
                      p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Poppins', sans-serif !important;}
                      h1{ font-size: 30px !important;}
                      h2{ font-size: 25px !important;}
                      h3{ font-size: 18px !important;}
                      h4{ font-size: 16px !important;}
                      p{font-size: 15px !important;}
                      a{font-size: 30px !important;}
              
                      .claseBoton{
                          width: 30%;
                              background-color: #fcae3b;
                              border: 2px solid #fcae3b;
                              color: black; 
                              padding: 16px 32px;
                              text-align: center;
                              text-decoration: none;
                              font-weight: bold;
                              display: inline-block;
                              font-size: 16px;
                              margin: 4px 2px;
                              transition-duration: 0.4s;
                              cursor: pointer;
                      }
                      .claseBoton:hover{
                          background-color: #000000;
                          color: #ffffff;
                      }
                      .imag{
                          width: 20px;
                          height: 20px;
                      }
                      .contA{
                          margin: 0px 5px 0 5px;
                      }
                      .afooter{
                          color: #ffffff !important; 
                          text-decoration: none;
                          font-size: 13px !important;
                      }
                  </style>
              </head>
              <body>
                  <div style="width: 100%; background-color: #e3e3e3;">
                      <div style="padding: 20px 10px 20px 10px;">
                          <!-- Contenido principal -->
                          <div style="background-color: #ffffff; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                              <h1>Lamentamos que el cliente haya rechazado el contrato</h1>
                                <p>¡A no desanimarse, dirígete con el siguiente link a la página principal para buscar nuevas ofertas!</p>
  
                              <!-- Gracias -->
              
                              <!-- Botón -->
                              <a class="claseBoton" href="http://localhost:3000/home">Click aquí</a>
                          </div>
                          <!-- Contenido principal -->
              
                          <!-- Footer -->
                          <div style="background-color: #ffffff; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                              <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                                  © 2022 REwork, todos los derechos reservados.
                              </p>
                          </div>
                          <!-- Footer -->
              
                      </div>
                  </div>
              </body>
              </html>`
          })
          res.send(proposalState);
      } else if (state === "finalized"){
        transporter.sendMail({
          from: `"REWork" <${REWORK_MAIL}>`,
            to: proposalJson.offer.userClient.user_mail,
            subject: "¡Trabajo finalizado!",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
                <style>
                    p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Poppins', sans-serif !important;}
                    h1{ font-size: 30px !important;}
                    h2{ font-size: 25px !important;}
                    h3{ font-size: 18px !important;}
                    h4{ font-size: 16px !important;}
                    p{font-size: 15px !important;}
                    a{font-size: 30px !important;}
            
                    .claseBoton{
                        width: 30%;
                            background-color: #fcae3b;
                            border: 2px solid #fcae3b;
                            color: black; 
                            padding: 16px 32px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            transition-duration: 0.4s;
                            cursor: pointer;
                    }
                    .claseBoton:hover{
                        background-color: #000000;
                        color: #ffffff;
                    }
                    .imag{
                        width: 20px;
                        height: 20px;
                    }
                    .contA{
                        margin: 0px 5px 0 5px;
                    }
                    .afooter{
                        color: #ffffff !important; 
                        text-decoration: none;
                        font-size: 13px !important;
                    }
                </style>
            </head>
            <body>
                <div style="width: 100%; background-color: #e3e3e3;">
                    <div style="padding: 20px 10px 20px 10px;">
                        <!-- Contenido principal -->
                        <div style="background-color: #ffffff; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                            <h1>¡Felicidades, el freelancer ha marcado el trabajo como finalizado!</h1>
                              <p>Por favor dirígete a tu oferta para marcarla como finalizada así liberamos el pago</p>

                              Link para ir a tu oferta, recuerda estar logueado.
                            <!-- Gracias -->
            
                            <!-- Botón -->
                            <a class="claseBoton" href="http://localhost:3000/detailOffer/${proposalJson.offer.idOffer}">Click aquí</a>
                        </div>
                        <!-- Contenido principal -->
            
                        <!-- Footer -->
                        <div style="background-color: #ffffff; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                            <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                                © 2022 REwork, todos los derechos reservados.
                            </p>
                        </div>
                        <!-- Footer -->
            
                    </div>
                </div>
            </body>
            </html>`
        })
        res.send(proposalState);
      } else if (state === "released payment"){
        transporter.sendMail({
          from: `"REWork" <${REWORK_MAIL}>`,
            to: proposalJson.userWorker.user_mail,
            subject: "¡Felicitaciones, el pago a sido liberado!",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            
                <style>
                    p, a, h1, h2, h3, h4, h5, h6 {font-family: 'Poppins', sans-serif !important;}
                    h1{ font-size: 30px !important;}
                    h2{ font-size: 25px !important;}
                    h3{ font-size: 18px !important;}
                    h4{ font-size: 16px !important;}
                    p{font-size: 15px !important;}
                    a{font-size: 30px !important;}
            
                    .claseBoton{
                        width: 30%;
                            background-color: #fcae3b;
                            border: 2px solid #fcae3b;
                            color: black; 
                            padding: 16px 32px;
                            text-align: center;
                            text-decoration: none;
                            font-weight: bold;
                            display: inline-block;
                            font-size: 16px;
                            margin: 4px 2px;
                            transition-duration: 0.4s;
                            cursor: pointer;
                    }
                    .claseBoton:hover{
                        background-color: #000000;
                        color: #ffffff;
                    }
                    .imag{
                        width: 20px;
                        height: 20px;
                    }
                    .contA{
                        margin: 0px 5px 0 5px;
                    }
                    .afooter{
                        color: #ffffff !important; 
                        text-decoration: none;
                        font-size: 13px !important;
                    }
                </style>
            </head>
            <body>
                <div style="width: 100%; background-color: #e3e3e3;">
                    <div style="padding: 20px 10px 20px 10px;">
                        <!-- Contenido principal -->
                        <div style="background-color: #ffffff; padding: 20px 0px 5px 0px; width: 100%; text-align: center;">
                            <h1>¡Felicidades, el pago ya ha sido transferido a tu cuenta!</h1>
                              
                              <p>Sigue aplicando a mas ofertas.</p>
                            <!-- Gracias -->
            
                            <!-- Botón -->
                            <a class="claseBoton" href="http://localhost:3000/home">Click aquí</a>
                        </div>
                        <!-- Contenido principal -->
            
                        <!-- Footer -->
                        <div style="background-color: #ffffff; color: #ffffff; padding: 5px 0px 0px 0px; width: 100%; text-align: center;">
                            <p style="background-color: black; padding: 10px 0px 10px 0px; font-size: 12px !important;">
                                © 2022 REwork, todos los derechos reservados.
                            </p>
                        </div>
                        <!-- Footer -->
            
                    </div>
                </div>
            </body>
            </html>`
        })
        res.send(proposalState);
      }
      
  } catch (error) {
    next(error);
  }
});

proposal.put("/isActive", async (req: Request, res: Response, next: NextFunction) => {
  const { id, isActive } = req.body;
  try {
      const proposalState: String = await putProposalIsActive(id, isActive);
      res.send(proposalState);
  } catch (error) {
    next(error);
  }
});

proposal.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  const id: string = req.params.id;
  const { remuneration, proposal_description, worked_time }: { remuneration: number, proposal_description: string, worked_time: string } = req.body;
  try {
    const proposalUpdate: ProposalType = await updateProposalWorkerPremium(id, remuneration, proposal_description, worked_time);
    res.json(proposalUpdate);
  } catch (error) {
    next(error);
  };
});

export default proposal;
