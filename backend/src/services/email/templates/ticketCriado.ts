export const ticketCriadoTemplate = (codigo: string): string => {
    return  `
                <div style="font-family: Verdana, sans-serif; font-size: 18px; text-align: center; padding: 20px;">
                    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; 
                                box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1); background-color: #f9f9f9;">
                        <p style="font-weight: bold; font-size: 22px;">Agradecemos por entrar em contato!</p>
                        
                        <p style="font-size: 20px;">Seu chamado foi registrado com sucesso e recebeu o código:</p>
                        <p style="font-size: 24px; font-weight: bold; background-color: #007bff; color: white; padding: 10px; 
                                  display: inline-block; border-radius: 5px;">
                            ${codigo}
                        </p>
        
                        <p style="font-size: 18px; text-align: left; margin-top: 20px;">
                            Para acompanhar o andamento ou enviar novas informações, basta responder a este e-mail.
                        </p>
        
                        <p style="font-size: 18px; text-align: left;">Estamos à disposição para ajudar!</p>
        
                        <p style="font-size: 18px; text-align: left;"><strong>Equipe T.I Fatec Bragança Paulista</strong></p>
        
                        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">
        
                        <img src="cid:logo" alt="Fatec Bragança Paulista" style="max-width: 100%; height: auto; border-radius: 5px;">
                    </div>
                </div>
            `

}