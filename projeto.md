# São 3 sub-projetos:

1. Front: Site pras pessoas se cadastrarem, escolherem as moedas e receberem os
   alertas

2. Backend: ---- API que vai alimentar o site: Usuários, lista de moedas com
   valor atual e histórico de valores, e qual usuário está "seguindo" qual moeda

   ---- Processo em background que vai acessar a API das moedas e ficar pegando
   os valores em tempo real e salvando no BD

   ---- Processo que vai verificar os valores atuais das moedas e disparar os
   alertas para os usuários

3. Configuração de servidor

# Dúvidas:

- Essa API que informa o valor das moedas em tempo real é única? Ou é uma API
  pra cada moeda? Ou são algumas APIs, cada uma com uma lista de moedas?

  coingecko API

- Essa(s) API(s) das moedas aceita(m) pings de acesso a cada X segundos, pra
  entregar as informações em tempo real? Ou tem limites de X acessos por
  minuto/hora/dia?

  limite 100 req/min. por volta de 2000 usuários.

- O histórico de valores das moedas precisa ser salvo no banco ou apenas o valor
  atual?

  somente o atual. manter um histórico das notificações

- Quais serão as formas de notificação para o usuário? E-mail, SMS, Alert do
  navegador? Quais navegadores suportar? Chrome, Firefox, Opera, Safari, Edge?

  Browser, telegram

- O front será responsivo, ou seja, deverá ter versão para tablets e celulares?

  sim

- O servidor já está contratado? É servidor cloud (Amazon, Digital Ocean) ou
  hospedagem comum (Hostgator, Locaweb)? Vai ter uma pessoa específica pra fazer
  essa configuração da hospedagem e processos que vão rodar em background?

  Não esta contratado. Não há uma pessoa para configurar.

- O layout do sistema (UI) já está pronto? É no Photoshop, Adobe XD, Figma,
  Skecth?

  não existe layout pronto

- O sistema deverá ter área de administração na qual um usuário admin poderá
  tirar relatórios e controlar mais coisas? ---- Caso sim: Quais relatórios? E o
  que mais será gerenciado?

  Sim, relatório com nome e email dos usuarios.

- O sistema será gratuito para os usuários se cadastrarem ou será pago? No caso
  de pago, será pagamento único ou assinatura? Qual será o gateway de pagamento
  ou gestão de assinaturas (Hotmart, PagSeguro etc)?

  gratuito, a principio, dependendo do custo de manutenção do sistema

  emarciob@gmail.com
