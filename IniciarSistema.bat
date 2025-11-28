@echo off

:: Rodar backend
cd C:\Users\daniel.brandao\Documents\ServiceDesk\backend
start cmd /k "npm run dev"

:: Rodar frontend
cd C:\Users\daniel.brandao\Documents\ServiceDesk\frontend
start cmd /k "npx serve -s dist"

:: Rodar comando MySQL
cd C:\Program Files\MySQL\MySQL Server 8.0\bin
mysql -u root -pftcbp183 -e "SET GLOBAL max_allowed_packet = 64*1024*1024;"

:: Exemplo de uma confirmação após o comando
echo Comando do MySQL executado.
pause
