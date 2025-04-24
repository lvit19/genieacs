# 📘 Documentação de Testes – API GenieACS & Comportamento de Dispositivos CPE (TR-069)

## 🧭 Introdução

Esta documentação cobre a utilização da API de gerenciamento TR-069 com o **GenieACS**, detalhando o comportamento de diferentes dispositivos CPE (Customer Premises Equipment) em testes de automação e controle remoto de parâmetros como SSID, senha, reboot e canal WLAN.

---

## 🔧 Ambiente de Testes

- **Interface Web**: Porta `3000`  
- **API**: Porta `7557`  
- **Configuração TR-069**: Porta `7547`  
- **Dispositivos testados**:
  - ZTE ONT
  - Greatek v1
  - Greatek v2

---

## 📡 Endpoints da API

### 🔹 Reiniciar dispositivo  
**POST** `/devices/<device-id>/tasks?timeout=3000&connection_request`  
\`\`\`json
{
  "name": "reboot"
}
\`\`\`

### 🔹 Listar dispositivos  
**GET** `/devices`  

### 🔹 Capturar parâmetros do dispositivo  
**POST** `/devices/<device-id>/tasks?connection_request`  
\`\`\`json
{
  "name": "getParameterValues",
  "parameterNames": [
    "InternetGatewayDevice"
  ]
}
\`\`\`

### 🔹 Definir parâmetros do dispositivo  
**POST** `/devices/<device-id>/tasks?connection_request`  
\`\`\`json
{
  "name": "setParameterValues",
  "parameterValues": [
    ["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.SSID", "Grealeevit 5G - API", "xsd:string"],
    ["InternetGatewayDevice.LANDevice.1.WLANConfiguration.2.SSID", "Grealeevit 2.4G - API", "xsd:string"],
    ["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.1.PreSharedKey", "levit1906", "xsd:string"],
    ["InternetGatewayDevice.LANDevice.1.WLANConfiguration.1.PreSharedKey.2.PreSharedKey", "levit1906", "xsd:string"]
  ]
}
\`\`\`

### 🔹 Listar tarefas  
**GET** `/tasks`  

### 🔹 Remover tarefa  
**DELETE** `/tasks/<task-id>`  

---

## 🌐 Comportamento da Interface Web

- Mostra dispositivos como "online", mas operações frequentemente falham.
- **ZTE**: Retorna erros ao tentar aplicar comandos.
- **Greatek**: Apresenta status "offline" mesmo com conexão ativa.
- Valores só atualizam após **captura de parâmetros** via API.

---

## 🧪 Comportamento via API

- Mesmos erros da interface web, porém:
  - **Reboot via API** força a execução de tarefas em fila.
  - **Mais confiável que a interface web** para comandos.
  - Alterações nem sempre refletidas na interface — requerem captura adicional de parâmetros.
  
---

## 📶 Análise por Dispositivo

### 🔸 ZTE ONT

- **Estabilidade**: Muito instável
- **Configuração WLAN**:
  - WLAN 1: 2.4GHz
  - WLAN 5: 5.8GHz
- **Testes realizados**:
  - Diversos erros ao tentar alterar parâmetros
  - Interface frequentemente falha ao processar comandos
- **Conclusão**:
  - **Menor compatibilidade com GenieACS**

---

### 🔸 Greatek v1

- **Estabilidade**: Alta estabilidade nos testes
- **Configuração WLAN**:
  - WLAN 1: 2.4GHz
  - WLAN 2: 5.8GHz
- **Testes realizados**:
  - Alteração de SSID e senha via API → aplicadas com sucesso
  - Reboot via API → eficaz, com padrão de até **3 minutos de atraso**
  - Interface reflete parâmetros corretamente após reinício
- **Conclusão**:
  - **Melhor comportamento geral entre os dispositivos testados**

---

### 🔸 Greatek v2

- **Estabilidade**: Inicialmente instável, mas melhorou nos testes mais recentes
- **Configuração WLAN**:
  - WLAN 1: 5.8GHz
  - WLAN 2: 2.4GHz
- **Testes realizados**:
  - Sobe apenas com SSID e senha base de fábrica
  - Parâmetros gerais carregados via API em até 1 min
  - Alteração de SSID e senha:
    - `PreSharedKey` não teve efeito
    - Sucesso ao usar `KeyPassphrase` + reboot via API
  - Alteração de canal + reboot → OK
  - Requere **captura de parâmetros via API** para refletir mudanças na interface
  - Reboots via API em **~1 minuto**, sem falhas
- **Conclusão**:
  - **Funcionamento agora previsível**, com reboots confiáveis
  - Requer atenção à forma correta de definir senha (`KeyPassphrase`)

---

## 📌 Conclusões Gerais

- **Reinício do dispositivo (manual ou via API)** é necessário para aplicar alterações pendentes
- API é mais confiável do que a interface web, embora exija controle mais próximo
- **Greatek v1**: Dispositivo mais compatível com o GenieACS, aplica e reflete mudanças corretamente
- **Greatek v2**: Evoluiu nos testes; agora funcional, embora requeira captura ativa de parâmetros para refletir atualizações
- **ZTE ONT**: Muito instável e com pouca compatibilidade com automações via API
- Reboots via API são geralmente concluídos em até **1 minuto** (v1 e v2)
- Diferença entre `PreSharedKey` e `KeyPassphrase` deve ser considerada para alterações de senha
