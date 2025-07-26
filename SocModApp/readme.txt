#nejprve nainstalovat nvm a pomoci toho aktualni node (detaily vygooglit/zeptat se gpt)

#pouzivam powershell, ten defaultne nechce spoustet skripty, tak povolime
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

#ruzne prikazy ktere jsem spoustel, nevim co je zapotrebi a co uz ne !!!!

#priprava
npm init -y
npm install --save-dev typescript
npx tsc --init
#instalce nastroje vite
npm install vite --save-dev
#instalace podpory unit testu
npm install -D vitest
npm install -D @vitest/ui

#stazeni knihoven podle package.json
npm install

#lokalni spusteni v dev rezimu (bez buildu)
npm run dev

#build a lokalni spusteni zbuildeneho
npm run build
npm run preview

#spusteni testu z prikazove radky
npm run test
#spusteni testu s prohlizecovym ui
npm run test:ui

spusteni simulace z node
node .\node\simulate.js

#bezpecnostni aktualizace balicku
npm audit fix 
#bezpecnostni aktualizace balicku - vcetne breaking change
npm audit fix --force